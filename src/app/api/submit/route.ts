import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { autoTranslate } from '@/lib/auto-translator';
import { categories, getCategoryTitle, getCategoryTitleEn } from '@/data/apis';

interface ApiSubmission {
  id: string;
  name: string;
  url: string;
  categoryId: string;
  description: string;
  description_tr?: string;
  description_en?: string;
  rateLimit: string;
  isNoAuth: boolean;
  email?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const SUBMISSIONS_FILE = path.join(process.cwd(), 'src', 'data', 'submissions.json');
const CUSTOM_APIS_FILE = path.join(process.cwd(), 'src', 'data', 'custom-apis.json');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      url,
      categoryId,
      description,
      rateLimit,
      rateLimitMode,
      rateLimitCount,
      rateLimitUnit,
      isNoAuth,
      email,
      hp,
    } = body;

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

    // Helper to extract clean domain for duplicate check
    const extractDomain = (urlStr: string) => {
      try {
        if (!urlStr || !urlStr.trim()) return '';
        const withProto = urlStr.startsWith('http://') || urlStr.startsWith('https://')
          ? urlStr.trim()
          : `https://${urlStr.trim()}`;
        return new URL(withProto).hostname.toLowerCase().replace(/^www\./, '');
      } catch {
        return '';
      }
    };

    const cleanInputName = name.trim().toLowerCase();
    const cleanInputDomain = extractDomain(url);

    // Read custom-apis.json if exists
    let customApisList: any[] = [];
    if (fs.existsSync(CUSTOM_APIS_FILE)) {
      try {
        customApisList = JSON.parse(fs.readFileSync(CUSTOM_APIS_FILE, 'utf8'));
      } catch {
        customApisList = [];
      }
    }

    // Check for duplicates in categories & approved custom-apis
    let existingDuplicate: { name: string; categoryTitle: string } | null = null;

    for (const cat of categories) {
      for (const api of cat.apis) {
        const existingName = api.name.toLowerCase();
        const existingDomain = extractDomain(api.url);

        if (existingName === cleanInputName || (cleanInputDomain && existingDomain && existingDomain === cleanInputDomain)) {
          existingDuplicate = { name: api.name, categoryTitle: cat.title };
          break;
        }
      }
      if (existingDuplicate) break;
    }

    if (!existingDuplicate) {
      for (const customApi of customApisList) {
        const existingName = customApi.name?.toLowerCase();
        const existingDomain = extractDomain(customApi.url);
        if (existingName === cleanInputName || (cleanInputDomain && existingDomain && existingDomain === cleanInputDomain)) {
          existingDuplicate = { name: customApi.name, categoryTitle: customApi.categoryId || 'Custom' };
          break;
        }
      }
    }

    if (existingDuplicate) {
      return NextResponse.json(
        {
          success: false,
          error: `"${existingDuplicate.name}" adlı API zaten kataloğumuzda mevcuttur (${existingDuplicate.categoryTitle}).`,
        },
        { status: 409 }
      );
    }

    // Normalize rate limit into standardized format
    let formattedRateLimit = 'Bilinmiyor';
    if (rateLimitMode === 'unlimited') {
      formattedRateLimit = 'Sınırsız';
    } else if (rateLimitMode === 'variable') {
      formattedRateLimit = 'Değişken';
    } else if (rateLimitMode === 'custom' && rateLimitCount) {
      const unitMap: Record<string, string> = {
        sec: 'istek/sn',
        min: 'istek/dk',
        hour: 'istek/saat',
        day: 'istek/gün',
        month: 'istek/ay',
      };
      const unitStr = unitMap[rateLimitUnit] || 'istek/gün';
      formattedRateLimit = `${Number(rateLimitCount).toLocaleString('tr-TR')} ${unitStr}`;
    } else if (typeof rateLimit === 'string' && rateLimit.trim()) {
      formattedRateLimit = rateLimit.trim().substring(0, 60);
    }

    // Automated Bilingual Translation (TR & EN)
    const rawDesc = description.trim().substring(0, 600);
    let descTr = rawDesc;
    let descEn = rawDesc;

    const isLikelyTurkish = /[ğüşıöçĞÜŞİÖÇ]|(\b(ve|ile|bir|için|olan|servis|ücretsiz)\b)/i.test(rawDesc);
    if (isLikelyTurkish) {
      descTr = rawDesc;
      descEn = await autoTranslate(rawDesc, 'en');
    } else {
      descEn = rawDesc;
      descTr = await autoTranslate(rawDesc, 'tr');
    }

    const newSubmission: ApiSubmission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim().substring(0, 80),
      url: url.trim().substring(0, 300),
      categoryId: categoryId.trim(),
      description: descTr,
      description_tr: descTr,
      description_en: descEn,
      rateLimit: formattedRateLimit,
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

    // Category full readable English name
    const categoryTitleEn = getCategoryTitleEn(newSubmission.categoryId);

    // 1. Discord Webhook Notification
    const discordWebhook = process.env.DISCORD_WEBHOOK_URL;
    if (discordWebhook) {
      try {
        await fetch(discordWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [
              {
                title: `🔥 New API Submission: ${newSubmission.name}`,
                color: 0xe11d48, // Brand Crimson
                fields: [
                  { name: '🌐 URL', value: newSubmission.url, inline: false },
                  { name: '📂 Category', value: categoryTitleEn, inline: true },
                  { name: '⚡ Rate Limit', value: newSubmission.rateLimit, inline: true },
                  { name: '🔑 Zero-Auth', value: newSubmission.isNoAuth ? 'Yes ✅' : 'No 🔑', inline: true },
                  { name: '🇬🇧 Description (EN)', value: newSubmission.description_en || 'N/A', inline: false },
                  { name: '🇹🇷 Description (TR)', value: newSubmission.description_tr || newSubmission.description, inline: false },
                  { name: '📧 Submitter', value: newSubmission.email || 'Not specified', inline: false },
                ],
                footer: { text: `FreeAPI Directory • ${newSubmission.id}` },
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        });
      } catch (webhookErr) {
        console.warn('Discord webhook dispatch warning:', webhookErr);
      }
    }

    // 2. Telegram Bot Notification
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    if (telegramBotToken && telegramChatId) {
      try {
        const escapeHtml = (str: string) =>
          str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        const tgMessage = `🚀 <b>New API Submission Received!</b>\n\n` +
          `📌 <b>Name:</b> ${escapeHtml(newSubmission.name)}\n` +
          `🔗 <b>URL:</b> ${escapeHtml(newSubmission.url)}\n` +
          `📂 <b>Category:</b> <b>${escapeHtml(categoryTitleEn)}</b>\n` +
          `⚡ <b>Rate Limit:</b> ${escapeHtml(newSubmission.rateLimit)}\n` +
          `🔑 <b>Zero-Auth:</b> ${newSubmission.isNoAuth ? 'Yes ✅' : 'No 🔑'}\n\n` +
          `🇬🇧 <b>Description (EN):</b>\n<i>${escapeHtml(newSubmission.description_en || newSubmission.description)}</i>\n\n` +
          `🇹🇷 <b>Description (TR):</b>\n<i>${escapeHtml(newSubmission.description_tr || newSubmission.description)}</i>\n\n` +
          `📧 <b>Submitter:</b> ${escapeHtml(newSubmission.email || 'Not specified')}\n` +
          `🆔 <code>${newSubmission.id}</code>`;

        const host = req.headers.get('host') || 'freeapi.website';
        const siteOrigin = host.includes('localhost')
          ? (process.env.NEXT_PUBLIC_SITE_URL || 'https://freeapi.website')
          : `https://${host}`;
        const adminSecret = process.env.ADMIN_ACTION_SECRET || 'freeapi_admin_sec_2026_super';

        const dataPayload = Buffer.from(JSON.stringify(newSubmission)).toString('base64url');
        const approveUrl = `${siteOrigin}/api/admin/submissions?action=approve&id=${newSubmission.id}&d=${dataPayload}&token=${adminSecret}`;
        const rejectUrl = `${siteOrigin}/api/admin/submissions?action=reject&id=${newSubmission.id}&d=${dataPayload}&token=${adminSecret}`;

        const replyMarkup = {
          inline_keyboard: [
            [
              { text: '✅ Approve & Publish', url: approveUrl },
              { text: '❌ Reject / Delete', url: rejectUrl },
            ],
            [
              { text: '🌐 Preview API Website', url: newSubmission.url },
            ],
          ],
        };

        await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: tgMessage,
            parse_mode: 'HTML',
            reply_markup: replyMarkup,
            disable_web_page_preview: false,
          }),
        });
      } catch (tgErr) {
        console.warn('Telegram notification dispatch warning:', tgErr);
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
