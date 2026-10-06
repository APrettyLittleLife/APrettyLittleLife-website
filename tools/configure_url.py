#!/usr/bin/env python3
"""Set the public base URL and generate crawlable SEO metadata before launch."""
from pathlib import Path
from urllib.parse import urlparse
from xml.sax.saxutils import escape
import json, re, sys
root = Path(__file__).resolve().parent.parent
url = sys.argv[1].rstrip('/') + '/' if len(sys.argv) == 2 else ''
parsed = urlparse(url)
if parsed.scheme != 'https' or not parsed.hostname or parsed.query or parsed.fragment or parsed.username:
    sys.exit('Usage: python3 tools/configure_url.py https://your-public-domain/ (or Pages project base URL)')
content = root / 'assets/content.json'
data = json.loads(content.read_text()); data['business']['siteUrl'] = url
content.write_text(json.dumps(data, indent=2) + '\n')
names = sorted(p.name for p in root.glob('*.html'))
(root / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'  <url><loc>{escape(url+n)}</loc></url>\n' for n in names) + '</urlset>\n')
(root / 'robots.txt').write_text(f'User-agent: *\nAllow: /\nSitemap: {url}sitemap.xml\n')
for name in names:
    path=root/name; html=path.read_text()
    html=re.sub(r'<!-- PUBLIC-SEO-START -->.*?<!-- PUBLIC-SEO-END -->','',html,flags=re.S)
    metadata=f'<!-- PUBLIC-SEO-START --><link rel="canonical" href="{escape(url+name)}"><meta property="og:url" content="{escape(url+name)}"><!-- PUBLIC-SEO-END -->'
    path.write_text(html.replace('</head>',metadata+'</head>'))
print('Public URL, sitemap, robots.txt and static canonical/social URLs updated.')
