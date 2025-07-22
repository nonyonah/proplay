const { createClient } = require('@supabase/supabase-js');
const { NeynarAPIClient } = require('@neynar/nodejs-sdk');
const { ethers } = require('ethers');

// Supabase client initialization (optional)
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );
}

// Neynar client initialization (optional)
let neynar = null;
if (process.env.NEYNAR_API_KEY) {
  neynar = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
}

// Base Sepolia provider (optional)
let provider = null;
if (process.env.BASE_RPC_URL) {
  provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);
}

module.exports = {
  supabase,
  neynar,
  provider,
  PANDASCORE_API: {
    baseUrl: 'https://api.pandascore.co',
    token: process.env.PANDASCORE_TOKEN,
  }
};
