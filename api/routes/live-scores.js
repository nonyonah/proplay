const express = require('express');
const router = express.Router();
const { fetchFromPandaScore, formatMatchData } = require('../utils');
const { supabase } = require('../config');

// GET /api/live-scores - Get live match data
router.get('/', async (req, res) => {
  try {
    const { fid } = req.query;
    
    // Get user preferences to prioritize their favorite games
    let genres = ['lol', 'csgo', 'valorant']; // Default genres
    if (fid) {
      const { data: userPrefs } = await supabase
        .from('users')
        .select('genres')
        .eq('fid', fid)
        .single();
      
      if (userPrefs?.genres) {
        genres = userPrefs.genres;
      }
    }

    // Fetch live matches for each game type
    const matchPromises = genres.map(game =>
      fetchFromPandaScore(`/${game}/matches/running`, {
        per_page: 10,
      })
    );

    const allMatches = await Promise.all(matchPromises);
    
    // Format and combine all live matches
    const liveMatches = allMatches
      .flat()
      .map(formatMatchData);

    // If user has FID, check if they're following any of these matches
    if (fid) {
      const { data: followedMatches } = await supabase
        .from('followed_matches')
        .select('match_id')
        .eq('fid', fid);

      const followedIds = followedMatches?.map(f => f.match_id) || [];
      
      // Add isFollowed flag to matches
      liveMatches.forEach(match => {
        match.isFollowed = followedIds.includes(match.id.toString());
      });
    }

    res.json(liveMatches);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch live scores' });
  }
});

// GET /api/live-scores/:matchId - Get specific match details
router.get('/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    
    // We'll try to find the match in any of the supported games
    const games = ['lol', 'csgo', 'valorant'];
    let matchData = null;

    for (const game of games) {
      try {
        const response = await fetchFromPandaScore(`/${game}/matches/${matchId}`);
        matchData = response;
        break;
      } catch (e) {
        continue; // Try next game type if match not found
      }
    }

    if (!matchData) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const formattedMatch = formatMatchData(matchData);
    res.json(formattedMatch);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch match details' });
  }
});

module.exports = router;
