"use client"

import { useState, useEffect } from "react"
import { getFarcasterFid } from "@/lib/farcaster"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Trophy, Star, Home, Wallet, Clock, Users } from "lucide-react"
import { API_ENDPOINTS, fetchApi, getApiUrl } from "@/lib/api"
import React from "react"

interface PredictionsPageProps {
  onNavigateToHome: () => void
  onOpenWallet: () => void
  onShareMatch: (match: any) => void
}

const mockPredictions = [
  {
    id: "1",
    team1: "T1",
    team2: "Bilibili Gaming",
    game: "LoL",
    tournament: "EWC 2025",
    time: "July 16, 6 PM AST",
    prizePool: "0.1 ETH",
    timeLeft: "2h 30m",
    topStakers: [
      { username: "@faker_fan", amount: "0.05 ETH" },
      { username: "@lol_expert", amount: "0.03 ETH" },
      { username: "@esports_king", amount: "0.02 ETH" },
    ],
  },
  {
    id: "2",
    team1: "FaZe Clan",
    team2: "Natus Vincere",
    game: "CS2",
    tournament: "IEM Cologne",
    time: "July 16, 8 PM AST",
    prizePool: "0.25 ETH",
    timeLeft: "4h 30m",
    topStakers: [
      { username: "@cs_pro", amount: "0.1 ETH" },
      { username: "@navi_believer", amount: "0.08 ETH" },
      { username: "@faze_up", amount: "0.07 ETH" },
    ],
  },
]

export function PredictionsPage({ onNavigateToHome, onOpenWallet, onShareMatch }: PredictionsPageProps) {
  const [predictions, setPredictions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [predictionModalOpen, setPredictionModalOpen] = useState(false)
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null)
  const [stakeAmount, setStakeAmount] = useState("")
  const [selectedAsset, setSelectedAsset] = useState("ETH")
  const [selectedTeam, setSelectedTeam] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  // Fetch predictions data
  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchApi<any[]>(API_ENDPOINTS.fixtures)
      .then((data) => {
        // Filter matches that are eligible for predictions
        const eligibleMatches = data.filter(match => {
          // Add any filtering logic here (e.g., matches that haven't started yet)
          return true
        })
        setPredictions(eligibleMatches)
      })
      .catch((err) => setError(err.message || 'Failed to load predictions'))
      .finally(() => setLoading(false))
  }, [])

  // Fetch wallet address
  useEffect(() => {
    fetchApi<{address: string}>(API_ENDPOINTS.wallet)
      .then((data) => setWalletAddress(data.address))
      .catch((err) => console.error('Failed to load wallet address:', err))
  }, [])

  const handlePredict = (prediction: any) => {
    setSelectedPrediction(prediction)
    setSelectedTeam("")
    setPredictionModalOpen(true)
  }

  const handleConfirmStake = async () => {
    if (!selectedTeam || !stakeAmount || !selectedPrediction || !walletAddress) return
    
    setSubmitting(true)
    setSubmitError(null)
    
    try {
      // Get Farcaster FID from utility function
      const fid = await getFarcasterFid()
      
      if (!fid) {
        throw new Error('User not authenticated')
      }
      
      // Make prediction via API
      const response = await fetch(getApiUrl(API_ENDPOINTS.predictions), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId: selectedPrediction.id,
          predictedWinner: selectedTeam,
          amount: stakeAmount,
          fid,
          walletAddress: walletAddress,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to make prediction: ${response.statusText}`)
      }

      // Close modal and reset form
      setPredictionModalOpen(false)
      setStakeAmount("")
      setSelectedTeam("")
      
      // Refresh predictions data
      fetchApi<any[]>(API_ENDPOINTS.fixtures)
        .then((data) => {
          const eligibleMatches = data.filter(match => true)
          setPredictions(eligibleMatches)
        })
        .catch((err) => console.error('Failed to refresh predictions:', err))
      
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onNavigateToHome} className="hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-bold text-lg text-gray-900">Predictions</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenWallet}
            className="border-gray-200 bg-white hover:bg-gray-50"
          >
            <Wallet className="w-4 h-4 mr-1" />
            Wallet
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading predictions...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={() => {
                setLoading(true)
                setError(null)
                fetchApi<any[]>(API_ENDPOINTS.fixtures)
                  .then((data) => {
                    const eligibleMatches = data.filter(match => true)
                    setPredictions(eligibleMatches)
                  })
                  .catch((err) => setError(err.message || 'Failed to load predictions'))
                  .finally(() => setLoading(false))
              }}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && predictions.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Predictions Available</h3>
            <p className="text-gray-600 mb-4">Check back later for upcoming matches</p>
          </div>
        )}

        {/* Predictions List */}
        {!loading && !error && predictions.length > 0 && (
          <div className="space-y-4">
            {predictions.map((prediction) => (
            <Card
              key={prediction.id}
              className="hover:scale-[1.01] transition-all duration-200 shadow-sm border border-gray-200 bg-white"
            >
              <CardContent className="p-4 space-y-4">
                {/* Match Header */}
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                    {prediction.game}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {prediction.timeLeft}
                  </div>
                </div>

                {/* Teams */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">{prediction.team1}</span>
                  </div>

                  <span className="text-sm font-medium text-gray-500">VS</span>

                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">{prediction.team2}</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Prize Pool */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <div className="text-sm text-gray-600">Prize Pool</div>
                    <div className="font-bold text-lg text-purple-600">{prediction.prizePool}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Tournament</div>
                    <div className="font-medium text-gray-900">{prediction.tournament}</div>
                  </div>
                </div>

                {/* Top Stakers */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    Top Stakers
                  </div>
                  <div className="space-y-1">
                    {prediction.topStakers.slice(0, 3).map((staker: any, index: number) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-purple-600">{staker.username}</span>
                        <span className="font-medium text-gray-900">{staker.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handlePredict(prediction)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Predict Winner
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>

      {/* Prediction Modal */}
      {predictionModalOpen && selectedPrediction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md mx-auto shadow-lg border border-gray-200 bg-white">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-gray-900">Place Prediction</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPredictionModalOpen(false)}
                  className="hover:bg-gray-100"
                >
                  ×
                </Button>
              </div>

              {/* Match Info */}
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="font-medium text-gray-900">
                  {selectedPrediction.team1} vs {selectedPrediction.team2}
                </div>
                <div className="text-sm text-gray-600">{selectedPrediction.tournament}</div>
                <div className="text-sm text-gray-600">Time left: {selectedPrediction.timeLeft}</div>
              </div>

              {/* Team Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900">Select Winning Team</label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={selectedTeam === selectedPrediction.team1 ? "default" : "outline"}
                    onClick={() => setSelectedTeam(selectedPrediction.team1)}
                    className={`p-4 h-auto flex flex-col items-center gap-2 ${
                      selectedTeam === selectedPrediction.team1
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{selectedPrediction.team1}</span>
                  </Button>

                  <Button
                    variant={selectedTeam === selectedPrediction.team2 ? "default" : "outline"}
                    onClick={() => setSelectedTeam(selectedPrediction.team2)}
                    className={`p-4 h-auto flex flex-col items-center gap-2 ${
                      selectedTeam === selectedPrediction.team2
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{selectedPrediction.team2}</span>
                  </Button>
                </div>
                {selectedTeam && (
                  <div className="text-sm text-gray-600 text-center">
                    You're betting on <span className="font-medium text-purple-600">{selectedTeam}</span> to win
                  </div>
                )}
              </div>

              {/* Stake Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Stake Amount</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="flex-1 border-gray-200"
                  />
                  <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                    <SelectTrigger className="w-20 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETH">ETH</SelectItem>
                      <SelectItem value="USDC">USDC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {stakeAmount && selectedTeam && (
                  <div className="text-sm text-gray-600">
                    Staking {stakeAmount} {selectedAsset} on {selectedTeam}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{submitError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setPredictionModalOpen(false)}
                  disabled={submitting}
                  className="flex-1 border-gray-200 bg-white hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmStake}
                  disabled={!stakeAmount || Number.parseFloat(stakeAmount) <= 0 || !selectedTeam || submitting}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Confirming...
                    </>
                  ) : (
                    "Confirm Stake"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200">
        <div className="flex items-center justify-around p-4">
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 hover:bg-gray-100"
            onClick={onNavigateToHome}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 text-purple-600 hover:bg-purple-50">
            <Star className="w-5 h-5" />
            <span className="text-xs">Predictions</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}
