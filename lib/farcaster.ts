/**
 * Utility functions for Farcaster integration
 */

import { sdk } from "@farcaster/miniapp-sdk"

/**
 * Gets the Farcaster ID (FID) from the authenticated user
 * @returns The FID as a string, or null if not authenticated
 */
export async function getFarcasterFid(): Promise<string | null> {
  try {
    // Get Farcaster authentication token
    const token = await sdk.quickAuth.getToken()
    if (!token) {
      return null
    }
    
    // Extract FID from token
    const tokenParts = token.split('.')
    if (tokenParts.length !== 3) {
      return null
    }
    
    const payload = JSON.parse(atob(tokenParts[1]))
    return payload.fid || null
  } catch (err) {
    console.error('Error getting Farcaster FID:', err)
    return null
  }
}

/**
 * Checks if the Farcaster wallet capability is available
 * @returns True if the wallet capability is available, false otherwise
 */
export async function isWalletCapabilityAvailable(): Promise<boolean> {
  try {
    const capabilities = await sdk.getCapabilities()
    return capabilities.includes('wallet.getEthereumProvider')
  } catch (err) {
    console.error('Error checking wallet capability:', err)
    return false
  }
}

/**
 * Gets the Ethereum provider from Farcaster
 * @returns The Ethereum provider, or null if not available
 */
export async function getEthereumProvider(): Promise<any | null> {
  try {
    if (!await isWalletCapabilityAvailable()) {
      return null
    }
    
    return await sdk.wallet.getEthereumProvider()
  } catch (err) {
    console.error('Error getting Ethereum provider:', err)
    return null
  }
}