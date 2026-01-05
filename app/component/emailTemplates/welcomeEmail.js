export function welcomeEmail({ userName = 'User', vaultUrl = '' } = {}) {
  const year = new Date().getFullYear();
  const baseUrl = String(vaultUrl || '').replace(/\/+$/, '');
  const logo = baseUrl
    ? `<img src="${escapeAttr(baseUrl)}/icon.png" width="48" height="48" alt="Vault" style="border-radius:12px; display:block;" />`
    : `<span style="display:inline-block; padding:10px 14px; border-radius:12px; background:#059669; color:#ffffff; font-weight:700;">Vault</span>`;
  // Return a plain HTML string (no React/JSX) so it can be sent directly by nodemailer
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      /* Base */
      body { margin:0; padding:0; background:#f8fafc; color:#0f172a; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; }
      img { border:0; outline:none; text-decoration:none; }
      a { color:#059669; text-decoration:none; }

      /* Container */
      .wrapper { width:100%; background:#f8fafc; padding:24px 0; }
      .container { width:100%; max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; box-shadow:0 10px 40px rgba(15,23,42,0.07); overflow:hidden; }

      /* Header */
      .header { background:#065f46; background-image: linear-gradient(135deg,#10b981,#059669); padding:28px 28px; color:#ffffff; text-align:center; }
      .brand { display:flex; align-items:center; justify-content:center; gap:12px; }
      .brand-name { font-size:20px; font-weight:700; letter-spacing:0.2px; }

      /* Hero */
      .hero { padding:8px 28px 0 28px; background:#ffffff; }
      .h1 { font-size:22px; line-height:1.25; margin:16px 0 0 0; color:#0f172a; }
      .muted { color:#475569; font-size:14px; margin:8px 0 0 0; }

      /* Content */
      .content { padding:20px 28px 8px 28px; line-height:1.65; font-size:15px; color:#0f172a; }
      .list { padding-left:18px; margin:12px 0; }
      .list li { margin:6px 0; color:#0f172a; }

      /* CTA buttons */
      .cta-row { padding:8px 28px 24px 28px; }
      .btn { display:inline-block; padding:12px 18px; border-radius:12px; font-weight:700; }
      .btn-primary { background:#059669; color:#ffffff !important; box-shadow:0 8px 30px rgba(16,185,129,0.35); }
      .btn-secondary { background:rgba(5,150,105,0.08); color:#065f46 !important; }

      /* Card */
      .card { margin:0 28px 20px 28px; padding:14px 16px; border:1px solid #e2e8f0; border-radius:12px; background:#ffffff; }
      .card-title { font-weight:700; font-size:14px; margin:0 0 6px 0; color:#0f172a; }
      .card-text { margin:0; font-size:13px; color:#475569; }

      /* Footer */
      .footer { padding:18px 24px; font-size:12px; color:#64748b; border-top:1px solid #e2e8f0; text-align:center; }
      .divider { height:1px; background:#e2e8f0; margin:0 28px; }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container" role="article" aria-roledescription="email" aria-label="Welcome to Vault">
        <div class="header">
          <div class="brand">
            ${logo}
            <div class="brand-name">Vault</div>
          </div>
        </div>

        <div class="hero">
          <h1 class="h1">Welcome aboard, ${escapeHtml(userName)}! </h1>
          <p class="muted">Your account is all set. Here’s how to make the most of Vault from day one.</p>
        </div>

        <div class="content">
          <p>We’re thrilled to have you with us. Vault helps you discover, save, and share high‑quality resources with a beautiful, distraction‑free experience.</p>
          <ul class="list">
            <li><strong>Browse</strong> thousands of community‑curated papers and notes.</li>
            <li><strong>Upload</strong> your first contribution and start building your reputation.</li>
            <li><strong>Bookmark</strong> favorites to access them anytime, on any device.</li>
          </ul>
          <p class="muted" style="margin-top:10px;">Highlights:</p>
          <ul class="list">
            <li>Leaderboard that recognizes top contributors.</li>
            <li>Clean, responsive interface with smart filters.</li>
            <li>Secure viewing experience with a custom PDF viewer.</li>
          </ul>
          <p class="muted" style="margin-top:10px;">Quick links:</p>
          <ul class="list">
            ${baseUrl ? `<li><a href="${escapeAttr(baseUrl)}/papers">Browse library</a></li>` : ''}
            ${baseUrl ? `<li><a href="${escapeAttr(baseUrl)}/upload">Upload a paper</a> (login required)</li>` : ''}
            ${baseUrl ? `<li><a href="${escapeAttr(baseUrl)}/contributions">See top contributors</a></li>` : ''}
          </ul>
        </div>

        <div class="cta-row">
          <a href="${escapeAttr(vaultUrl)}" class="btn btn-primary">Open your Dashboard</a>
          &nbsp;&nbsp;
          <a href="${escapeAttr(baseUrl ? baseUrl + '?install=1' : vaultUrl)}" class="btn btn-secondary">Install the App</a>
        </div>

        <div class="card">
          <div class="card-title">Tip</div>
          <p class="card-text">For the best experience, add Vault to your home screen from your browser — it works like a native app.</p>
        </div>

        <div class="card">
          <div class="card-title">Open source & community</div>
          <p class="card-text">Vault is an open‑source project. If you’d like to contribute, report issues, or star the project, you’ll find the GitHub link on our website. You can also start by sharing the app with friends and uploading helpful papers.</p>
          ${baseUrl ? `<p class="card-text" style="margin-top:8px;"><a href="${escapeAttr(baseUrl)}" style="color:#059669;">Visit the website</a> ${' '}• ${' '}<a href="${escapeAttr(baseUrl)}/contributions" style="color:#059669;">View contributions</a></p>` : ''}
        </div>

        <div class="divider"></div>
        <div class="content" style="padding-top:16px; padding-bottom:0;">
          <p>If you need help, just reply to this email and we’ll be happy to assist.</p>
          <p style="margin-top:8px;">— The Vault Team</p>
        </div>

        <div class="footer">
          <div>&copy; ${year} Vault. All rights reserved.</div>
          <div style="margin-top:6px;">You received this email because you created an account on Vault.</div>
          ${baseUrl ? `<div style="margin-top:8px;"><a href="${escapeAttr(baseUrl)}" style="color:#059669;">Visit Website</a></div>` : ''}
        </div>
      </div>
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
