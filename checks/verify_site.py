"""Check every public portfolio page without external dependencies."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
from collections import Counter

ROOT = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.ids=[]; self.links=[]; self.nav=[]; self.nav_depth=0; self.mains=0; self.h1s=0; self.active=0
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if 'id' in attrs: self.ids.append(attrs['id'])
        if tag=='main': self.mains+=1
        if tag=='h1': self.h1s+=1
        if tag=='nav' and attrs.get('class')=='site-nav': self.nav_depth=1
        if self.nav_depth and tag=='a':
            self.nav.append(attrs.get('href'))
            if attrs.get('aria-current')=='page': self.active+=1
        for key in ['href','src']:
            if attrs.get(key): self.links.append(attrs[key])
    def handle_endtag(self, tag):
        if tag=='nav': self.nav_depth=0
pages={p:Page(p.read_text()) for p in ROOT.rglob('*.html') if 'Portfolio' not in p.parts and 'google65' not in p.name}
errors=[]; link_count=0; nav_reference=None
for path,page in pages.items():
    rel=path.relative_to(ROOT)
    if page.mains!=1 or page.h1s!=1: errors.append(f'{rel}: main={page.mains}, h1={page.h1s}')
    duplicates=[key for key,count in Counter(page.ids).items() if count>1]
    if duplicates: errors.append(f'{rel}: duplicate IDs {duplicates}')
    nav=[str((path.parent/unquote(urlsplit(href).path)).resolve().relative_to(ROOT)) for href in page.nav]
    if nav_reference is None: nav_reference=nav
    if nav!=nav_reference or page.active!=1: errors.append(f'{rel}: inconsistent navigation')
    for href in page.links:
        url=urlsplit(href)
        if url.scheme or url.netloc: continue
        target=(path.parent/unquote(url.path)).resolve() if url.path else path
        if not target.exists(): errors.append(f'{rel}: missing {href}')
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            errors.append(f'{rel}: missing fragment {href}')
        link_count+=1
if errors: raise SystemExit('\n'.join(errors))
print(f'PASS: {len(pages)} pages, {link_count} local references, identical navbar destinations, unique IDs and one active tab per page.')
