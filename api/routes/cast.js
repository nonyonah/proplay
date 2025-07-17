const express = require('express');
const router = express.Router();
const { neynar } = require('../config');
const { fetchFromPandaScore, formatMatchData } = require('../utils');

// POST /api/cast - Post a cast about a match
router.post('/', async (req, res) => {
  try {
    const { fid, matchId, type } = req.body;

    if (!fid || !matchId) {
      return res.status(400).json({ error: 'FID and match ID required' });
    }

    // Get match data
    const games = ['lol', 'csgo', 'valorant'];
    let matchData = null;

    for (const game of games) {
      try {
        const data = await fetchFromPandaScore(`/${game}/matches/${matchId}`);
        matchData = formatMatchData(data);
        break;
      } catch (e) {
        continue;
      }
    }

    if (!matchData) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Generate cast text based on type
    let text = '';
    const team1 = matchData.teams.team1.name;
    const team2 = matchData.teams.team2.name;

    switch (type) {
      case 'share':
        text = `🎮 Exciting match coming up!\n${team1} vs ${team2}\n⏰ ${new Date(matchData.startTime).toLocaleString()}\n\nWatch it on Pro Play! #Esports`;
        break;
      case 'live':
        text = `🔴 LIVE NOW!\n${team1} ${matchData.score.team1} - ${matchData.score.team2} ${team2}\n\nCatch the action on Pro Play! #LiveEsports`;
        break;
      case 'result':
        text = `🏆 Match Result:\n${team1} ${matchData.score.team1} - ${matchData.score.team2} ${team2}\n\nWhat a game! #Esports`;
        break;
      default:
        return res.status(400).json({ error: 'Invalid cast type' });
    }

    // Post the cast
    await neynar.publishCast({
      text,
      fid: parseInt(fid),
      embeds: [{
        url: matchData.streamUrl || `https://proplay.com/match/${matchId}`,
      }],
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to post cast' });
  }
});

module.exports = router;
