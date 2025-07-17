const axios = require('axios');
const { PANDASCORE_API } = require('../config');

// Fetch data from PandaScore API with error handling
async function fetchFromPandaScore(endpoint, params = {}) {
  try {
    const response = await axios.get(`${PANDASCORE_API.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${PANDASCORE_API.token}`,
      },
      params,
    });
    return response.data;
  } catch (error) {
    console.error(`PandaScore API Error: ${error.message}`);
    throw new Error('Failed to fetch data from PandaScore');
  }
}

// Format match data for frontend
function formatMatchData(match) {
  return {
    id: match.id,
    league: match.league.name,
    teams: {
      team1: {
        name: match.opponents[0]?.opponent.name,
        logo: match.opponents[0]?.opponent.image_url,
      },
      team2: {
        name: match.opponents[1]?.opponent.name,
        logo: match.opponents[1]?.opponent.image_url,
      }
    },
    startTime: match.scheduled_at,
    status: match.status,
    streamUrl: match.live_url,
    score: {
      team1: match.results?.[0]?.score || 0,
      team2: match.results?.[1]?.score || 0,
    },
  };
}

// Send notification via Neynar
async function sendFarcasterNotification(neynar, fid, message) {
  try {
    await neynar.publishNotification({
      recipientFids: [fid],
      message,
    });
  } catch (error) {
    console.error(`Neynar Notification Error: ${error.message}`);
    throw new Error('Failed to send notification');
  }
}

module.exports = {
  fetchFromPandaScore,
  formatMatchData,
  sendFarcasterNotification,
};
