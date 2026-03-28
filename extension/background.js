// ContentOps Signal — Service Worker
// Handles context menu, relevance coloring, and badge updates.

// ── Context menu ──────────────────────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id:       'contentops-capture',
    title:    '📋 Capture to ContentOps',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'contentops-capture' && info.selectionText) {
    chrome.storage.local.set({
      captured_text: info.selectionText.trim(),
      captured_url:  tab?.title ?? tab?.url ?? 'web page',
    });
    chrome.action.openPopup?.();
  }
});

// ── Badge: reflect page relevance + capture state ────────────────────────────
// When the content script writes page_relevance, tint the toolbar icon
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;

  if (changes.page_relevance?.newValue) {
    const r = changes.page_relevance.newValue;
    const colorMap = {
      high: '#3ddc84',   // green
      med:  '#e6b94a',   // yellow
      low:  '#7a8099',   // grey
      none: '#e05555',   // red
    };
    const bg = colorMap[r.level] ?? '#7c5cbf';
    chrome.action.setBadgeText({ text: '●' });
    chrome.action.setBadgeBackgroundColor({ color: bg });
  }

  if (changes.captured_text) {
    if (changes.captured_text.newValue) {
      chrome.action.setBadgeText({ text: '!' });
      chrome.action.setBadgeBackgroundColor({ color: '#7c5cbf' });
    } else if (!changes.page_relevance) {
      chrome.action.setBadgeText({ text: '' });
    }
  }
});

// ── Listen for relevance from content script ──────────────────────────────────
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'relevance_result' && msg.result) {
    chrome.storage.local.set({ page_relevance: { ...msg.result, ts: Date.now() } });
  }
});
