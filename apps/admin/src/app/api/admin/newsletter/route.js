import { NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@hritikpedia/shared/auth';
import { hasPermission, PERMISSIONS } from '@hritikpedia/shared/permissions';
import { query } from '@hritikpedia/shared/db';
import { dispatchEmail, createUnsubscribeToken } from '@hritikpedia/shared/messaging';

export const maxDuration = 60;

const BATCH_SIZE = 3;
const BATCH_PAUSE_MS = 250;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderParagraphs(content) {
  return escapeHtml(content)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#334155;">${paragraph.replace(
          /\n/g,
          '<br />'
        )}</p>`
    )
    .join('');
}

function buildEmailHtml({ subject, previewText, contentMarkdown, unsubscribeUrl, appUrl }) {
  const safeSubject = escapeHtml(subject);
  const safePreview = escapeHtml(previewText || '');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${safeSubject}</title>
  </head>
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${safePreview}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:#07172B;padding:24px 28px;">
                <div style="font-size:18px;font-weight:800;color:#ffffff;letter-spacing:0.2px;">Hritikpedia</div>
                <div style="font-size:11px;color:#93A4BD;margin-top:4px;text-transform:uppercase;letter-spacing:1px;">Study notes &amp; exam guidance</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 8px;font-size:22px;line-height:1.35;color:#0f172a;">${safeSubject}</h1>
                ${
                  safePreview
                    ? `<p style="margin:0 0 20px;font-size:13px;line-height:1.6;color:#64748b;">${safePreview}</p>`
                    : ''
                }
                ${renderParagraphs(contentMarkdown)}
                <a href="${escapeHtml(
                  `${appUrl}/notes`
                )}" style="display:inline-block;margin-top:8px;padding:10px 18px;background:#2563EB;color:#ffffff;text-decoration:none;border-radius:10px;font-size:13px;font-weight:700;">Browse study notes</a>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;">
                <p style="margin:0 0 10px;font-size:11px;line-height:1.6;color:#64748b;">
                  You are receiving this email because you explicitly subscribed to Hritikpedia academic updates.
                </p>
                <p style="margin:0;font-size:11px;line-height:1.6;color:#64748b;">
                  <a href="${escapeHtml(
                    unsubscribeUrl
                  )}" style="color:#2563EB;font-weight:700;text-decoration:underline;">Unsubscribe from these emails</a>
                  &nbsp;·&nbsp; Hritikpedia, India
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildEmailText({ subject, contentMarkdown, unsubscribeUrl }) {
  return `${subject}\n\n${contentMarkdown}\n\n---\nYou are receiving this email because you subscribed to Hritikpedia updates.\nUnsubscribe: ${unsubscribeUrl}`;
}

async function authorize(request, permission) {
  const token = extractTokenFromRequest(request, 'hritikpedia_admin_session');
  const user = token ? verifyToken(token) : null;
  if (!user || !hasPermission(user.role, permission)) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { user };
}

export async function GET(request) {
  const auth = await authorize(request, PERMISSIONS.CONTENT_VIEW);
  if (auth.error) {
    const newsletterAuth = await authorize(request, PERMISSIONS.NEWSLETTER_MANAGE);
    if (newsletterAuth.error) return newsletterAuth.error;
  }

  try {
    const listRes = await query(`
      SELECT id, email, source, consent_given, status, created_at
      FROM newsletter_subscribers
      ORDER BY created_at DESC
      LIMIT 200
    `);

    const statsRes = await query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'active') as active,
        COUNT(*) FILTER (WHERE status = 'unsubscribed') as unsubscribed
      FROM newsletter_subscribers
    `);

    const configured = Boolean(process.env.RESEND_API_KEY);

    return NextResponse.json({
      subscribers: listRes.rows,
      stats: {
        total: parseInt(statsRes.rows[0]?.total || '0', 10),
        active: parseInt(statsRes.rows[0]?.active || '0', 10),
        unsubscribed: parseInt(statsRes.rows[0]?.unsubscribed || '0', 10),
      },
      emailProvider: configured ? 'resend' : 'console_mock',
      emailConfigured: configured,
      deliveryEnabled: configured || process.env.NODE_ENV !== 'production',
    });
  } catch (err) {
    console.error('Newsletter subscribers error:', err);
    return NextResponse.json({ error: 'Failed to fetch newsletter data' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await authorize(request, PERMISSIONS.NEWSLETTER_MANAGE);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const subject = String(body.subject || '')
      .replace(/[\r\n]+/g, ' ')
      .trim();
    const previewText = String(body.previewText || '')
      .replace(/[\r\n]+/g, ' ')
      .trim();
    const contentMarkdown =
      typeof body.contentMarkdown === 'string' ? body.contentMarkdown.trim() : '';

    if (subject.length < 3 || subject.length > 150) {
      return NextResponse.json(
        { error: 'Subject must be between 3 and 150 characters.' },
        { status: 400 }
      );
    }

    if (previewText.length > 200) {
      return NextResponse.json(
        { error: 'Preview text must be 200 characters or fewer.' },
        { status: 400 }
      );
    }

    if (contentMarkdown.length < 10 || contentMarkdown.length > 20000) {
      return NextResponse.json(
        { error: 'Campaign body must be between 10 and 20,000 characters.' },
        { status: 400 }
      );
    }

    if (process.env.NODE_ENV === 'production' && !process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          error:
            'Email provider is not configured. Set RESEND_API_KEY and EMAIL_FROM before sending a production campaign.',
        },
        { status: 503 }
      );
    }

    const activeSubscribersRes = await query(`
      SELECT email
      FROM newsletter_subscribers
      WHERE status = 'active' AND consent_given = TRUE
      ORDER BY id ASC
    `);
    const recipients = activeSubscribersRes.rows;
    const count = recipients.length;

    if (count === 0) {
      return NextResponse.json(
        { error: 'There are no active, consenting subscribers to email.' },
        { status: 400 }
      );
    }

    const appUrl = (
      process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.NODE_ENV === 'production' ? 'https://hritikpedia.com' : 'http://localhost:3000')
    ).replace(/\/+$/, '');

    const results = [];

    for (let index = 0; index < recipients.length; index += BATCH_SIZE) {
      const batch = recipients.slice(index, index + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async ({ email }) => {
          const unsubscribeUrl = `${appUrl}/unsubscribe?token=${encodeURIComponent(
            createUnsubscribeToken(email)
          )}`;

          const result = await dispatchEmail({
            to: email,
            subject,
            html: buildEmailHtml({
              subject,
              previewText,
              contentMarkdown,
              unsubscribeUrl,
              appUrl,
            }),
            text: buildEmailText({ subject, contentMarkdown, unsubscribeUrl }),
          });

          return { email, ...result };
        })
      );

      results.push(...batchResults);

      if (index + BATCH_SIZE < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, BATCH_PAUSE_MS));
      }
    }

    const delivered = results.filter(
      (result) => result.success && result.provider === 'resend'
    ).length;
    const simulated = results.filter(
      (result) => result.success && result.provider === 'console_mock'
    ).length;
    const failures = results.filter((result) => !result.success);
    const status = failures.length === count ? 'failed' : failures.length > 0 ? 'partial' : 'sent';

    await query(
      `INSERT INTO audit_logs (actor_id, actor_email, action, entity_type, entity_id, details, created_at)
       VALUES ($1, $2, 'newsletter:broadcast', 'campaign', $3, $4, NOW())`,
      [
        auth.user.userId,
        auth.user.email,
        `campaign_${Date.now()}`,
        JSON.stringify({
          subject,
          previewText,
          recipientCount: count,
          delivered,
          simulated,
          failed: failures.length,
          provider: process.env.RESEND_API_KEY ? 'resend' : 'console_mock',
          status,
        }),
      ]
    );

    if (failures.length === count) {
      return NextResponse.json(
        {
          error: `Campaign failed for all ${count} subscribers. ${
            failures[0]?.error || 'Check the email provider configuration.'
          }`,
          recipientCount: count,
          failed: failures.length,
        },
        { status: 502 }
      );
    }

    const parts = [];
    if (delivered > 0) parts.push(`${delivered} delivered`);
    if (simulated > 0) parts.push(`${simulated} simulated (no email provider configured)`);
    if (failures.length > 0) parts.push(`${failures.length} failed`);

    return NextResponse.json({
      success: true,
      status,
      message: `Campaign processed for ${count} active subscribers: ${parts.join(', ')}.`,
      recipientCount: count,
      delivered,
      simulated,
      failed: failures.length,
    });
  } catch (err) {
    console.error('Newsletter broadcast error:', err);
    return NextResponse.json({ error: 'Failed to dispatch broadcast' }, { status: 500 });
  }
}
