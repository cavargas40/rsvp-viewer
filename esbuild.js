const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");

const watch = process.argv.includes("--watch");

async function main() {
  const ctx = await esbuild.context({
    entryPoints: ["src/extension.ts"],
    bundle: true,
    format: "cjs",
    minify: false,
    sourcemap: true,
    platform: "node",
    outfile: "dist/extension.js",
    external: ["vscode"],
    logLevel: "info",
  });

  if (watch) {
    await ctx.watch();
  } else {
    await ctx.rebuild();
    await ctx.dispose();
  }

  // Copy webview files to dist/webview
  const srcWebview = path.join(__dirname, "src", "webview");
  const destWebview = path.join(__dirname, "dist", "webview");

  function copyDir(src, dest) {
    if (!fs.existsSync(src)) return;
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  // Copy initially
  copyDir(srcWebview, destWebview);

  // If watching, set up watcher for webview files as well
  if (watch) {
    fs.watch(srcWebview, { recursive: true }, (eventType, filename) => {
      console.log(`Webview asset changed: ${filename}. Copying...`);
      copyDir(srcWebview, destWebview);
    });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
