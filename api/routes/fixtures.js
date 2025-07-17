const express = require('express');
const router = express.Router();
const { supabase } = require('../config');
const { fetchFromPandaScore, formatMatchData } = require('../utils');

// GET /api/fixtures - Get upcoming matches filtered by user preferences
router.get('/', async (req, res) => {
  try {
    const { fid } = req.query;
    if (!fid) {
      return res.status(400).json({ error: 'User FID is required' });
    }

    // Get user preferences
    const { data: userPrefs, error: prefsError } = await supabase
      .from('users')
      .select('genres, favorite_team')
      .eq('fid', fid)
      .single();

    if (prefsError) {
      console.error('Supabase Error:', prefsError);
      return res.status(500).json({ error: 'Failed to fetch user preferences' });
    }

    // Fetch upcoming matches from PandaScore for each genre
    const genres = userPrefs?.genres || ['lol', 'csgo', 'valorant'];
    const matchPromises = genres.map(game =>
      fetchFromPandaScore(`/${game}/matches/upcoming`, {
        per_page: 10,
      })
    );

    const allMatches = await Promise.all(matchPromises);
    
    // Flatten and format matches
    let fixtures = allMatches
      .flat()
      .map(formatMatchData)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    // If user has a favorite team, prioritize those matches
    if (userPrefs?.favorite_team) {
      fixtures.sort((a, b) => {
        const aHasTeam = a.teams.team1.name === userPrefs.favorite_team || 
                        a.teams.team2.name === userPrefs.favorite_team;
        const bHasTeam = b.teams.team1.name === userPrefs.favorite_team || 
                        b.teams.team2.name === userPrefs.favorite_team;
        return bHasTeam - aHasTeam;
      });
    }

    res.json(fixtures);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch fixtures' });
  }
});

module.exports = router;
