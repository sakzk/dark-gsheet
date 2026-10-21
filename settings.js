// 共通設定 (content script と popup の両方から読み込む)
// eslint-disable-next-line no-unused-vars
const DGS_DEFAULTS = Object.freeze({
  mode: "on", // "on" | "off" | "auto" (OS の設定に追従)
  theme: "default", // DGS_THEMES のキー
  brightness: 100, // %  (反転後の明るさ)
  contrast: 90, // %  (100 未満で真っ黒を避け、目に優しい濃いグレーに)
});

// eslint-disable-next-line no-unused-vars
const DGS_STORAGE_KEY = "dgsSettings";

// カラーテーマ
//   反転後の色を各チャンネルごとに [bg, fg] の範囲に収める (黒→bg / 白→fg)
//   accent はポップアップの配色・プレビュー用
//   bg / fg が null のテーマは単純反転のみ
// eslint-disable-next-line no-unused-vars
const DGS_THEMES = Object.freeze({
  default: { name: "デフォルト", bg: null, fg: null, accent: "#3ddc97", preview: ["#121212", "#e8e8e8"] },
  dracula: { name: "Dracula", bg: "#282a36", fg: "#f8f8f2", accent: "#bd93f9" },
  tokyonight: { name: "Tokyo Night", bg: "#1a1b26", fg: "#c0caf5", accent: "#7aa2f7" },
  catppuccin: { name: "Catppuccin Mocha", bg: "#1e1e2e", fg: "#cdd6f4", accent: "#cba6f7" },
});
