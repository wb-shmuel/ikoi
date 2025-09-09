import fs from "node:fs/promises";
import path from "node:path";
import replaceColor from "replace-color";
import sharp from "sharp";

const SRC = "assets/source/flame-navy.png";      // 生成済みのアイコン画像（濃い青背景＋炎）
const OUT = "assets/build";
const NAVY = "#0D1320";                          // 背景の濃紺（近似色を透過にします）
const TOLERANCE = 20;                             // 背景除去の色許容（8〜30の間で調整）

await fs.mkdir(OUT, { recursive: true });

// ---- 透過前処理（foreground 用に背景を抜く） ----
const fgTmp = path.join(OUT, "tmp-foreground.png");
{
  const buf = await fs.readFile(SRC);
  const jimpImg = await replaceColor({
    image: buf,
    colors: {
      type: "hex",
      targetColor: NAVY,
      replaceColor: "#00000000", // 透明
    },
    deltaE: TOLERANCE,
  });
  const outPngBuffer = await jimpImg.getBufferAsync("image/png");
  await fs.writeFile(fgTmp, outPngBuffer);
}

// ---- ヘルパ ----
const exportSquare = async (input, size, name, opts = {}) => {
  const outPath = path.join(OUT, name);
  let img = sharp(input).resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } });
  if (opts.flatten) img = img.flatten({ background: opts.flatten }); // iOSアイコンは透過NG
  if (opts.padding) {
    // 重要要素をキャンバス中央に余白を持って配置（Androidの安全域≒66%）
    const pad = Math.round(size * opts.padding);
    img = sharp({
      create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
    }).composite([{ input: await sharp(input)
      .resize(size - pad * 2, size - pad * 2, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer(), gravity: "center" }]);
  }
  if (opts.tint) img = img.tint(opts.tint);
  await img.png().toFile(outPath);
  console.log("✓", name);
};

// ---- iOS/共通アイコン（1024, 透過なし推奨） ----
await exportSquare(SRC, 1024, "icon-1024.png", { flatten: NAVY });

// ---- Android Adaptive ----
// foreground：背景を透明にしつつ安全域（≈キャンバスの16%ずつ余白）を確保
await exportSquare(fgTmp, 1024, "adaptive-foreground.png", { padding: 0.16 });
// background：単色の濃紺
await sharp({ create: { width: 1024, height: 1024, channels: 4, background: NAVY } })
  .png().toFile(path.join(OUT, "adaptive-background.png"));
console.log("✓ adaptive-background.png");
// monochrome：白1色の前景（Android 13+）
await exportSquare(fgTmp, 1024, "adaptive-monochrome.png", { tint: { r: 255, g: 255, b: 255 } });

// ---- Web / PWA / Favicon ----
await exportSquare(SRC, 16, "favicon-16.png", { flatten: NAVY });
await exportSquare(SRC, 32, "favicon-32.png", { flatten: NAVY });
await exportSquare(SRC, 48, "favicon-48.png", { flatten: NAVY });
await exportSquare(SRC, 192, "android-chrome-192.png", { flatten: NAVY });
await exportSquare(SRC, 512, "android-chrome-512.png", { flatten: NAVY });
await exportSquare(SRC, 180, "apple-touch-icon-180.png", { flatten: NAVY });

// ---- Splash（2048 正方形、中央にロゴをやや小さめで配置） ----
{
  const size = 2048;
  const bg = sharp({
    create: { width: size, height: size, channels: 4, background: "#0F1115" }
  }).png();
  const logo = await sharp(SRC).resize(Math.round(size * 0.42), Math.round(size * 0.42), { fit: "contain" }).toBuffer();
  await bg.composite([{ input: logo, gravity: "center" }]).toFile(path.join(OUT, "splash-2048.png"));
  console.log("✓ splash-2048.png");
}

// 後片付け
await fs.rm(fgTmp, { force: true });
console.log("Done!");
