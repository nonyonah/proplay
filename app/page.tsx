"use client"

import { useState, useEffect } from "react"
import { sdk } from "@farcaster/miniapp-sdk"
import { getFarcasterFid } from "@/lib/farcaster"
import { SplashScreen } from "@/components/splash-screen"
import { LoginPage } from "@/components/login-page"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { HomePage } from "@/components/home-page"
import { FollowedMatchesPage } from "@/components/followed-matches-page"
import { PredictionsPage } from "@/components/predictions-page"
import { LiveMatchesPage } from "@/components/live-matches-page"
import { ShareCastModal } from "@/components/share-cast-modal"
import { WalletModal } from "@/components/wallet-modal"
import { ThemeProvider } from "@/components/theme-provider"
import { API_ENDPOINTS, getApiUrl } from "@/lib/api"

export default function App() {
  const [currentPage, setCurrentPage] = useState<"splash" | "login" | "onboarding" | "home" | "followed" | "predictions" | "live">(
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
  const [fid, setFid] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)

  // Initialize Farcaster MiniApp SDK and transition from splash to onboarding
  useEffect(() => {
    const initializeFarcaster = async () => {
      try {
        // Tell the Farcaster client we're ready to display content
        await sdk.actions.ready()
        
        // Get user authentication information using utility function
        const farcasterFid = await getFarcasterFid()
        if (farcasterFid) {
          setFid(farcasterFid)
          setAuthError(null)
          // User is authenticated, proceed to onboarding
          setCurrentPage("onboarding")
        } else {
          // User is not authenticated, redirect to login
          setAuthError("User not authenticated")
          setCurrentPage("login")
        }
      } catch (error) {
        console.error("Error initializing Farcaster SDK:", error)
        setAuthError("Failed to initialize Farcaster SDK")
        // Redirect to login on SDK initialization failure
        setCurrentPage("login")
      }
    }
    
    initializeFarcaster()
  }, [])

  // Fetch user preferences and followed matches when FID is available
  useEffect(() => {
    // Only fetch data if user is authenticated
    if (!fid) return;
    
    // Fetch user preferences
    fetch(getApiUrl(`${API_ENDPOINTS.preferences}?fid=${fid}`))
      .then(response => {
        if (!response.ok) throw new Error(`Failed to fetch preferences: ${response.statusText}`)
        return response.json()
      })
      .then(data => {
        if (data && data.genres) {
          setUserPreferences({
            games: data.genres || [],
            favoriteTeam: data.favorite_team || '',
            favoritePlayer: data.favorite_player || '',
          })
          
          // If user has preferences, mark onboarding as complete
          if (data.genres && data.genres.length > 0) {
            setOnboardingComplete(true)
          }
        }
      })
      .catch(err => {
        console.error('Error fetching preferences:', err)
        // Don't block the app if preferences fail to load
      })
    
    // Fetch followed matches
    fetch(getApiUrl(`${API_ENDPOINTS.follow}/${fid}`))
      .then(response => {
        if (!response.ok) throw new Error(`Failed to fetch followed matches: ${response.statusText}`)
        return response.json()
      })
      .then(data => {
        if (data && Array.isArray(data)) {
          // Extract match IDs from the response
          const matchIds = data.map((match: any) => match.match_id)
          setFollowedMatches(matchIds)
        }
      })
      .catch(err => {
        console.error('Error fetching followed matches:', err)
        // Don't block the app if followed matches fail to load
      })  
  }, [fid]) // Re-run when FID changes

  const handleOnboardingComplete = (preferences: any) => {
    setUserPreferences(preferences)
    setOnboardingComplete(true)
    setCurrentPage("home")
  }

  const handleSkipOnboarding = () => {
    setOnboardingComplete(true)
    setCurrentPage("home")
  }

  const handleFollowMatch = async (matchId: string) => {
    // If already followed, we'll unfollow (this is handled in the FollowedMatchesPage component)
    if (followedMatches.includes(matchId)) {
      setFollowedMatches((prev) => prev.filter((id) => id !== matchId))
      return
    }
    
    // Check if user is authenticated
    if (!fid) {
      console.error('User not authenticated')
      setCurrentPage("login")
      return
    }
    
    try {
      // Call the API to follow the match
      const response = await fetch(getApiUrl(API_ENDPOINTS.follow), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId,
          fid, // Use the authenticated FID
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to follow match: ${response.statusText}`)
      }

      // Update local state
      setFollowedMatches((prev) => [...prev, matchId])
    } catch (err) {
      console.error('Error following match:', err)
      // We could show an error toast here
    }
  }

  const handleShareMatch = (match: any) => {
    setSelectedMatch(match)
    setShareModalOpen(true)
  }

  const handleLogin = async () => {
    try {
      // Retry Farcaster authentication
      await sdk.actions.ready()
      const farcasterFid = await getFarcasterFid()
      
      if (farcasterFid) {
        setFid(farcasterFid)
        setAuthError(null)
        setCurrentPage("onboarding")
      } else {
        setAuthError("Authentication failed. Please try again.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setAuthError("Failed to authenticate with Farcaster")
    }
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        {currentPage === "splash" && <SplashScreen />}

        {currentPage === "login" && (
          <LoginPage onLogin={handleLogin} />
        )}

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
