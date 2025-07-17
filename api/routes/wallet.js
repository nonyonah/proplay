const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const { provider } = require('../config');

const USDC_ADDRESS = process.env.BASE_USDC_ADDRESS;
const USDC_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

// GET /api/wallet/:address - Get wallet balances
router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params;

    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid address' });
    }

    // Get ETH balance
    const ethBalance = await provider.getBalance(address);
    
    // Get USDC balance
    const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider);
    const [usdcBalance, decimals] = await Promise.all([
      usdcContract.balanceOf(address),
      usdcContract.decimals(),
    ]);

    res.json({
      eth: ethers.formatEther(ethBalance),
      usdc: ethers.formatUnits(usdcBalance, decimals),
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch wallet balances' });
  }
});

module.exports = router;
