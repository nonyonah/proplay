"use client"

import { useState, useEffect } from "react"
import { isWalletCapabilityAvailable, getEthereumProvider } from "@/lib/farcaster"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { X, Wallet, Copy, AlertCircle } from "lucide-react"
import { API_ENDPOINTS, fetchApi } from "@/lib/api"

interface WalletModalProps {
  onClose: () => void
}

const mockWalletData = {
  address: "0x1234...5678",
  assets: [
    { symbol: "ETH", amount: "0.5", value: "$1,250.00" },
    { symbol: "USDC", amount: "10.0", value: "$10.00" },
    { symbol: "WETH", amount: "0.25", value: "$625.00" },
  ],
}

export function WalletModal({ onClose }: WalletModalProps) {
  const [walletData, setWalletData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    
    const getWalletData = async () => {
      try {
        // Check if wallet capability is available
        const walletAvailable = await isWalletCapabilityAvailable()
        if (!walletAvailable) {
          throw new Error('Wallet capability not available')
        }
        
        // Get Ethereum provider from Farcaster
        const provider = await getEthereumProvider()
        if (!provider) {
          throw new Error('Failed to get Ethereum provider')
        }
        
        // Get user's wallet address
        const accounts = await provider.request({ method: 'eth_requestAccounts' })
        const address = accounts[0]
        
        if (!address) {
          throw new Error('No wallet address found')
        }
        
        // Fetch wallet balances using the address
        const balanceData = await fetchApi<{eth: string, usdc: string}>(`${API_ENDPOINTS.wallet}/${address}`)
        
        // Format the data to match the expected structure
        setWalletData({
          address: address,
          assets: [
            { symbol: 'ETH', amount: balanceData.eth, value: `$${(parseFloat(balanceData.eth) * 2500).toFixed(2)}` },
            { symbol: 'USDC', amount: balanceData.usdc, value: `$${parseFloat(balanceData.usdc).toFixed(2)}` },
          ]
        })
      } catch (err) {
        console.error('Wallet error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load wallet data')
        
        // Fallback to API if Farcaster wallet integration fails
        try {
          const addressData = await fetchApi<{address: string}>(API_ENDPOINTS.wallet)
          const balanceData = await fetchApi<{eth: string, usdc: string}>(`${API_ENDPOINTS.wallet}/${addressData.address}`)
          
          setWalletData({
            address: addressData.address,
            assets: [
              { symbol: 'ETH', amount: balanceData.eth, value: `$${(parseFloat(balanceData.eth) * 2500).toFixed(2)}` },
              { symbol: 'USDC', amount: balanceData.usdc, value: `$${parseFloat(balanceData.usdc).toFixed(2)}` },
            ]
          })
          setError(null) // Clear error if fallback succeeds
        } catch (fallbackErr) {
          console.error('Fallback wallet error:', fallbackErr)
          // Keep the original error if fallback also fails
        }
      } finally {
        setLoading(false)
      }
    }
    
    getWalletData()
  }, [])

  const handleCopyAddress = () => {
    if (walletData?.address) {
      navigator.clipboard.writeText(walletData.address)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm mx-auto shadow-lg border border-gray-200 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-lg text-gray-900">Wallet</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading wallet data...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-600 font-medium">Error</p>
              </div>
              <p className="text-red-600 text-sm">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={() => {
                  setLoading(true)
                  setError(null)
                  fetchApi<{address: string, assets: any[]}>(API_ENDPOINTS.wallet)
                    .then((data) => setWalletData(data))
                    .catch((err) => setError(err.message || 'Failed to load wallet data'))
                    .finally(() => setLoading(false))
                }}
              >
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && walletData && (
            <>
              {/* Wallet Address */}
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-gray-700">{walletData.address}</span>
                  <Button variant="ghost" size="sm" onClick={handleCopyAddress} className="hover:bg-gray-200">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Assets */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-600">Assets</h4>
                {walletData.assets.map((asset: any) => (
              <div
                key={asset.symbol}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{asset.symbol[0]}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{asset.symbol}</div>
                    <div className="text-sm text-gray-600">{asset.amount}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{asset.value}</div>
                </div>
              </div>
            ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1 border-gray-200 bg-white hover:bg-gray-50">
                    Send
                  </Button>
                  <Button variant="outline" className="flex-1 border-gray-200 bg-white hover:bg-gray-50">
                    Receive
                  </Button>
                </div>
              </>
            )}
        </CardContent>
      </Card>
    </div>
  )
}
