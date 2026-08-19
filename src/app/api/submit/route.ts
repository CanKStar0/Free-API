import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface ApiSubmission {
  id: string;
  name: string;
  url: string;
  categoryId: string;
  description: string;
  rateLimit: string;
  isNoAuth: boolean;
  email?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const SUBMISSIONS_FILE = path.join(process.cwd(), 'src', 'data', 'submissions.json');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, url, categoryId, description, rateLimit, isNoAuth, email, hp } = body;

    // Honeypot bot trap check
    if (hp) {
      return NextResponse.json({ success: true, message: 'Received' });
    }

    // Required fields validation
    if (!name?.trim() || !url?.trim() || !categoryId?.trim() || !description?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Lütfen zorunlu alanları (İsim, URL, Kategori, Açıklama) doldurun.' },
        { status: 400 }
      );
    }

    // Basic URL format validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Geçerli bir URL formatı girin (örn: https://...).' },
        { status: 400 }
      );
    }

    const newSubmission: ApiSubmission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim().substring(0, 80),
      url: url.trim().substring(0, 300),
      categoryId: categoryId.trim(),
      description: description.trim().substring(0, 500),
      rateLimit: (rateLimit || 'Bilinmiyor').trim().substring(0, 60),
      isNoAuth: Boolean(isNoAuth),
      email: email?.trim().substring(0, 100) || undefined,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    // Store in local JSON file
    try {
      let existingSubmissions: ApiSubmission[] = [];
      if (fs.existsSync(SUBMISSIONS_FILE)) {
        const fileData = fs.readFileSync(SUBMISSIONS_FILE, 'utf8');
        existingSubmissions = JSON.parse(fileData);
      }
      existingSubmissions.unshift(newSubmission);
      fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(existingSubmissions, null, 2), 'utf8');
    } catch (fsErr) {
      console.warn('Submissions file storage warning:', fsErr);
    }

    // Discord Webhook Notification if configured in process.env
    const discordWebhook = process.env.DISCORD_WEBHOOK_URL;
    if (discordWebhook) {
      try {
        await fetch(discordWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [
              {
                title: `🔥 Yeni API Önerisi: ${newSubmission.name}`,
                color: 0xe11d48, // Brand Crimson
                fields: [
                  { name: 'URL', value: newSubmission.url, inline: false },
                  { name: 'Kategori', value: newSubmission.categoryId, inline: true },
                  { name: 'Rate Limit', value: newSubmission.rateLimit, inline: true },
                  { name: 'Zero-Auth', value: newSubmission.isNoAuth ? 'Evet ✅' : 'Hayır 🔑', inline: true },
                  { name: 'Açıklama', value: newSubmission.description, inline: false },
                  { name: 'Gönderen E-posta', value: newSubmission.email || 'Belirtilmedi', inline: false },
                ],
                footer: { text: `FreeAPI Directory Submission • ${newSubmission.id}` },
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        });
      } catch (webhookErr) {
        console.warn('Discord webhook dispatch warning:', webhookErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'API öneriniz başarıyla alındı ve inceleme kuyruğuna eklendi.',
      submissionId: newSubmission.id,
    });
  } catch (error) {
    console.error('Submit API error:', error);
    return NextResponse.json(
      { success: false, error: 'İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
