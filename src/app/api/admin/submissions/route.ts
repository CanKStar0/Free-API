import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { autoTranslate } from '@/lib/auto-translator';
import { getCategoryTitle, getCategoryTitleEn } from '@/data/apis';

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const id = searchParams.get('id');
  const token = searchParams.get('token');

  const validSecret = process.env.ADMIN_ACTION_SECRET || 'freeapi_admin_sec_2026_super';

  if (!token || token !== validSecret) {
    return new NextResponse(
      `<!DOCTYPE html>
      <html lang="en">
      <head><meta charset="utf-8"/><title>Unauthorized Access</title><meta name="viewport" content="width=device-width, initial-scale=1"/></head>
      <body style="font-family: sans-serif; background: #0f0f12; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center;">
        <div style="background: #1a1a20; padding: 2.5rem; border-radius: 1.5rem; border: 1px solid rgba(239,68,68,0.3); max-width: 400px;">
          <h2 style="color: #ef4444; margin-top: 0;">🚫 Unauthorized Access</h2>
          <p style="color: #aaa; font-size: 0.9rem;">Invalid or expired admin action key.</p>
        </div>
      </body>
      </html>`,
      { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  if (!id || !action || !['approve', 'reject'].includes(action)) {
    return new NextResponse('Invalid request parameters.', { status: 400 });
  }

  try {
    const dParam = searchParams.get('d');
    let submissions: ApiSubmission[] = [];
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      submissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf8'));
    }

    let sub: ApiSubmission | undefined;
    const subIndex = submissions.findIndex((s) => s.id === id);
    const isApprove = action === 'approve';

    if (subIndex !== -1) {
      sub = submissions[subIndex];
      sub.status = isApprove ? 'approved' : 'rejected';
      submissions[subIndex] = sub;
      fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), 'utf8');
    } else if (dParam) {
      try {
        const decodedStr = Buffer.from(dParam, 'base64url').toString('utf8');
        sub = JSON.parse(decodedStr);
        if (sub) {
          sub.status = isApprove ? 'approved' : 'rejected';
          submissions.unshift(sub);
          fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), 'utf8');
        }
      } catch {
        sub = undefined;
      }
    }

    if (!sub) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="en">
        <head><meta charset="utf-8"/><title>Submission Not Found</title><meta name="viewport" content="width=device-width, initial-scale=1"/></head>
        <body style="font-family: sans-serif; background: #0f0f12; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center;">
          <div style="background: #1a1a20; padding: 2.5rem; border-radius: 1.5rem; border: 1px solid #333; max-width: 400px;">
            <h2>⚠️ Submission Not Found</h2>
            <p style="color: #888; font-size: 0.9rem;">No API submission found with this ID or it was already deleted.</p>
          </div>
        </body>
        </html>`,
        { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    // If approved, update custom-apis.json with bilingual descriptions
    if (isApprove) {
      let customApis: any[] = [];
      if (fs.existsSync(CUSTOM_APIS_FILE)) {
        try {
          customApis = JSON.parse(fs.readFileSync(CUSTOM_APIS_FILE, 'utf8'));
        } catch {
          customApis = [];
        }
      }

      let descTr = sub.description_tr || sub.description;
      let descEn = sub.description_en || sub.description;

      if (!sub.description_en && sub.description) {
        descEn = await autoTranslate(sub.description, 'en');
      }

      const existingIdx = customApis.findIndex((a) => a.id === sub.id || (a.name === sub.name && a.url === sub.url));
      const customApiEntry = {
        id: sub.id,
        name: sub.name,
        url: sub.url,
        categoryId: sub.categoryId,
        description: descTr,
        description_tr: descTr,
        description_en: descEn,
        rateLimit: sub.rateLimit,
        isRecommended: true,
        isNew: true,
        isNoAuth: sub.isNoAuth,
        approvedAt: new Date().toISOString(),
      };

      if (existingIdx !== -1) {
        customApis[existingIdx] = customApiEntry;
      } else {
        customApis.unshift(customApiEntry);
      }
      fs.writeFileSync(CUSTOM_APIS_FILE, JSON.stringify(customApis, null, 2), 'utf8');
    } else {
      // If rejected, remove from custom-apis.json
      if (fs.existsSync(CUSTOM_APIS_FILE)) {
        try {
          let customApis = JSON.parse(fs.readFileSync(CUSTOM_APIS_FILE, 'utf8'));
          customApis = customApis.filter((a: any) => a.id !== sub.id);
          fs.writeFileSync(CUSTOM_APIS_FILE, JSON.stringify(customApis, null, 2), 'utf8');
        } catch {
          // ignore
        }
      }
    }

    // Telegram Confirmation Dispatch in English
    const categoryTitleEn = getCategoryTitleEn(sub.categoryId);
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    if (telegramBotToken && telegramChatId) {
      const tgMsg = isApprove
        ? `🎉 <b>API Successfully Approved & Published Live!</b>\n\n📌 <b>${sub.name}</b>\n📂 Category: <b>${categoryTitleEn}</b>\n🔗 <a href="${sub.url}">View API Website</a>`
        : `❌ <b>API Submission Rejected!</b>\n\n📌 <b>${sub.name}</b> has been discarded from queue.`;

      fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: tgMsg,
          parse_mode: 'HTML',
        }),
      }).catch((e) => console.warn('Telegram confirm dispatch warning:', e));
    }

    // Render HTML response page in English
    const title = isApprove ? 'API Approved & Published! 🚀' : 'API Submission Rejected ❌';
    const accentColor = isApprove ? '#10b981' : '#f43f5e';
    const statusText = isApprove
      ? `<b>${sub.name}</b> has been successfully added to catalog and published live on the website.`
      : `<b>${sub.name}</b> submission has been rejected and will not be published.`;

    return new NextResponse(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>${title}</title>
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #09090b;
            color: #fafafa;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 1rem;
          }
          .card {
            background: #141417;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 1.5rem;
            padding: 2.5rem 2rem;
            max-width: 440px;
            width: 100%;
            text-align: center;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          }
          .icon-box {
            width: 4rem;
            height: 4rem;
            border-radius: 1rem;
            background: ${accentColor}1a;
            border: 1px solid ${accentColor}40;
            color: ${accentColor};
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.25rem;
            font-size: 2rem;
          }
          h1 { font-size: 1.35rem; margin: 0 0 0.5rem; font-weight: 700; }
          p { color: #a1a1aa; font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.75rem; }
          .details {
            background: #1e1e24;
            border-radius: 1rem;
            padding: 1rem;
            margin-bottom: 1.5rem;
            text-align: left;
            font-size: 0.85rem;
          }
          .btn {
            display: inline-block;
            background: #e11d48;
            color: #fff;
            padding: 0.75rem 1.5rem;
            border-radius: 0.75rem;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.85rem;
            transition: opacity 0.2s;
          }
          .btn:hover { opacity: 0.9; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon-box">${isApprove ? '✅' : '❌'}</div>
          <h1>${title}</h1>
          <p>${statusText}</p>
          <div class="details">
            <div style="margin-bottom: 0.35rem;"><b>API:</b> ${sub.name}</div>
            <div style="margin-bottom: 0.35rem;"><b>Category:</b> ${categoryTitleEn}</div>
            <div><b>Rate Limit:</b> ${sub.rateLimit}</div>
          </div>
          <a href="/" class="btn">🏠 Return to Directory</a>
        </div>
      </body>
      </html>`,
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  } catch (error) {
    console.error('Admin submission action error:', error);
    return new NextResponse('Server error occurred.', { status: 500 });
  }
}
