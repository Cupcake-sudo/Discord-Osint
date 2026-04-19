const fetch = require('node-fetch');
const { RATE_LIMIT_WAIT_MS } = require('./constants');
const { statusSet, statusLog, delay } = require('./terminal');

let DISCORD_TOKEN = '';

function setToken(token) {
  DISCORD_TOKEN = token;
}

function getToken() {
  return DISCORD_TOKEN;
}

async function discordAPI(apiPath) {
  const token = DISCORD_TOKEN.replace(/^"|"$/g, '');
  const res   = await fetch('https://discord.com/api/v9' + apiPath, {
    headers: { Authorization: token },
  });

  if (res.status === 429) {
    // Lazy-require terminal here to avoid top-level circular dependency
    const { setCatMood } = require('./terminal');

    const rateLimitMessages = [
      'got caught... sitting very still...',
      'pretending to be a normal cat...',
      'staring at the wall and thinking about choices...',
      'waiting patiently (not really)...',
      'tail tucked. dignity: minimal...',
      'contemplating every decision that led here...',
    ];
    let rlMsgIdx  = 0;
    let rlMsgTick = 0;
    const RL_MSG_HOLD = 6;
    const total = RATE_LIMIT_WAIT_MS / 1000;
    const start = Date.now();

    setCatMood('sad');

    const rlIv = setInterval(() => {
      const elapsed   = Math.floor((Date.now() - start) / 1000);
      const remaining = Math.max(0, total - elapsed);
      statusSet(rateLimitMessages[rlMsgIdx] + '  back in ' + remaining + 's');
      rlMsgTick++;
      if (rlMsgTick >= RL_MSG_HOLD) {
        rlMsgTick = 0;
        rlMsgIdx  = (rlMsgIdx + 1) % rateLimitMessages.length;
      }
    }, 500);

    await delay(RATE_LIMIT_WAIT_MS);
    clearInterval(rlIv);
    setCatMood('hunting');
    statusLog('  ✓  timeout lifted — back on the trail...');
    return discordAPI(apiPath);
  }

  return res.json();
}

async function tryResolveFromAPI(userId) {
  try {
    const user = await discordAPI('/users/' + userId);
    if (user && user.username && !user.code) {
      return user.discriminator && user.discriminator !== '0'
        ? user.username + '#' + user.discriminator
        : user.username;
    }
  } catch {}
  return null;
}

module.exports = { discordAPI, tryResolveFromAPI, setToken, getToken };