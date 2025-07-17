const { createClient } = require('@supabase/supabase-js');
const { NeynarAPIClient } = require('@neynar/nodejs-sdk');
const { ethers } = require('ethers');

// Supabase client initialization
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Neynar client initialization
const neynar = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

// Base Sepolia provider
const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);

module.exports = {
  supabase,
  neynar,
  provider,
  PANDASCORE_API: {
    baseUrl: 'https://api.pandascore.co',
    token: process.env.PANDASCORE_TOKEN,
  }
};
