"use client"

import { useState } from "react"
import { sdk } from "@farcaster/miniapp-sdk"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Trophy } from "lucide-react"

interface ShareCastModalProps {
  match: {
    team1: string
    team2: string
    game: string
    tournament: string
    time?: string
    score1?: number
    score2?: number
    status?: string
  }
  onClose: () => void
}

export function ShareCastModal({ match, onClose }: ShareCastModalProps) {
  const generateCastText = () => {
    if (match.score1 !== undefined && match.score2 !== undefined) {
      // Live match
      return `🔴 LIVE: ${match.team1} ${match.score1}-${match.score2} ${match.team2} in ${match.game} ${match.tournament}! ${match.status} #EsportsHub`
    } else {
      // Upcoming match
      return `${match.team1} vs. ${match.team2}, ${match.game} ${match.tournament}, ${match.time} #EsportsHub`
    }
  }

  const [castText, setCastText] = useState(generateCastText())

  const handlePostCast = async () => {
    try {
      // Use Farcaster SDK to post the cast
      await sdk.actions.composeCast({
        text: castText
      })
      console.log("Cast posted successfully")
      onClose()
    } catch (error) {
      console.error("Error posting cast:", error)
      // Could add error handling UI here
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md mx-auto shadow-lg border border-gray-200 bg-white">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-gray-900">Share Match</h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <Textarea
            value={castText}
            onChange={(e) => setCastText(e.target.value)}
            placeholder="Share this match..."
            className="min-h-[100px] resize-none border-gray-200"
            maxLength={280}
          />

          <div className="text-xs text-gray-500 text-right">{castText.length}/280</div>

          {/* Embed Preview */}
          <Card className="bg-gray-50 border border-gray-100">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                  {match.game}
                </Badge>
                <Badge variant="outline" className="text-xs border-gray-200">
                  {match.tournament}
                </Badge>
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Trophy className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">{match.team1}</span>
                    {match.score1 !== undefined && <span className="ml-2 font-bold text-gray-900">{match.score1}</span>}
                  </div>
                </div>

                <span className="text-xs text-gray-500">VS</span>

                <div className="flex items-center gap-2">
                  <div>
                    {match.score2 !== undefined && <span className="mr-2 font-bold text-gray-900">{match.score2}</span>}
                    <span className="text-sm font-medium text-gray-900">{match.team2}</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                    <Trophy className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-600">{match.time || match.status}</div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 border-gray-200 bg-white hover:bg-gray-50">
              Cancel
            </Button>
            <Button onClick={handlePostCast} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
              Post Cast
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
