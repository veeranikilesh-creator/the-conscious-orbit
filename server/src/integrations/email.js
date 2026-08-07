import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

/* ============================================================
   EMAIL SERVICE — sends report DOCX to users after admin approval.
   Degrades gracefully: without SMTP config, logs instead of sending.
   ============================================================ */

let transporter = null;

function getTransporter() {
  if (!env.smtp?.host) return null;
  transporter ??= nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port || 587,
    secure: env.smtp.secure || false,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
  });
  return transporter;
}

/**
 * Generate the report HTML with admin's manual analysis.
 */
function buildReportHtml(report) {
  const score = report.score ?? report.adminScore ?? 0;
  const verdict = report.adminVerdict || report.decision || 'PENDING';
  const verdictMap = { GO: 'GO', CONDITIONAL: 'CONDITIONAL', PIVOT: 'PIVOT', REJECT: 'REJECT' };
  const verdictLabel = verdictMap[verdict] || verdict;
  const verdictColor = verdict === 'GO' ? '#16a34a' : verdict === 'REJECT' ? '#dc2626' : verdict === 'PIVOT' ? '#ea580c' : '#ca8a04';

  const strengths = report.adminStrengths
    ? report.adminStrengths.split('\n').filter(Boolean).map(s => `<li style="margin-bottom:4px;">${s.trim()}</li>`).join('')
    : '';
  const risks = report.adminRisks
    ? report.adminRisks.split('\n').filter(Boolean).map(r => `<li style="margin-bottom:4px;">${r.trim()}</li>`).join('')
    : '';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${report.name} — Strategy Report</title></head>
<body style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #1a1a1a;">${report.name}</h1>
  <p style="color: #666;">${(report.vertical || 'startups').toUpperCase()} · PUBLISHED</p>

  <div style="background: #f8f9fa; border: 2px solid #D4AF37; border-radius: 12px; padding: 20px; margin: 20px 0;">
    <h2 style="margin: 0; color: #D4AF37;">Conscious Orbital Score: ${score}/100</h2>
    <span style="display: inline-block; padding: 4px 12px; border-radius: 20px; background: ${verdictColor}; color: white; font-weight: bold; margin-top: 8px;">${verdictLabel}</span>
  </div>

  ${report.adminAnalysis ? `
  <div style="background: #f0fdf4; border: 2px solid #16a34a; border-radius: 12px; padding: 20px; margin: 20px 0;">
    <h3 style="margin: 0 0 12px 0; color: #16a34a;">Our Analysis</h3>
    <p style="color: #166534; line-height: 1.6; white-space: pre-wrap;">${report.adminAnalysis}</p>
  </div>` : ''}

  ${strengths ? `
  <div style="background: #ecfdf5; border-radius: 12px; padding: 20px; margin: 20px 0;">
    <h3 style="margin: 0 0 8px 0; color: #059669;">Strengths</h3>
    <ul style="color: #065f46; margin: 0; padding-left: 20px;">${strengths}</ul>
  </div>` : ''}

  ${risks ? `
  <div style="background: #fef2f2; border-radius: 12px; padding: 20px; margin: 20px 0;">
    <h3 style="margin: 0 0 8px 0; color: #dc2626;">Risks & Concerns</h3>
    <ul style="color: #991b1b; margin: 0; padding-left: 20px;">${risks}</ul>
  </div>` : ''}

  ${report.approvalNote ? `
  <div style="background: #eff6ff; border-radius: 12px; padding: 20px; margin: 20px 0;">
    <h3 style="margin: 0 0 8px 0; color: #2563eb;">Note from Our Team</h3>
    <p style="color: #1e40af; line-height: 1.6;">${report.approvalNote}</p>
  </div>` : ''}

  <p style="color: #999; font-size: 12px; margin-top: 40px;">The Conscious Orbit · ${new Date().toISOString().split('T')[0]}</p>
</body>
</html>`;
}

/**
 * Send the report as a .doc email attachment to the user.
 *
 * @param {object} report  The report document (must have client.email)
 * @param {object} client  The client document (for email)
 * @returns {Promise<{sent: boolean, message: string}>}
 */
export async function sendReportEmail(report, client) {
  const recipientEmail = client?.email;
  if (!recipientEmail) {
    return { sent: false, message: 'No email address on file for this client.' };
  }

  const transporter = getTransporter();
  if (!transporter) {
    console.log(`[EMAIL] SMTP not configured. Would send report "${report.name}" to ${recipientEmail}`);
    return { sent: false, message: 'SMTP not configured — email logged but not sent.' };
  }

  const html = buildReportHtml(report);
  const slug = String(report.name || 'venture')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  try {
    await transporter.sendMail({
      from: env.smtp.from || '"The Conscious Orbit" <reports@consciousorbit.com>',
      to: recipientEmail,
      subject: `Your Venture Strategy Report: ${report.name}`,
      html,
      attachments: [
        {
          filename: `${slug}-strategy-report.doc`,
          content: Buffer.from('\ufeff' + html, 'utf-8'),
          contentType: 'application/msword',
        },
      ],
    });
    return { sent: true, message: `Report emailed to ${recipientEmail}` };
  } catch (error) {
    console.error(`[EMAIL] Failed to send to ${recipientEmail}:`, error.message);
    return { sent: false, message: `Email failed: ${error.message}` };
  }
}
