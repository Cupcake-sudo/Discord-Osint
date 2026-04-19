const args = process.argv.slice(2);

function getFlag(flag) {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
}

function hasFlag(flag) {
  return args.includes(flag);
}

const TARGET_USER_ID = getFlag('-id');

if (!TARGET_USER_ID) {
  console.error('\n  ✗  Missing required flag: -id <userID>\n');
  console.error('  Usage:  node index.js -id <userID> [mode] [options]\n');
  console.error('  Modes:');
  console.error('    -messages   save every message (text) the user sent across all servers');
  console.error('    -files      download every file, image, videos, gifs. Everything | exiftool ;)');
  console.error('    -mention    find every message that pings them and track who sent it');
  console.error('    -all        everything — messages, files, and mentions together');
  console.error('\n  Options:');
  console.error('    -heatmap    show top 5 peak 2-hour messaging windows (not available with -mention)');
  console.error('\n  Default (no mode): same as -messages\n');
  process.exit(1);
}

const MODE_ALL      = hasFlag('-all');
const MODE_MESSAGES = hasFlag('-messages');
const MODE_FILES    = hasFlag('-files');
const MODE_MENTION  = hasFlag('-mentions');
const MODE_HEATMAP  = hasFlag('-heatmap') && !MODE_MENTION;

const DOWNLOAD_FILES    = MODE_ALL || MODE_FILES;
const SAVE_MESSAGES     = MODE_ALL || MODE_MESSAGES || (!MODE_MESSAGES && !MODE_FILES && !MODE_MENTION);
const FILES_ONLY_MODE   = MODE_FILES   && !MODE_ALL && !MODE_MESSAGES && !MODE_MENTION;
const MENTION_ONLY_MODE = MODE_MENTION && !MODE_ALL && !MODE_MESSAGES && !MODE_FILES;

const HAS_FILTERS        = ['image', 'video', 'file', 'embed', 'sticker', 'sound'];
const SYSTEM_TZ          = Intl.DateTimeFormat().resolvedOptions().timeZone;
const SEARCH_DELAY_MS    = 1500;
const RATE_LIMIT_WAIT_MS = 60 * 2000;
const PAGE_SIZE          = 25;

const HIDE_CURSOR    = '\x1b[?25l';
const SHOW_CURSOR    = '\x1b[?25h';
const CLEAR_LINE     = '\r\x1b[2K';
const SAVE_CURSOR    = '\x1b[s';
const RESTORE_CURSOR = '\x1b[u';
const RESET          = '\x1b[0m';

const CAT_FACES = {
  idle:    ['(=^ OwO  ^=)', '(=^ ◕ω◕ ^=)', '(=^ ✧ω✧ ^=)', '(=^ ≧◡≦ ^=)'],
  hunting: ['(=^ ⊙ω⊙ ^=)', '(=^ ◈ω◈ ^=)', '(=^ ◉ω◉ ^=)', '(=^ ✧ω✧ ^=)'],
  eating:  ['(=^ >ω< ^=)', '(=^ ꒰꒱ ^=)', '(=^ ᗒᗨᗕ ^=)', '(=^ NOM  ^=)'],
  sad:     ['(=^ ;ω; ^=)', '(=^ T_T ^=)', '(=^ ╥ω╥ ^=)', '(=^ u_u ^=)'],
  sleepy:  ['(=^ -ω- ^=)', '(=^ ˘ω˘ ^=)', '(=^ ᴖωᴖ ^=)', '(=^ zzZ  ^=)'],
  happy:   ['(=^ ≧ω≦ ^=)', '(=^ ^ω^ ^=)', '(=^ ᵔωᵔ ^=)', '(=^ ♡ω♡ ^=)'],
};
const CAT_FRAMES = CAT_FACES.idle; // legacy alias

const BANNER_COLOURS = [
  '\x1b[38;5;99m',
  '\x1b[38;5;105m',
  '\x1b[38;5;111m',
  '\x1b[38;5;117m',
  '\x1b[38;5;123m',
  '\x1b[38;5;117m',
  '\x1b[38;5;111m',
  '\x1b[38;5;105m',
  '\x1b[38;5;99m',
  '\x1b[38;5;93m',
  '\x1b[38;5;99m',
  '\x1b[38;5;105m',
];

const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&';

const EXT_BUCKETS = {
  img:   ['jpg','jpeg','png','webp','heic','heif','bmp','tiff','tif','avif'],
  gif:   ['gif'],
  vid:   ['mp4','mov','avi','mkv','webm','m4v','wmv','flv','3gp'],
  audio: ['mp3','ogg','wav','m4a','flac','aac','opus'],
  doc:   ['pdf','doc','docx','xls','xlsx','ppt','pptx','txt','csv','zip','rar','7z'],
};

module.exports = {
  TARGET_USER_ID,
  MODE_ALL,
  MODE_MESSAGES,
  MODE_FILES,
  MODE_MENTION,
  MODE_HEATMAP,
  DOWNLOAD_FILES,
  SAVE_MESSAGES,
  FILES_ONLY_MODE,
  MENTION_ONLY_MODE,
  HAS_FILTERS,
  SYSTEM_TZ,
  SEARCH_DELAY_MS,
  RATE_LIMIT_WAIT_MS,
  PAGE_SIZE,
  HIDE_CURSOR,
  SHOW_CURSOR,
  CLEAR_LINE,
  SAVE_CURSOR,
  RESTORE_CURSOR,
  RESET,
  CAT_FRAMES,
  CAT_FACES,
  BANNER_COLOURS,
  GLITCH_CHARS,
  EXT_BUCKETS,
};