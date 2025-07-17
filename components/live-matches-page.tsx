"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Trophy, Star, Home, Wallet, Play, Share2, Clock } from "lucide-react"
import { API_ENDPOINTS, fetchApi } from "@/lib/api"

interface LiveMatchesPageProps {
  onBack: () => void
  onNavigateToHome: () => void
  onNavigateToPredictions: () => void
  onOpenWallet: () => void
  onShareMatch: (match: any) => void
}

const mockLiveMatches = [
  {
    id: "1",
    team1: "T1",
    team2: "Bilibili Gaming",
    score1: 1,
    score2: 0,
    game: "LoL",
    tournament: "EWC 2025",
    status: "Map 1, 15th min",
    progress: 60,
    twitchUrl: "https://twitch.tv/riotgames",
  },
  {
    id: "2",
    team1: "FaZe Clan",
    team2: "Natus Vincere",
    score1: 13,
    score2: 8,
    game: "CS2",
    tournament: "IEM Cologne",
    status: "Dust2, Round 22",
    progress: 85,
    twitchUrl: "https://twitch.tv/esl_csgo",
  },
]

const mockUpdates = [
  { id: 1, text: "T1 takes Baron! #LoL", time: "2m ago", game: "LoL" },
  { id: 2, text: "FaZe wins pistol round! #CS2", time: "5m ago", game: "CS2" },
  { id: 3, text: "Incredible 1v3 clutch by s1mple! #CS2", time: "8m ago", game: "CS2" },
  { id: 4, text: "First blood to Bilibili Gaming! #LoL", time: "12m ago", game: "LoL" },
]

export function LiveMatchesPage({
  onBack,
  onNavigateToHome,
  onNavigateToPredictions,
  onOpenWallet,
  onShareMatch,
}: LiveMatchesPageProps) {
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null)

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
        {/* Live Matches */}
        <div className="space-y-4">
          {mockLiveMatches.map((match) => (
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
          ))}
        </div>

        {/* Update Feed */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">Live Updates</h3>
          <div className="space-y-3">
            {mockUpdates.map((update) => (
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
