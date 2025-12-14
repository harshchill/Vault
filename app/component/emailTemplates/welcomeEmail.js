export function welcomeEmail({ userName = 'User', vaultUrl = '' } = {}) {
  const year = new Date().getFullYear();
  // Return a plain HTML string (no React/JSX) so it can be sent directly by nodemailer
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05); }
      .header { background-color: #0070f3; color: white; padding: 30px 20px; text-align: center; }
      .content { padding: 20px 30px; line-height: 1.6; color: #333; }
      .button { display: inline-block; padding: 10px 20px; margin: 15px 0; background-color: #0070f3; color: white !important; text-decoration: none; border-radius: 5px; font-weight: bold; }
      .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; border-top: 1px solid #eee; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to Vault! 🚀</h1>
      </div>
      <div class="content">
        <p>Hello <strong>${escapeHtml(userName)}</strong>,</p>
        <p>A huge welcome from the Vault community! We're thrilled to have you join us. Your journey to accessing and sharing incredible resources starts now.</p>
        <p>We see you're ready to learn and contribute. Here are a few things you can do:</p>
        <ul>
          <li><strong>Browse</strong> thousands of documents instantly.</li>
          <li><strong>Upload</strong> your first contribution and earn reputation points!</li>
        </ul>
        <p><a href="${escapeAttr(vaultUrl)}" class="button">Go to Your Vault Dashboard</a></p>
        <p>If you have any questions, feel free to reply to this email.</p>
        <p>Best regards,<br/>The Vault Team</p>
      </div>
      <div class="footer">&copy; ${year} Vault Project. Built with passion.</div>
    </div>
  </body>
</html>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/\"/g, '%22');
}

export default welcomeEmail;
