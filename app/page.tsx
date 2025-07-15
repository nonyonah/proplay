"use client"

import { useState } from "react"
import { LoginPage } from "@/components/login-page"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { HomePage } from "@/components/home-page"
import { FollowedMatchesPage } from "@/components/followed-matches-page"
import { PredictionsPage } from "@/components/predictions-page"
import { LiveMatchesPage } from "@/components/live-matches-page"
import { ShareCastModal } from "@/components/share-cast-modal"
import { WalletModal } from "@/components/wallet-modal"
import { ThemeProvider } from "@/components/theme-provider"

export default function App() {
  const [currentPage, setCurrentPage] = useState<"login" | "onboarding" | "home" | "followed" | "predictions" | "live">(
    "login",
  )
  const [isAuthenticated, setIsAuthenticated] = useState(false)
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

  const handleLogin = () => {
    setIsAuthenticated(true)
    setCurrentPage("onboarding")
  }

  const handleOnboardingComplete = (preferences: any) => {
    setUserPreferences(preferences)
    setOnboardingComplete(true)
    setCurrentPage("home")
  }

  const handleSkipOnboarding = () => {
    setOnboardingComplete(true)
    setCurrentPage("home")
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setOnboardingComplete(false)
    setCurrentPage("login")
    setFollowedMatches([])
    setUserPreferences({ games: [], favoriteTeam: "", favoritePlayer: "" })
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
        {currentPage === "login" && <LoginPage onLogin={handleLogin} />}

        {currentPage === "onboarding" && (
          <OnboardingFlow onComplete={handleOnboardingComplete} onSkip={handleSkipOnboarding} />
        )}

        {currentPage === "home" && (
          <HomePage
            onLogout={handleLogout}
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
