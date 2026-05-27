import type { NextRequest } from "next/server";

const SITE_SUSPENDED = process.env.SITE_SUSPENDED !== "false";

export function middleware(_request: NextRequest) {
  if (!SITE_SUSPENDED) {
    return;
  }

  return new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex,nofollow,noarchive" />
    <title>404</title>
    <style>
      html, body { height: 100%; margin: 0; background: #05070a; color: #f6f7f9; font-family: Arial, sans-serif; }
      body { display: grid; place-items: center; }
      main { text-align: center; opacity: .72; }
      h1 { margin: 0; font-size: 18px; font-weight: 600; letter-spacing: .02em; }
      p { margin: 10px 0 0; font-size: 13px; color: rgba(246,247,249,.55); }
    </style>
  </head>
  <body>
    <main>
      <h1>404</h1>
      <p>Not found</p>
    </main>
  </body>
</html>`,
    {
      status: 404,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store, no-cache, must-revalidate",
        "x-robots-tag": "noindex, nofollow, noarchive",
      },
    },
  );
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
