"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Wallet, Trophy, Play, Share2, Clock, Home, Star } from "lucide-react"
import { API_ENDPOINTS, fetchApi } from "@/lib/api"

interface LiveMatchesPageProps {
  onBack: () => void
  onNavigateToHome: () => void
  onNavigateToPredictions: () => void
  onOpenWallet: () => void
  onShareMatch: (match: any) => void
}

export function LiveMatchesPage({
  onBack,
  onNavigateToHome,
  onNavigateToPredictions,
  onOpenWallet,
  onShareMatch,
}: LiveMatchesPageProps) {
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null)
  const [liveMatches, setLiveMatches] = useState<any[]>([])
  const [updates, setUpdates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch live matches and updates
  useEffect(() => {
    setLoading(true)
    setError(null)
    
    Promise.all([
      fetchApi<any[]>(API_ENDPOINTS.fixtures).then(data => data.filter(match => match.status === 'live')),
      fetchApi<any[]>(API_ENDPOINTS.updates || `${API_ENDPOINTS.fixtures}/updates`)
    ])
      .then(([matchesData, updatesData]) => {
        setLiveMatches(matchesData)
        setUpdates(updatesData)
      })
      .catch((err) => setError(err.message || 'Failed to load live matches'))
      .finally(() => setLoading(false))
  }, [])

  const handleWatchLive = (twitchUrl: string) => {
    window.open(twitchUrl, "_blank")
  }

  const toggleMatchExpansion = (matchId: string) => {
    setExpandedMatch(expandedMatch === matchId ? null : matchId)
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-bold text-lg text-gray-900">Live Matches</h1>
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
        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading live matches...</p>
          </div>
        )}

        {/* Error State */}
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
                Promise.all([
                  fetchApi<any[]>(API_ENDPOINTS.fixtures).then(data => data.filter(match => match.status === 'live')),
                  fetchApi<any[]>(API_ENDPOINTS.updates || `${API_ENDPOINTS.fixtures}/updates`)
                ])
                  .then(([matchesData, updatesData]) => {
                    setLiveMatches(matchesData)
                    setUpdates(updatesData)
                  })
                  .catch((err) => setError(err.message || 'Failed to load live matches'))
                  .finally(() => setLoading(false))
              }}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Live Matches */}
        {!loading && !error && (
          <div className="space-y-4">
            {liveMatches.length === 0 ? (
              <Card className="border border-gray-200 bg-white shadow-sm">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600">No live matches at the moment</p>
                  <Button variant="outline" onClick={onBack} className="mt-4 border-gray-200 bg-white hover:bg-gray-50">
                    Browse Upcoming Matches
                  </Button>
                </CardContent>
              </Card>
            ) : (
              liveMatches.map((match) => (
            <Card
              key={match.id}
              className="hover:scale-[1.01] transition-all duration-200 shadow-sm border border-gray-200 bg-white"
            >
              <CardContent className="p-4 space-y-4">
                {/* Match Header */}
                <div className="flex items-center justify-between">
                  <Badge variant="destructive" className="text-xs animate-pulse bg-red-500 text-white">
                    🔴 LIVE
                  </Badge>
                  <Badge variant="outline" className="text-xs border-gray-200">
                    {match.tournament}
                  </Badge>
                </div>

                {/* Score */}
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleMatchExpansion(match.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{match.team1}</div>
                      <div className="text-2xl font-bold text-gray-900">{match.score1}</div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-sm text-gray-500">VS</div>
                    <div className="text-xs text-gray-500">{match.status}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{match.team2}</div>
                      <div className="text-2xl font-bold text-gray-900">{match.score2}</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Match Progress</span>
                    <span className="text-gray-600">{match.progress}%</span>
                  </div>
                  <Progress value={match.progress} className="h-2" />
                </div>

                {/* Expanded Stats */}
                {expandedMatch === match.id && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
                    <div className="text-sm font-medium text-gray-900">Match Stats</div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-gray-900">Kills</div>
                        <div className="text-gray-600">15 - 8</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900">Objectives</div>
                        <div className="text-gray-600">3 - 1</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900">Gold</div>
                        <div className="text-gray-600">45k - 38k</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleWatchLive(match.twitchUrl)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Watch Live
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onShareMatch(match)}
                    className="flex-1 border-gray-200 bg-white hover:bg-gray-50"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))
            )}
          </div>
        )}

        {/* Update Feed */}
        {!loading && !error && updates.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Live Updates</h3>
            <div className="space-y-3">
              {updates.map((update) => (
              <Card key={update.id} className="hover:bg-gray-50 transition-colors border border-gray-200 bg-white">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{update.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          {update.game}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {update.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>
        )}
      </div>

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
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 hover:bg-gray-100"
            onClick={onNavigateToPredictions}
          >
            <Star className="w-5 h-5" />
            <span className="text-xs">Predictions</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}
