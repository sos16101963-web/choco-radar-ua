const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.crafohab.com.ua').replace(/\/$/, '');
const INDEXNOW_KEY = 'c7f4a9e2b1d84f6a9c3e5b7d2a8f1e4c';

async function main() {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  console.log(`Fetching sitemap from ${sitemapUrl}...`);

  const sitemapRes = await fetch(sitemapUrl);
  if (!sitemapRes.ok) {
    throw new Error(`Failed to fetch sitemap: HTTP ${sitemapRes.status}`);
  }

  const xml = await sitemapRes.text();
  const urls = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map((m) => m[1].trim());

  if (urls.length === 0) {
    throw new Error('No <loc> URLs found in sitemap.xml');
  }

  const host = new URL(SITE_URL).host;
  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  console.log(`Submitting ${urls.length} URLs for host ${host} to IndexNow...`);

  const res = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  const responseText = await res.text();
  console.log(`IndexNow response: HTTP ${res.status} ${res.statusText}`);
  if (responseText) {
    console.log(responseText);
  }

  if (res.status < 200 || res.status >= 300) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
