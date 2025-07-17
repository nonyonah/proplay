const express = require('express');
const router = express.Router();
const { supabase } = require('../config');

// POST /api/preferences - Save user preferences
router.post('/', async (req, res) => {
  try {
    const { fid, genres, favorite_team, favorite_player } = req.body;

    if (!fid) {
      return res.status(400).json({ error: 'FID required' });
    }

    // Validate genres
    const validGenres = ['lol', 'csgo', 'valorant'];
    if (genres && !genres.every(g => validGenres.includes(g))) {
      return res.status(400).json({ error: 'Invalid genres' });
    }

    // Upsert preferences in Supabase
    const { error } = await supabase
      .from('users')
      .upsert({
        fid,
        genres: genres || [],
        favorite_team,
        favorite_player,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'fid',
      });

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ error: 'Failed to save preferences' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to save preferences' });
  }
});

// GET /api/preferences/:fid - Get user preferences
router.get('/:fid', async (req, res) => {
  try {
    const { fid } = req.params;

    const { data, error } = await supabase
      .from('users')
      .select('genres, favorite_team, favorite_player')
      .eq('fid', fid)
      .single();

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ error: 'Failed to fetch preferences' });
    }

    res.json(data || { genres: [], favorite_team: null, favorite_player: null });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

module.exports = router;
