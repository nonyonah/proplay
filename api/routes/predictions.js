const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const { provider, neynar } = require('../config');

const PREDICTION_POOL_ADDRESS = process.env.PREDICTION_POOL_ADDRESS;
let contract = null;
let PredictionPoolABI = null;

// Only initialize contract if all required environment variables are available
if (PREDICTION_POOL_ADDRESS && provider) {
  try {
    PredictionPoolABI = require('../contracts/PredictionPool.json');
    contract = new ethers.Contract(PREDICTION_POOL_ADDRESS, PredictionPoolABI, provider);
  } catch (error) {
    console.warn('Contract initialization failed, predictions will be disabled:', error.message);
  }
}

// POST /api/predictions - Make a prediction
router.post('/', async (req, res) => {
  try {
    if (!contract) {
      return res.status(503).json({ error: 'Predictions service not available' });
    }

    const { matchId, predictedWinner, amount, fid, walletAddress } = req.body;

    if (!matchId || !predictedWinner || !amount || !fid || !walletAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify prediction is valid (1 for team1, 2 for team2)
    if (predictedWinner !== 1 && predictedWinner !== 2) {
      return res.status(400).json({ error: 'Invalid prediction' });
    }

    try {
      // Make the prediction on-chain
      const signer = provider.getSigner(walletAddress);
      const tx = await contract.connect(signer).makePrediction(
        matchId,
        predictedWinner,
        { value: ethers.parseEther(amount.toString()) }
      );
      await tx.wait();

      // Post cast about the prediction
      await neynar.publishCast({
        text: `🎮 Just predicted on match #${matchId} with ${amount} ETH! Who's with me? #ProPlay #Esports`,
        fid: parseInt(fid),
      });

      res.json({
        success: true,
        transactionHash: tx.hash,
      });
    } catch (error) {
      console.error('Contract Error:', error);
      return res.status(500).json({ error: 'Failed to make prediction' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process prediction' });
  }
});

// GET /api/predictions/:matchId - Get match predictions
router.get('/:matchId', async (req, res) => {
  try {
    if (!contract) {
      return res.status(503).json({ error: 'Predictions service not available' });
    }

    const { matchId } = req.params;
    
    // Get match stats from contract
    const stats = await contract.getMatchStats(matchId);
    
    const response = {
      team1Pool: ethers.formatEther(stats.team1Pool),
      team2Pool: ethers.formatEther(stats.team2Pool),
      totalPool: ethers.formatEther(stats.team1Pool.add(stats.team2Pool)),
      winner: stats.winner,
      finalized: stats.finalized,
    };

    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
});

// POST /api/predictions/:matchId/claim - Claim prediction rewards
router.post('/:matchId/claim', async (req, res) => {
  try {
    if (!contract) {
      return res.status(503).json({ error: 'Predictions service not available' });
    }

    const { matchId } = req.params;
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    const signer = provider.getSigner(walletAddress);
    const tx = await contract.connect(signer).claimReward(matchId);
    await tx.wait();

    res.json({
      success: true,
      transactionHash: tx.hash,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to claim reward' });
  }
});

module.exports = router;
