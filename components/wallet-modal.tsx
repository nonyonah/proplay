"use client"

import { useState, useEffect } from "react"
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { X, Wallet, Copy, AlertCircle } from "lucide-react"
import { API_ENDPOINTS, fetchApi } from "@/lib/api"

interface WalletModalProps {
  onClose: () => void
}

export function WalletModal({ onClose }: WalletModalProps) {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: ethBalance } = useBalance({ address })
  const [usdcBalance, setUsdcBalance] = useState<string>('0')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (address && isConnected) {
      // Fetch USDC balance from API
      const fetchUsdcBalance = async () => {
        try {
          setLoading(true)
          const balanceData = await fetchApi<{usdc: string}>(`${API_ENDPOINTS.wallet}/${address}`)
          setUsdcBalance(balanceData.usdc)
        } catch (err) {
          console.error('Failed to fetch USDC balance:', err)
          setError('Failed to load USDC balance')
        } finally {
          setLoading(false)
        }
      }
      
      fetchUsdcBalance()
    }
  }, [address, isConnected])

  const handleConnect = () => {
    const farcasterConnector = connectors.find(connector => 
      connector.name.toLowerCase().includes('farcaster') || 
      connector.id.includes('farcaster')
    )
    
    if (farcasterConnector) {
      connect({ connector: farcasterConnector })
    } else {
      // Fallback to first available connector
      connect({ connector: connectors[0] })
    }
  }

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  const formatBalance = (balance: string | undefined, decimals: number = 4) => {
    if (!balance) return '0'
    const num = parseFloat(balance)
    return num.toFixed(decimals)
  }

  const formatUsdValue = (amount: string, price: number) => {
    const value = parseFloat(amount) * price
    return `$${value.toFixed(2)}`
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
          {!isConnected ? (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">Connect your wallet to view balances</p>
              <Button onClick={handleConnect} className="w-full">
                Connect Wallet
              </Button>
            </div>
          ) : (
            <>
              {loading && (
                <div className="text-center py-2">
                  <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Loading balances...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-red-600 font-medium text-sm">Error</p>
                  </div>
                  <p className="text-red-600 text-xs">{error}</p>
                </div>
              )}

              {/* Wallet Address */}
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-gray-700">
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleCopyAddress} className="hover:bg-gray-200">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Assets */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-600">Assets</h4>
                
                {/* ETH Balance */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">E</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">ETH</div>
                      <div className="text-sm text-gray-600">
                        {formatBalance(ethBalance?.formatted)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {formatUsdValue(ethBalance?.formatted || '0', 2500)}
                    </div>
                  </div>
                </div>

                {/* USDC Balance */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">U</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">USDC</div>
                      <div className="text-sm text-gray-600">
                        {formatBalance(usdcBalance)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {formatUsdValue(usdcBalance, 1)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 border-gray-200 bg-white hover:bg-gray-50">
                  Send
                </Button>
                <Button variant="outline" className="flex-1 border-gray-200 bg-white hover:bg-gray-50">
                  Receive
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => disconnect()}
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                >
                  Disconnect
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
