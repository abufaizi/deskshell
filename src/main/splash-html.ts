export function buildSplashHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';" />
  <title>Desk Shell</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100%; height: 100%;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
      background: hsl(0 0% 3.9%);
      color: hsl(0 0% 98%);
      user-select: none;
      -webkit-app-region: drag;
    }
    .wrap {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      height: 100%; gap: 12px; padding: 24px;
    }
    .brand { font-size: 1.35rem; font-weight: 600; letter-spacing: -0.02em; }
    .sub { font-size: 0.9rem; color: hsl(0 0% 63.9%); }
    .dot {
      width: 6px; height: 6px; border-radius: 999px; background: hsl(0 0% 98%);
      animation: pulse 1.2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.35; transform: scale(0.85); }
      50% { opacity: 1; transform: scale(1); }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="brand">Desk Shell</div>
    <div class="sub">Starting up…</div>
    <div class="dot" aria-hidden="true"></div>
  </div>
</body>
</html>`
}
