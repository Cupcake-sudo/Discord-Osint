const fetch = require('node-fetch');
const fs    = require('fs');
const path  = require('path');

async function downloadFile(url, destDir) {
  try {
    const urlObj   = new URL(url);
    let filename   = path.basename(urlObj.pathname).replace(/[^a-zA-Z0-9._-]/g, '_') || ('file_' + Date.now());
    const destPath = path.join(destDir, filename);
    if (fs.existsSync(destPath)) return destPath;
    const res = await fetch(url);
    if (!res.ok) return null;
    fs.writeFileSync(destPath, await res.buffer());
    return destPath;
  } catch {
    return null;
  }
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function moveTmpFiles(tmpDir, filesDir) {
  ensureDir(filesDir);
  for (const f of fs.readdirSync(tmpDir)) {
    fs.renameSync(path.join(tmpDir, f), path.join(filesDir, f));
  }
  fs.rmdirSync(tmpDir);
}

module.exports = { downloadFile, ensureDir, moveTmpFiles };