"use client"

import { useState, useEffect } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { HomePage } from "@/components/home-page"
import { FollowedMatchesPage } from "@/components/followed-matches-page"
import { PredictionsPage } from "@/components/predictions-page"
import { LiveMatchesPage } from "@/components/live-matches-page"
import { ShareCastModal } from "@/components/share-cast-modal"
import { WalletModal } from "@/components/wallet-modal"
import { ThemeProvider } from "@/components/theme-provider"

export default function App() {
  const [currentPage, setCurrentPage] = useState<"splash" | "onboarding" | "home" | "followed" | "predictions" | "live">(
    "splash"
  )
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<any>(null)
  const [followedMatches, setFollowedMatches] = useState<string[]>([])
  const [userPreferences, setUserPreferences] = useState({
    games: [] as string[],
    favoriteTeam: "",
    favoritePlayer: "",
  })

  // Auto-transition from splash to onboarding after frame connection
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage("onboarding")
    }, 3000) // Show splash screen for 3 seconds
    return () => clearTimeout(timer)
  }, [])

  const handleOnboardingComplete = (preferences: any) => {
    setUserPreferences(preferences)
    setOnboardingComplete(true)
    setCurrentPage("home")
  }

  const handleSkipOnboarding = () => {
    setOnboardingComplete(true)
    setCurrentPage("home")
  }

  const handleFollowMatch = (matchId: string) => {
    setFollowedMatches((prev) => (prev.includes(matchId) ? prev.filter((id) => id !== matchId) : [...prev, matchId]))
  }

  const handleShareMatch = (match: any) => {
    setSelectedMatch(match)
    setShareModalOpen(true)
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        {currentPage === "splash" && <SplashScreen />}

        {currentPage === "onboarding" && (
          <OnboardingFlow onComplete={handleOnboardingComplete} onSkip={handleSkipOnboarding} />
        )}

        {currentPage === "home" && (
          <HomePage
            onNavigateToFollowed={() => setCurrentPage("followed")}
            onNavigateToPredictions={() => setCurrentPage("predictions")}
            onNavigateToLive={() => setCurrentPage("live")}
            onFollowMatch={handleFollowMatch}
            onShareMatch={handleShareMatch}
            onOpenWallet={() => setWalletModalOpen(true)}
            followedMatches={followedMatches}
            userPreferences={userPreferences}
          />
        )}

        {currentPage === "followed" && (
          <FollowedMatchesPage
            onBack={() => setCurrentPage("home")}
            onUnfollowMatch={handleFollowMatch}
            followedMatches={followedMatches}
          />
        )}

        {currentPage === "predictions" && (
          <PredictionsPage
            onNavigateToHome={() => setCurrentPage("home")}
            onOpenWallet={() => setWalletModalOpen(true)}
            onShareMatch={handleShareMatch}
          />
        )}

        {currentPage === "live" && (
          <LiveMatchesPage
            onBack={() => setCurrentPage("home")}
            onNavigateToHome={() => setCurrentPage("home")}
            onNavigateToPredictions={() => setCurrentPage("predictions")}
            onOpenWallet={() => setWalletModalOpen(true)}
            onShareMatch={handleShareMatch}
          />
        )}

        {shareModalOpen && selectedMatch && (
          <ShareCastModal match={selectedMatch} onClose={() => setShareModalOpen(false)} />
        )}

        {walletModalOpen && <WalletModal onClose={() => setWalletModalOpen(false)} />}
      </div>
    </ThemeProvider>
  )
}
