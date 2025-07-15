"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { X, Wallet, Copy } from "lucide-react"

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
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(mockWalletData.address)
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
          {/* Wallet Address */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-gray-700">{mockWalletData.address}</span>
              <Button variant="ghost" size="sm" onClick={handleCopyAddress} className="hover:bg-gray-200">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Assets */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-600">Assets</h4>
            {mockWalletData.assets.map((asset) => (
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
        </CardContent>
      </Card>
    </div>
  )
}
