const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

// Environment variables (will be provided by GitHub Secrets)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// SMTP Settings (Get these from the same place you configured Supabase SMTP)
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

const EMAIL_TO = process.env.EMAIL_TO;
const EMAIL_FROM = process.env.EMAIL_FROM;

async function sendWeeklyReport() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SMTP_HOST || !SMTP_USER || !SMTP_PASS || !EMAIL_TO) {
    console.error('Missing environment variables. Please check GitHub Secrets (SMTP_HOST, SMTP_USER, SMTP_PASS, etc.).');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // 1. Calculate the date 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const dateString = sevenDaysAgo.toISOString();

  console.log(`Fetching visits since ${dateString}...`);

  // 2. Fetch visit counts
  const { data, count, error } = await supabase
    .from('visits')
    .select('*', { count: 'exact' })
    .gte('created_at', dateString);

  if (error) {
    console.error('Error fetching visits from Supabase:', error);
    process.exit(1);
  }

  console.log(`Found ${count} visits.`);

  // 3. Format the email content
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #333;">Weekly Website Visit Report</h2>
      <p style="font-size: 16px; color: #666;">Here is the summary for the last 7 days:</p>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <span style="font-size: 48px; font-weight: bold; color: #0070f3;">${count}</span>
        <p style="margin: 0; color: #888;">Total Visits</p>
      </div>

      <p style="font-size: 14px; color: #999;">Report generated on ${new Date().toLocaleDateString()}</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #ccc; text-align: center;">Powered by Histora Analytics & Supabase</p>
    </div>
  `;

  // 4. Send email via SMTP using Nodemailer
  console.log(`Sending email via SMTP (${SMTP_HOST})...`);
  
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM || SMTP_USER,
      to: EMAIL_TO,
      subject: `📈 Weekly Visit Report: ${count} visits`,
      html: htmlContent,
    });

    console.log('Email sent successfully!', info.messageId);
  } catch (err) {
    console.error('Failed to send email via SMTP:', err);
    process.exit(1);
  }
}

sendWeeklyReport().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
