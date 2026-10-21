/* global DGS_DEFAULTS, DGS_STORAGE_KEY, DGS_THEMES */
(() => {
  "use strict";

  const root = document.documentElement;
  // 初回描画時の白いちらつきを防ぐため、前回の設定をページ側 localStorage にキャッシュして同期的に適用する
  const CACHE_KEY = "__dark_sheets_cache__";
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  let settings = { ...DGS_DEFAULTS };

  function readCache() {
    try {
      const raw = window.localStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function writeCache(s) {
    try {
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(s));
    } catch {
      /* ignore */
    }
  }

  function isActive(s) {
    if (s.mode === "on") return true;
    if (s.mode === "auto") return darkQuery.matches;
    return false;
  }

  function apply(s) {
    settings = { ...DGS_DEFAULTS, ...s };
    const themeId = settings.theme in DGS_THEMES ? settings.theme : "default";
    const theme = DGS_THEMES[themeId];
    root.setAttribute("data-dgs-active", isActive(settings) ? "1" : "0");
    root.setAttribute("data-dgs-theme", themeId);
    root.style.setProperty("--dgs-brightness", String(settings.brightness / 100));
    root.style.setProperty("--dgs-contrast", String(settings.contrast / 100));
    root.style.setProperty("--dgs-bg", theme.bg || "#000");
    root.style.setProperty("--dgs-fg", theme.fg || "#fff");
  }

  function applyAndCache(s) {
    apply(s);
    writeCache(settings);
  }

  // 1) キャッシュから即時適用 (同期)
  apply(readCache() || DGS_DEFAULTS);

  // 2) 拡張のストレージから正式な値を取得
  chrome.storage.sync.get(DGS_STORAGE_KEY, (res) => applyAndCache(res && res[DGS_STORAGE_KEY]));

  // 3) ポップアップでの変更を即時反映
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes[DGS_STORAGE_KEY]) {
      applyAndCache(changes[DGS_STORAGE_KEY].newValue);
    }
  });

  // 4) OS のライト/ダーク切り替えに追従
  darkQuery.addEventListener("change", () => apply(settings));
})();
