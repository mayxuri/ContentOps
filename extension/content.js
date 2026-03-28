// ContentOps Signal — Content Script
// Per-item relevance dots on YouTube, Google Search/News, and any article site.

(function () {
  'use strict';

  // ── Keywords ────────────────────────────────────────────────────────────────
  const STRONG = [
    'javascript','typescript','react','reactjs','next.js','nextjs',
    'node.js','nodejs','python','html','css','tailwind','framer motion',
    'leetcode','dsa','data structure','algorithm','dynamic programming',
    'heap','heapify','priority queue','binary search','linked list',
    'binary tree','graph','bfs','dfs','recursion','sorting','time complexity',
    'web development','frontend','backend','full stack','fullstack',
    'portfolio','github','open source','coding tutorial','programming tutorial',
    'build a project','mini project','web app','rest api','chatbot',
    'docker','deployment','vercel','netlify','api integration',
    'software engineer','developer portfolio','coding challenge','gate exam',
    'computer science','competitive programming','system design',
  ];
  const SOFT = [
    'code','coding','programming','developer','software','tech','ai',
    'tutorial','learn','project','component','function','debugging',
    'database','sql','git','framework','library','engineering',
    'interview','prep','vue','angular','svelte','rust','java','kotlin',
    'android','ios','mobile','design pattern','architecture','startup',
    'machine learning','deep learning','neural network','artificial intelligence',
  ];
  const NEGATIVE = [
    'comedy','stand-up','stand up','joke','meme','funny video',
    'celebrity','gossip','entertainment','bollywood','hollywood',
    'movie','film','vogue','fashion','beauty','makeup','skincare',
    'lifestyle','travel','astrology','horoscope','romance','relationship',
    'music video','song','lyrics','reality tv','tabloid','prank',
    'weight loss','workout','recipe','cooking','food','cricket',
    'football','basketball','sports','naya','ki vines','bb ki',
  ];

  // ── Score text (shortText = title-only, uses lower thresholds) ─────────────
  function score(text, shortText = false) {
    let s = 0;
    const hits = { strong: [], soft: [], negative: [] };
    for (const kw of STRONG)   if (text.includes(kw)) { s += 3; hits.strong.push(kw); }
    for (const kw of SOFT)     if (text.includes(kw)) { s += 1; hits.soft.push(kw); }
    for (const kw of NEGATIVE) if (text.includes(kw)) { s -= 4; hits.negative.push(kw); }
    s = Math.max(-15, Math.min(20, s));

    const hi = shortText ? 2 : 6;
    const md = shortText ? 1 : 2;
    const lo = shortText ? 0 : -1;

    let level, label, color, glow;
    if      (s >= hi) { level='high'; label='Relevant';    color='hsl(155,65%,48%)'; glow='hsla(155,65%,48%,.6)'; }
    else if (s >= md) { level='med';  label='Partial';     color='hsl(45,90%,55%)';  glow='hsla(45,90%,55%,.6)'; }
    else if (s >= lo) { level='low';  label='Unclear';     color='hsl(220,15%,55%)'; glow='hsla(220,15%,55%,.4)'; }
    else              { level='none'; label='Off-topic';   color='hsl(0,70%,58%)';   glow='hsla(0,70%,58%,.6)'; }
    return { s, level, label, color, glow, hits };
  }

  // ── Global pulse keyframes (injected once) ──────────────────────────────────
  function ensureStyles() {
    if (document.getElementById('co-style')) return;
    const st = document.createElement('style');
    st.id = 'co-style';
    st.textContent = `
      @keyframes co-pulse {
        0%,100% { opacity:1; }
        50%      { opacity:.45; }
      }
      .co-tip {
        position:absolute; top:18px; left:0;
        background:hsl(230,25%,8%); border-left:2px solid;
        padding:4px 10px; white-space:nowrap;
        z-index:2147483647; font-size:10px; font-weight:700;
        letter-spacing:.08em; text-transform:uppercase;
        font-family:'Inter',-apple-system,sans-serif;
        pointer-events:none;
        clip-path:polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%);
        box-shadow:0 4px 16px hsla(0,0%,0%,.6);
        line-height:1.3; display:none;
      }
    `;
    document.head.appendChild(st);
  }

  // ── Thumbnail dot (used for YouTube) ───────────────────────────────────────
  // Injects a small dot in the top-left of the thumbnail image.
  function thumbDot(thumbEl, result, titleText) {
    if (!thumbEl || thumbEl.dataset.coDot) return;
    thumbEl.dataset.coDot = '1';

    const { color, glow, label } = result;

    // Wrap needs relative positioning — set it on the closest positioned ancestor
    const host = thumbEl.closest('ytd-thumbnail') || thumbEl;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';

    const badge = document.createElement('div');
    badge.style.cssText = `
      position:absolute; top:8px; left:8px;
      width:13px; height:13px; border-radius:50%;
      background:${color};
      box-shadow:0 0 0 2px rgba(0,0,0,.7), 0 0 8px ${glow};
      z-index:100; pointer-events:auto; cursor:default;
      animation:co-pulse 2.5s ease-in-out infinite;
    `;

    // Tooltip
    const tip = document.createElement('div');
    tip.className = 'co-tip';
    tip.style.borderColor = color;
    tip.style.color = color;
    tip.textContent = `${label} · ${titleText.slice(0, 45)}${titleText.length > 45 ? '…' : ''}`;

    badge.appendChild(tip);
    badge.addEventListener('mouseenter', () => { tip.style.display = 'block'; });
    badge.addEventListener('mouseleave', () => { tip.style.display = 'none'; });

    host.appendChild(badge);
  }

  // ── Inline dot (used for Google + news sites) ───────────────────────────────
  // Inserts a small dot span right after a heading/link element.
  function inlineDot(anchorEl, result, extra = '') {
    if (!anchorEl || anchorEl.dataset.coDot) return;
    anchorEl.dataset.coDot = '1';

    const { color, glow, label, hits } = result;
    const kws = [...hits.strong, ...hits.soft].slice(0, 3).join(', ') || '—';

    const wrap = document.createElement('span');
    wrap.style.cssText = `
      display:inline-flex; align-items:center; margin-left:6px;
      position:relative; vertical-align:middle; flex-shrink:0;
      cursor:default; line-height:1;
    `;

    const dot = document.createElement('span');
    dot.style.cssText = `
      display:inline-block; width:9px; height:9px; border-radius:50%;
      background:${color}; box-shadow:0 0 5px ${glow};
      animation:co-pulse 2.5s ease-in-out infinite; flex-shrink:0;
    `;

    const tip = document.createElement('span');
    tip.className = 'co-tip';
    tip.style.borderColor = color;
    tip.style.color = color;
    tip.textContent = `${label}${extra ? ' · ' + extra : ''} · ${kws}`;

    wrap.appendChild(dot);
    wrap.appendChild(tip);
    wrap.addEventListener('mouseenter', () => { tip.style.display = 'block'; });
    wrap.addEventListener('mouseleave', () => { tip.style.display = 'none'; });

    try { anchorEl.insertAdjacentElement('afterend', wrap); }
    catch { try { anchorEl.parentNode?.appendChild(wrap); } catch {} }
  }

  // ── YouTube item markers ────────────────────────────────────────────────────
  function markYouTube() {
    ensureStyles();

    document.querySelectorAll([
      'ytd-rich-item-renderer',
      'ytd-video-renderer',
      'ytd-compact-video-renderer',
      'ytd-reel-item-renderer',
    ].join(',')).forEach((card) => {
      if (card.dataset.coTagged) return;
      card.dataset.coTagged = '1';

      // Title — try multiple selectors for different YouTube layouts
      const title = (
        card.querySelector('a#video-title')?.textContent ||
        card.querySelector('#video-title')?.textContent ||
        card.querySelector('h3 a')?.textContent ||
        card.querySelector('h3')?.textContent || ''
      ).trim();

      const channel = (
        card.querySelector('ytd-channel-name yt-formatted-string')?.textContent ||
        card.querySelector('#channel-name a')?.textContent ||
        card.querySelector('.ytd-channel-name')?.textContent || ''
      ).trim();

      if (!title) return;

      const result = score(`${title} ${channel}`.toLowerCase(), true);

      // Find the thumbnail <a> tag and overlay the dot on it
      const thumbLink = card.querySelector('a#thumbnail, ytd-thumbnail a');
      thumbDot(thumbLink, result, title);
    });
  }

  // ── Google Search + News markers ────────────────────────────────────────────
  function markGoogle() {
    ensureStyles();

    // Regular search results
    document.querySelectorAll('.g, .MjjYud > div').forEach((item) => {
      if (item.dataset.coTagged) return;
      const h3 = item.querySelector('h3');
      if (!h3) return;
      item.dataset.coTagged = '1';

      const title = h3.textContent?.trim() || '';
      const desc  = item.querySelector('.VwiC3b, .lEBKkf, [data-sncf]')?.textContent?.trim() || '';
      const result = score(`${title} ${desc}`.toLowerCase(), true);
      inlineDot(h3, result);
    });

    // Google News tab (different structure)
    document.querySelectorAll([
      'article:not([data-co-tagged])',
      '.SoaBEf:not([data-co-tagged])',
      '.WlydOe:not([data-co-tagged])',
      '.ipQwMb:not([data-co-tagged])',
    ].join(',')).forEach((item) => {
      if (item.dataset.coTagged) return;
      item.dataset.coTagged = '1';

      const h3   = item.querySelector('h3, h4, [role="heading"]');
      const desc = item.querySelector('p, .GI74Re, .Mp1HEe')?.textContent?.trim() || '';
      if (!h3) return;

      const title  = h3.textContent?.trim() || '';
      const result = score(`${title} ${desc}`.toLowerCase(), true);
      inlineDot(h3, result);
    });
  }

  // ── Generic site marker (ET, TechCrunch, Medium, HN, Reddit…) ──────────────
  function markGeneric() {
    ensureStyles();

    // All meaningful headings
    document.querySelectorAll('h2, h3, h4').forEach((el) => {
      if (el.dataset.coDot) return;
      const text = el.textContent?.trim() || '';
      if (text.length < 18 || text.length > 300) return;

      const result = score(text.toLowerCase(), true);
      // Inject after the last <a> inside the heading, or after the heading itself
      const inner = el.querySelector('a');
      inlineDot(inner || el, result);
    });

    // Standalone article-style links (not inside headings, not in nav/footer)
    document.querySelectorAll('a').forEach((el) => {
      if (el.dataset.coDot) return;
      if (el.closest('h1,h2,h3,h4,h5,h6,nav,header,footer,[role="navigation"],.nav,.menu,.footer,.header')) return;
      const text = el.textContent?.trim() || '';
      if (text.length < 30 || text.length > 220) return;
      const href = el.getAttribute('href') || '';
      if (!href || href.startsWith('#') || href.startsWith('javascript')) return;

      const result = score(text.toLowerCase(), true);
      inlineDot(el, result);
    });
  }

  // ── Page-level badge (article/watch pages) ──────────────────────────────────
  let pageBadge = null;

  function injectPageBadge(result) {
    pageBadge?.remove(); pageBadge = null;

    const { label, color, glow, s, hits } = result;
    const topHits = [...hits.strong, ...hits.soft].slice(0, 5);
    const badHits = hits.negative.slice(0, 2);

    const wrap = document.createElement('div');
    wrap.id = 'co-page-badge';

    const css = document.createElement('style');
    css.textContent = `
      #co-page-badge{position:fixed;bottom:22px;left:18px;z-index:2147483647;font-family:'Inter',-apple-system,sans-serif;pointer-events:none}
      #co-chip{display:inline-flex;align-items:center;gap:7px;padding:6px 10px 6px 8px;background:hsl(230,25%,8%);border:1px solid ${color}44;border-left:2.5px solid ${color};color:hsl(220,20%,90%);cursor:pointer;pointer-events:auto;user-select:none;box-shadow:0 2px 16px hsla(0,0%,0%,.5),0 0 14px ${glow};transition:all 250ms;white-space:nowrap;clip-path:polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,7px 100%,0 calc(100% - 7px))}
      #co-chip:hover{border-color:${color}}
      #co-chip.co-col .co-lbl,#co-chip.co-col .co-x{display:none}
      #co-chip.co-col{padding:5px 7px}
      .co-bd{width:9px;height:9px;border-radius:50%;background:${color};box-shadow:0 0 6px ${glow};animation:co-pulse 2.5s ease-in-out infinite;flex-shrink:0}
      .co-lbl{font-size:10px;font-weight:700;letter-spacing:.1em;color:${color}}
      .co-x{background:none;border:none;cursor:pointer;color:hsl(220,10%,50%);font-size:10px;padding:0 0 0 2px;pointer-events:auto;line-height:1}
      #co-panel{position:absolute;bottom:calc(100% + 8px);left:0;width:250px;background:hsl(230,22%,9%);border:1px solid ${color}33;border-left:2.5px solid ${color};padding:12px;box-shadow:0 8px 32px hsla(0,0%,0%,.5),0 0 20px ${glow};pointer-events:auto;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)}
      #co-panel.co-h{display:none}
      .co-ph{display:flex;align-items:center;gap:8px;margin-bottom:10px}
      .co-bd2{width:11px;height:11px;border-radius:50%;background:${color};box-shadow:0 0 8px ${glow};animation:co-pulse 2.5s ease-in-out infinite}
      .co-pl{font-size:11px;font-weight:700;letter-spacing:.1em;color:${color};flex:1}
      .co-ps{font-size:9px;color:hsl(220,10%,50%);font-weight:600}
      .co-sl{font-size:8.5px;font-weight:700;letter-spacing:.14em;color:hsl(220,10%,45%);text-transform:uppercase;margin-bottom:6px}
      .co-kws{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px}
      .co-kw{padding:2px 7px;font-size:9.5px;font-weight:600;letter-spacing:.04em;border:1px solid}
      .co-kw-h{color:${color};border-color:${color}44;background:${color}11}
      .co-kw-m{color:hsl(0,70%,58%);border-color:hsla(0,70%,58%,.3);background:hsla(0,70%,58%,.08)}
      .co-kw-n{font-size:10px;color:hsl(220,10%,45%);font-style:italic}
      .co-dv{height:1px;background:hsl(230,15%,16%);margin-bottom:10px}
      .co-cap{width:100%;padding:7px;background:hsl(230,20%,14%);border:1px solid hsla(250,85%,67%,.3);border-left:2px solid hsl(250,85%,67%);color:hsl(220,20%,90%);font-size:11px;font-weight:600;letter-spacing:.04em;cursor:pointer;text-align:left;transition:background 150ms;font-family:inherit;clip-path:polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)}
      .co-cap:hover{background:hsl(230,20%,18%)}
      .co-hint{font-size:9px;color:hsl(220,10%,40%);margin-top:5px}
    `;

    wrap.innerHTML = `
      <div id="co-chip">
        <div class="co-bd"></div>
        <span class="co-lbl">${label}</span>
        <button class="co-x">✕</button>
      </div>
      <div id="co-panel" class="co-h">
        <div class="co-ph"><div class="co-bd2"></div><span class="co-pl">${label}</span><span class="co-ps">Score ${s>0?'+':''}${s}</span></div>
        <div class="co-sl">MATCHED KEYWORDS</div>
        <div class="co-kws">
          ${topHits.length ? topHits.map(k=>`<span class="co-kw co-kw-h">${k}</span>`).join('') : '<span class="co-kw-n">No matches</span>'}
          ${badHits.map(k=>`<span class="co-kw co-kw-m">${k}</span>`).join('')}
        </div>
        <div class="co-dv"></div>
        <button class="co-cap" id="co-cap">📋 Capture this page</button>
        <div class="co-hint">Saves title + excerpt to popup</div>
      </div>
    `;

    document.head.appendChild(css);
    document.body.appendChild(wrap);
    pageBadge = wrap;

    const chip  = wrap.querySelector('#co-chip');
    const panel = wrap.querySelector('#co-panel');
    const timer = setTimeout(() => chip.classList.add('co-col'), 5000);

    chip.addEventListener('click', (e) => {
      if (e.target.classList.contains('co-x')) { wrap.remove(); pageBadge = null; return; }
      clearTimeout(timer); chip.classList.remove('co-col');
      panel.classList.toggle('co-h');
    });

    wrap.querySelector('#co-cap').addEventListener('click', () => {
      const exc = (document.body?.innerText||'').slice(0,500).trim();
      chrome.storage.local.set({ captured_text:`[From: ${document.title}]\n\n${exc}`, captured_url: document.title||location.hostname }, () => {
        const b = wrap.querySelector('#co-cap');
        b.textContent='✓ Captured!'; b.style.color='hsl(155,65%,48%)';
        setTimeout(()=>{ b.textContent='📋 Capture this page'; b.style.color=''; }, 2000);
      });
    });
  }

  // ── Full page text (for article / watch pages) ──────────────────────────────
  function getPageText() {
    const isYT = location.hostname.includes('youtube.com');
    const parts = [
      document.title||'',
      document.querySelector('meta[name="description"]')?.getAttribute('content')||'',
      document.querySelector('meta[property="og:title"]')?.getAttribute('content')||'',
      document.querySelector('meta[property="og:description"]')?.getAttribute('content')||'',
    ];
    if (isYT) {
      parts.push(
        document.querySelector('h1.ytd-video-primary-info-renderer yt-formatted-string, ytd-video-primary-info-renderer h1, #above-the-fold #title h1')?.textContent||'',
        document.querySelector('#owner #channel-name, ytd-channel-name yt-formatted-string')?.textContent||'',
        document.querySelector('ytd-text-inline-expander, #description-inline-expander, #description-inner')?.innerText?.slice(0,1500)||'',
        Array.from(document.querySelectorAll('meta[property="og:video:tag"]')).map(m=>m.getAttribute('content')).join(' '),
      );
    } else {
      parts.push(
        ...Array.from(document.querySelectorAll('h1,h2,h3')).map(h=>h.textContent),
        document.body?.innerText?.slice(0,2500)||'',
      );
    }
    return parts.join(' ').toLowerCase();
  }

  function saveRelevance(result) {
    chrome.storage.local.set({ page_relevance:{ url:location.href, title:document.title, label:result.label, level:result.level, score:result.s, color:result.color, hits:result.hits, ts:Date.now() }});
  }

  // ── MutationObserver (infinite scroll) ─────────────────────────────────────
  let obsTimer = null;
  function observeNewItems(fn) {
    new MutationObserver(() => { clearTimeout(obsTimer); obsTimer = setTimeout(fn, 500); })
      .observe(document.body, { childList:true, subtree:true });
  }

  // ── Main router ─────────────────────────────────────────────────────────────
  function run() {
    if (location.hostname === 'localhost') return;

    const isYT     = location.hostname.includes('youtube.com');
    const isGoogle = location.hostname.includes('google.com');

    if (isYT) {
      if (location.pathname === '/watch') {
        // Watch page: badge for current video + dots on recommended sidebar
        const result = score(getPageText(), false);
        saveRelevance(result);
        injectPageBadge(result);
        setTimeout(() => { markYouTube(); observeNewItems(markYouTube); }, 1200);
      } else {
        // Home / search / subscriptions: dots on every video card
        markYouTube();
        observeNewItems(markYouTube);
      }
    } else if (isGoogle) {
      markGoogle();
      observeNewItems(markGoogle);
    } else {
      // All other sites: page badge + per-headline dots
      const result = score(getPageText(), false);
      saveRelevance(result);
      injectPageBadge(result);
      markGeneric();
      observeNewItems(markGeneric);
    }
  }

  // ── SPA navigation ──────────────────────────────────────────────────────────
  let navTimer = null;
  function onNavigate() {
    clearTimeout(navTimer);
    pageBadge?.remove(); pageBadge = null;
    // Clear tags so new page items get fresh analysis
    document.querySelectorAll('[data-co-tagged]').forEach(el => delete el.dataset.coTagged);
    navTimer = setTimeout(run, 1600);
  }

  window.addEventListener('yt-navigate-finish', onNavigate);
  const _push = history.pushState.bind(history);
  const _rep  = history.replaceState.bind(history);
  history.pushState    = (...a) => { _push(...a);  onNavigate(); };
  history.replaceState = (...a) => { _rep(...a);   onNavigate(); };
  window.addEventListener('popstate', onNavigate);

  // ── Selection capture tooltip ───────────────────────────────────────────────
  let tooltip = null, hideTimer = null;

  function getTooltip() {
    if (tooltip) return tooltip;
    tooltip = document.createElement('div');
    Object.assign(tooltip.style, {
      position:'fixed', zIndex:'2147483647', display:'flex', alignItems:'center', gap:'7px',
      padding:'7px 13px', background:'hsl(230,20%,10%)', color:'hsl(220,20%,95%)',
      border:'1px solid hsla(250,85%,67%,.4)', borderLeft:'3px solid hsl(250,85%,67%)',
      fontFamily:"'Inter',-apple-system,sans-serif", fontSize:'12px', fontWeight:'600',
      letterSpacing:'.04em', cursor:'pointer', userSelect:'none',
      boxShadow:'0 4px 20px hsla(0,0%,0%,.4)', opacity:'0', transition:'opacity 200ms ease',
      pointerEvents:'auto', whiteSpace:'nowrap',
      clipPath:'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,0 100%)',
    });
    tooltip.innerHTML = '<span>📋</span><span>Capture to ContentOps</span>';
    tooltip.addEventListener('click', e => { e.stopPropagation(); captureSelection(); hideTooltip(); });
    tooltip.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    tooltip.addEventListener('mouseleave', () => { hideTimer = setTimeout(hideTooltip, 600); });
    document.body.appendChild(tooltip);
    return tooltip;
  }
  function showTooltip(x, y) {
    if (location.hostname === 'localhost') return;
    const el = getTooltip();
    el.style.left = `${Math.min(x, window.innerWidth-230)}px`;
    el.style.top  = `${Math.max(y-44,10)}px`;
    el.style.opacity='1'; el.style.pointerEvents='auto';
  }
  function hideTooltip() {
    if (!tooltip) return;
    tooltip.style.opacity='0'; tooltip.style.pointerEvents='none';
  }
  function captureSelection() {
    const text = window.getSelection()?.toString().trim();
    if (!text) return;
    chrome.storage.local.set({ captured_text:text, captured_url:document.title||location.hostname });
    const flash = document.createElement('div');
    flash.textContent = '✓ Captured — open ContentOps';
    Object.assign(flash.style, {
      position:'fixed', bottom:'70px', left:'18px', zIndex:'2147483647',
      background:'hsl(155,65%,48%)', color:'#000', padding:'8px 14px',
      fontFamily:"'Inter',sans-serif", fontSize:'11px', fontWeight:'700', letterSpacing:'.06em',
      opacity:'0', transition:'opacity 200ms',
      clipPath:'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,0 100%)',
    });
    document.body.appendChild(flash);
    requestAnimationFrame(() => { flash.style.opacity='1'; });
    setTimeout(() => { flash.style.opacity='0'; setTimeout(()=>flash.remove(),300); }, 2200);
  }
  document.addEventListener('mouseup', e => {
    clearTimeout(hideTimer);
    if (location.hostname==='localhost') return;
    setTimeout(() => {
      const text = window.getSelection()?.toString().trim()||'';
      if (text.length >= 20) { showTooltip(e.clientX, e.clientY); hideTimer=setTimeout(hideTooltip,4500); }
      else hideTooltip();
    }, 10);
  });
  document.addEventListener('mousedown', e => {
    if (tooltip && !tooltip.contains(e.target)) { clearTimeout(hideTimer); hideTooltip(); }
  });
  document.addEventListener('scroll', () => { clearTimeout(hideTimer); hideTooltip(); }, { passive:true });

  // ── Boot ────────────────────────────────────────────────────────────────────
  ensureStyles();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(run, 900));
  } else {
    setTimeout(run, 900);
  }

})();
