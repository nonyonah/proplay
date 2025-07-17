const express = require('express');
const router = express.Router();
const { supabase, neynar } = require('../config');
const { fetchFromPandaScore, sendFarcasterNotification } = require('../utils');

// POST /api/follow - Follow a match
router.post('/', async (req, res) => {
  try {
    const { matchId, fid } = req.body;

    if (!matchId || !fid) {
      return res.status(400).json({ error: 'Match ID and FID required' });
    }

    // Save follow in Supabase
    const { error } = await supabase
      .from('followed_matches')
      .insert({
        fid,
        match_id: matchId,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ error: 'Failed to follow match' });
    }

    // Schedule notification (30 mins before match)
    try {
      const games = ['lol', 'csgo', 'valorant'];
      let matchData = null;

      for (const game of games) {
        try {
          matchData = await fetchFromPandaScore(`/${game}/matches/${matchId}`);
          break;
        } catch (e) {
          continue;
        }
      }

      if (matchData) {
        const matchTime = new Date(matchData.scheduled_at);
        const notifyTime = new Date(matchTime.getTime() - 30 * 60000); // 30 mins before
        
        if (notifyTime > new Date()) {
          // Schedule notification in Supabase
          await supabase
            .from('notifications')
            .insert({
              fid,
              match_id: matchId,
              notify_at: notifyTime.toISOString(),
              message: `🎮 Your followed match ${matchData.opponents[0]?.opponent.name} vs ${matchData.opponents[1]?.opponent.name} starts in 30 minutes!`,
              sent: false,
            });
        }
      }
    } catch (error) {
      console.error('Notification Error:', error);
      // Don't fail the request if notification scheduling fails
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to follow match' });
  }
});

// DELETE /api/follow/:matchId - Unfollow a match
router.delete('/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    const { fid } = req.query;

    if (!fid) {
      return res.status(400).json({ error: 'FID required' });
    }

    const { error } = await supabase
      .from('followed_matches')
      .delete()
      .match({ fid, match_id: matchId });

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ error: 'Failed to unfollow match' });
    }

    // Remove scheduled notifications
    await supabase
      .from('notifications')
      .delete()
      .match({ fid, match_id: matchId, sent: false });

    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to unfollow match' });
  }
});

// GET /api/follow/:fid - Get user's followed matches
router.get('/:fid', async (req, res) => {
  try {
    const { fid } = req.params;
    
    const { data, error } = await supabase
      .from('followed_matches')
      .select('match_id')
      .eq('fid', fid)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ error: 'Failed to fetch followed matches' });
    }

    // Fetch match details for each followed match
    const matchPromises = data.map(async ({ match_id }) => {
      const games = ['lol', 'csgo', 'valorant'];
      for (const game of games) {
        try {
          const matchData = await fetchFromPandaScore(`/${game}/matches/${match_id}`);
          return matchData;
        } catch (e) {
          continue;
        }
      }
      return null;
    });

    const matches = (await Promise.all(matchPromises))
      .filter(Boolean)
      .map(match => ({
        id: match.id,
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
      }));

    res.json(matches);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch followed matches' });
  }
});

module.exports = router;
