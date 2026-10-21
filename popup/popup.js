/* global DGS_DEFAULTS, DGS_STORAGE_KEY, DGS_THEMES */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  let settings = { ...DGS_DEFAULTS };

  function save() {
    chrome.storage.sync.set({ [DGS_STORAGE_KEY]: settings });
  }

  // テーマカードを生成
  const themeGrid = $("theme-grid");
  for (const [id, t] of Object.entries(DGS_THEMES)) {
    const [bg, fg] = t.bg ? [t.bg, t.fg] : t.preview;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = `theme-${id}`;
    btn.className = "theme-card";
    btn.dataset.value = id;
    btn.setAttribute("role", "radio");
    btn.title = t.name;
    btn.setAttribute("aria-label", t.name);
    btn.textContent = "Aa";
    btn.style.setProperty("--t-bg", bg);
    btn.style.setProperty("--t-fg", fg);
    btn.style.setProperty("--t-accent", t.accent);
    themeGrid.appendChild(btn);
  }
  themeGrid.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-value]");
    if (btn) update({ theme: btn.dataset.value });
  });

  function render() {
    document.querySelectorAll(".segmented").forEach((group) => {
      const name = group.dataset.name;
      group.querySelectorAll("button").forEach((btn) => {
        btn.setAttribute("aria-checked", String(btn.dataset.value === settings[name]));
      });
    });

    const theme = DGS_THEMES[settings.theme] || DGS_THEMES.default;
    themeGrid.querySelectorAll("button").forEach((btn) => {
      btn.setAttribute("aria-checked", String(btn.dataset.value === settings.theme));
    });
    $("theme-name").textContent = theme.name;
    const rootStyle = document.documentElement.style;
    if (theme.bg) {
      rootStyle.setProperty("--accent", theme.accent);
      rootStyle.setProperty("--accent-2", `color-mix(in srgb, ${theme.accent} 65%, white)`);
    } else {
      rootStyle.removeProperty("--accent");
      rootStyle.removeProperty("--accent-2");
    }

    for (const key of ["brightness", "contrast"]) {
      const input = $(key);
      input.value = settings[key];
      $(`${key}-out`).textContent = `${settings[key]}%`;
      const pct = ((settings[key] - input.min) / (input.max - input.min)) * 100;
      input.style.setProperty("--pct", `${pct}%`);
    }

    const active =
      settings.mode === "on" || (settings.mode === "auto" && darkQuery.matches);
    const dot = $("status-dot");
    dot.classList.toggle("on", active);
    dot.title = active ? "ダークモード適用中" : "ダークモード停止中";
  }

  function update(patch) {
    settings = { ...settings, ...patch };
    render();
    save();
  }

  // セグメントボタン
  document.querySelectorAll(".segmented").forEach((group) => {
    group.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-value]");
      if (btn) update({ [group.dataset.name]: btn.dataset.value });
    });
  });

  // スライダー (ドラッグ中もリアルタイム反映。書き込み頻度はデバウンス)
  let timer = null;
  for (const key of ["brightness", "contrast"]) {
    $(key).addEventListener("input", (e) => {
      settings[key] = Number(e.target.value);
      render();
      clearTimeout(timer);
      timer = setTimeout(save, 120);
    });
  }

  $("reset").addEventListener("click", () => update({ ...DGS_DEFAULTS }));
  darkQuery.addEventListener("change", render);

  chrome.storage.sync.get(DGS_STORAGE_KEY, (res) => {
    settings = { ...DGS_DEFAULTS, ...(res && res[DGS_STORAGE_KEY]) };
    render();
  });
})();
