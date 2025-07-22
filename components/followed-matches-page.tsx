"use client"

import { useState, useEffect } from "react"
import { getFarcasterFid } from "@/lib/farcaster"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, X } from "lucide-react"
import { API_ENDPOINTS, fetchApi } from "@/lib/api"
import React from "react"

interface FollowedMatchesPageProps {
  onBack: () => void
  onUnfollowMatch: (matchId: string) => void
  followedMatches: string[]
}

const mockMatches = [
  {
    id: "1",
    team1: "T1",
    team2: "Bilibili Gaming",
    game: "LoL",
    tournament: "EWC 2025",
    time: "July 16, 6 PM AST",
    status: "Upcoming",
  },
  {
    id: "2",
    team1: "FaZe Clan",
    team2: "Natus Vincere",
    game: "CS2",
    tournament: "IEM Cologne",
    time: "July 16, 8 PM AST",
    status: "Notified",
  },
]

export const FollowedMatchesPage = React.forwardRef<HTMLDivElement, FollowedMatchesPageProps>(({ onBack, onUnfollowMatch, followedMatches }, ref) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unfollowingMatch, setUnfollowingMatch] = useState<string | null>(null)

  // Fetch followed matches data
  useEffect(() => {
    if (followedMatches.length === 0) {
      setMatches([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    
    // Fetch match details for followed matches
    fetchApi<any[]>(API_ENDPOINTS.fixtures)
      .then((data) => {
        const followedMatchesData = data.filter(match => followedMatches.includes(match.id))
        setMatches(followedMatchesData)
      })
      .catch((err) => setError(err.message || 'Failed to load followed matches'))
      .finally(() => setLoading(false))
  }, [followedMatches])

  // Handle unfollowing a match with API integration
  const handleUnfollowMatch = async (matchId: string) => {
    setUnfollowingMatch(matchId)
    
    try {
      // Get Farcaster FID from utility function
      const fid = await getFarcasterFid()
      
      if (!fid) {
        throw new Error('User not authenticated')
      }
      
      // Call the API to unfollow the match
      const response = await fetch(`${API_ENDPOINTS.follow}/${matchId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fid,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to unfollow match')
      }

      // Call the parent component's unfollow handler
      onUnfollowMatch(matchId)
    } catch (err) {
      console.error('Error unfollowing match:', err)
      // We could show an error toast here
    } finally {
      setUnfollowingMatch(null)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-gray-100">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-bold text-lg text-gray-900">Followed Matches</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Notification Toggle */}
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Enable Notifications</h3>
                <p className="text-sm text-gray-600">Get alerts before matches start</p>
              </div>
              <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading followed matches...</p>
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
                fetchApi<any[]>(API_ENDPOINTS.fixtures)
                  .then((data) => {
                    const followedMatchesData = data.filter(match => followedMatches.includes(match.id))
                    setMatches(followedMatchesData)
                  })
                  .catch((err) => setError(err.message || 'Failed to load followed matches'))
                  .finally(() => setLoading(false))
              }}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Followed Matches */}
        {!loading && !error && (
          <div className="space-y-4">
            {matches.length === 0 ? (
              <Card className="border border-gray-200 bg-white shadow-sm">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600">No followed matches yet</p>
                  <Button variant="outline" onClick={onBack} className="mt-4 border-gray-200 bg-white hover:bg-gray-50">
                    Browse Matches
                  </Button>
                </CardContent>
              </Card>
            ) : (
              matches.map((match) => (
                <Card
                  key={match.id}
                  className="hover:scale-[1.01] transition-all duration-200 border border-gray-200 bg-white shadow-sm"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        {match.game}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs border-gray-200">
                          {match.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnfollowMatch(match.id)}
                          disabled={unfollowingMatch === match.id}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          {unfollowingMatch === match.id ? (
                            <div className="animate-spin w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full"></div>
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-900">{match.team1}</span>
                      </div>

                      <span className="text-sm font-medium text-gray-500">VS</span>

                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">{match.team2}</span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      {match.time} • {match.tournament}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
