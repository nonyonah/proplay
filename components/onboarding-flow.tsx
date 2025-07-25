"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Gamepad2, ChevronLeft, ChevronRight } from "lucide-react"
import { getFarcasterFid } from "@/lib/farcaster"
import { API_ENDPOINTS, getApiUrl } from "@/lib/api"

interface OnboardingFlowProps {
  onComplete: (preferences: any) => void
  onSkip: () => void
}

const esportsGames = [
  { id: "lol", name: "League of Legends" },
  { id: "cs2", name: "Counter-Strike 2" },
  { id: "valorant", name: "Valorant" },
  { id: "dota2", name: "Dota 2" },
]

const teams = [
  "T1",
  "Bilibili Gaming",
  "Fnatic",
  "G2 Esports",
  "Team Liquid",
  "Cloud9",
  "FaZe Clan",
  "Natus Vincere",
  "Sentinels",
  "LOUD",
  "100 Thieves",
  "TSM",
]

const players = [
  "Faker",
  "s1mple",
  "TenZ",
  "Caps",
  "Jankos",
  "Rekkles",
  "ZywOo",
  "device",
  "Aspas",
  "Less",
  "Sacy",
  "ShahZaM",
]

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedGames, setSelectedGames] = useState<string[]>([])
  const [favoriteTeam, setFavoriteTeam] = useState("")
  const [favoritePlayer, setFavoritePlayer] = useState("")
  const [teamSearch, setTeamSearch] = useState("")
  const [playerSearch, setPlayerSearch] = useState("")

  const handleGameToggle = (gameId: string) => {
    setSelectedGames((prev) => (prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId]))
  }

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      setSubmitting(true)
      setError(null)
      
      try {
        // Get Farcaster FID from utility function
        const fid = await getFarcasterFid()
        
        if (!fid) {
          throw new Error('User not authenticated')
        }
        
        // Save preferences to API
        const response = await fetch(getApiUrl(API_ENDPOINTS.preferences), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fid,
            genres: selectedGames,
            favorite_team: favoriteTeam,
            favorite_player: favoritePlayer,
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to save preferences: ${response.statusText}`)
        }

        // Complete onboarding
        onComplete({
          games: selectedGames,
          favoriteTeam,
          favoritePlayer,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setSubmitting(false)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedGames.length > 0
      case 2:
        return favoriteTeam !== ""
      case 3:
        return favoritePlayer !== ""
      default:
        return false
    }
  }

  const filteredTeams = teams.filter((team) => team.toLowerCase().includes(teamSearch.toLowerCase()))

  const filteredPlayers = players.filter((player) => player.toLowerCase().includes(playerSearch.toLowerCase()))

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <Card className="w-full max-w-md mx-auto shadow-lg border border-gray-200 bg-white">
        <CardHeader className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center">
            <div className="p-3 rounded-full bg-purple-50">
              <Gamepad2 className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-colors ${
                  step === currentStep ? "bg-purple-600" : step < currentStep ? "bg-purple-400" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <div className="text-right">
            <button onClick={onSkip} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Skip
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
          {/* Step 1: Choose Esports */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-lg font-bold mb-2 text-gray-900">Choose Your Favorite Esports</h2>
                <p className="text-sm text-gray-600">Select the games you want to follow</p>
              </div>

              <div className="space-y-3">
                {esportsGames.map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors bg-white"
                  >
                    <Checkbox
                      id={game.id}
                      checked={selectedGames.includes(game.id)}
                      onCheckedChange={() => handleGameToggle(game.id)}
                    />
                    <label htmlFor={game.id} className="flex-1 font-medium cursor-pointer text-gray-900">
                      {game.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Favorite Team */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-lg font-bold mb-2 text-gray-900">Pick Your Favorite Team</h2>
                <p className="text-sm text-gray-600">Choose a team to follow closely</p>
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="Search teams..."
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  className="border-gray-200"
                />

                <Select value={favoriteTeam} onValueChange={setFavoriteTeam}>
                  <SelectTrigger className="border-gray-200">
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTeams.map((team) => (
                      <SelectItem key={team} value={team}>
                        {team}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Favorite Player */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-lg font-bold mb-2 text-gray-900">Select Your Favorite Player</h2>
                <p className="text-sm text-gray-600">Pick a player to get personalized updates</p>
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="Search players..."
                  value={playerSearch}
                  onChange={(e) => setPlayerSearch(e.target.value)}
                  className="border-gray-200"
                />

                <Select value={favoritePlayer} onValueChange={setFavoritePlayer}>
                  <SelectTrigger className="border-gray-200">
                    <SelectValue placeholder="Select a player" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPlayers.map((player) => (
                      <SelectItem key={player} value={player}>
                        {player}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={submitting}
                className="flex-1 border-gray-200 bg-white hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={!canProceed() || submitting}
              className={`${currentStep === 1 ? "w-full" : "flex-1"} h-12 font-semibold bg-purple-600 hover:bg-purple-700 text-white`}
            >
              {submitting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  {currentStep === 3 ? "Saving..." : "Next"}
                </>
              ) : (
                <>
                  {currentStep === 3 ? "Finish" : "Next"}
                  {currentStep < 3 && <ChevronRight className="w-4 h-4 ml-1" />}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
