"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, LogOut, Heart, Share2, Trophy, Wallet, Home, Star, Play } from "lucide-react"

interface HomePageProps {
  onLogout: () => void
  onNavigateToFollowed: () => void
  onNavigateToPredictions: () => void
  onNavigateToLive: () => void
  onFollowMatch: (matchId: string) => void
  onShareMatch: (match: any) => void
  onOpenWallet: () => void
  followedMatches: string[]
  userPreferences: any
}

const mockMatches = [
  {
    id: "1",
    team1: "T1",
    team2: "Bilibili Gaming",
    game: "LoL",
    tournament: "EWC 2025",
    time: "July 16, 6 PM AST",
    status: "upcoming",
  },
  {
    id: "2",
    team1: "FaZe Clan",
    team2: "Natus Vincere",
    game: "CS2",
    tournament: "IEM Cologne",
    time: "July 16, 8 PM AST",
    status: "upcoming",
  },
  {
    id: "3",
    team1: "Sentinels",
    team2: "LOUD",
    game: "Valorant",
    tournament: "VCT Masters",
    time: "July 17, 2 PM AST",
    status: "upcoming",
  },
  {
    id: "4",
    team1: "G2 Esports",
    team2: "Fnatic",
    game: "LoL",
    tournament: "LEC Summer",
    time: "July 17, 4 PM AST",
    status: "upcoming",
  },
]

export function HomePage({
  onLogout,
  onNavigateToFollowed,
  onNavigateToPredictions,
  onNavigateToLive,
  onFollowMatch,
  onShareMatch,
  onOpenWallet,
  followedMatches,
  userPreferences,
}: HomePageProps) {
  const [gameFilter, setGameFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null)

  const filteredMatches = mockMatches.filter((match) => {
    if (gameFilter !== "all" && match.game !== gameFilter) return false
    return true
  })

  const toggleMatchExpansion = (matchId: string) => {
    setExpandedMatch(expandedMatch === matchId ? null : matchId)
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-purple-600" />
            <span className="font-bold text-lg text-gray-900">Esports Alerts</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenWallet}
              className="border-gray-200 bg-white hover:bg-gray-50"
            >
              <Wallet className="w-4 h-4 mr-1" />
              Wallet
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs bg-purple-100 text-purple-600">JD</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={onLogout} className="hover:bg-gray-100">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* User Preferences Summary */}
        {userPreferences.games.length > 0 && (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-gray-900">Your Preferences</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {userPreferences.games.map((game: string) => (
                  <Badge key={game} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                    {game.toUpperCase()}
                  </Badge>
                ))}
                {userPreferences.favoriteTeam && (
                  <Badge variant="outline" className="text-xs border-gray-200">
                    Team: {userPreferences.favoriteTeam}
                  </Badge>
                )}
                {userPreferences.favoritePlayer && (
                  <Badge variant="outline" className="text-xs border-gray-200">
                    Player: {userPreferences.favoritePlayer}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          <Select value={gameFilter} onValueChange={setGameFilter}>
            <SelectTrigger className="w-32 border-gray-200 bg-white">
              <SelectValue placeholder="Game" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Games</SelectItem>
              <SelectItem value="LoL">LoL</SelectItem>
              <SelectItem value="CS2">CS2</SelectItem>
              <SelectItem value="Valorant">Valorant</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-32 border-gray-200 bg-white">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Match List */}
        <div className="space-y-4">
          {filteredMatches.map((match) => (
            <Card
              key={match.id}
              className="hover:scale-[1.02] transition-all duration-200 shadow-sm border border-gray-200 bg-white cursor-pointer"
              onClick={() => toggleMatchExpansion(match.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                    {match.game}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-gray-200">
                    {match.tournament}
                  </Badge>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">{match.team1}</span>
                  </div>

                  <span className="text-sm font-medium text-gray-500">VS</span>

                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">{match.team2}</span>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">{match.time}</div>

                {/* Expanded Match Details */}
                {expandedMatch === match.id && (
                  <div className="space-y-4 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    {/* Live Status */}
                    <div className="flex items-center justify-between">
                      <Badge variant="destructive" className="text-xs animate-pulse bg-red-500 text-white">
                        🔴 LIVE
                      </Badge>
                      <span className="text-sm text-gray-600">Map 1, 15th min</span>
                    </div>

                    {/* Current Score */}
                    <div className="flex items-center justify-between text-center">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">1</div>
                        <div className="text-xs text-gray-600">Score</div>
                      </div>
                      <div className="text-sm text-gray-500">Current Match</div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">0</div>
                        <div className="text-xs text-gray-600">Score</div>
                      </div>
                    </div>

                    {/* Match Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Match Progress</span>
                        <span className="text-gray-600">60%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                    </div>

                    {/* Match Stats */}
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

                    {/* Live Updates */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-900">Live Updates</h4>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-900">T1 takes Baron!</span>
                          <span className="text-gray-500">2m ago</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-900">First blood to Bilibili Gaming!</span>
                          <span className="text-gray-500">5m ago</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-900">Match started</span>
                          <span className="text-gray-500">15m ago</span>
                        </div>
                      </div>
                    </div>

                    {/* Watch Live Button */}
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open("https://twitch.tv/riotgames", "_blank")
                      }}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Watch Live on Twitch
                    </Button>
                  </div>
                )}

                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant={followedMatches.includes(match.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFollowMatch(match.id)}
                    className={`flex-1 ${
                      followedMatches.includes(match.id)
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <Heart className={`w-4 h-4 mr-1 ${followedMatches.includes(match.id) ? "fill-current" : ""}`} />
                    {followedMatches.includes(match.id) ? "Followed" : "Follow"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
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

        {/* Quick Action */}
        <Button
          onClick={onNavigateToFollowed}
          className="w-full h-12 text-base font-semibold bg-purple-600 hover:bg-purple-700 text-white"
          disabled={followedMatches.length === 0}
        >
          View Followed Matches ({followedMatches.length})
        </Button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200">
        <div className="flex items-center justify-around p-4">
          <Button variant="ghost" className="flex flex-col items-center gap-1 text-purple-600 hover:bg-purple-50">
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
