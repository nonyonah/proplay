"use client"

import { useEffect, useState } from "react"
import { sdk } from "@farcaster/miniapp-sdk"
import { Card, CardContent } from "@/components/ui/card"
import { Gamepad2 } from "lucide-react"

interface SplashScreenProps {
  onReady: () => void
}

export function SplashScreen({ onReady }: SplashScreenProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Tell the Farcaster client we're ready to display content
        await sdk.actions.ready()
        
        // Add a small delay for better UX
        setTimeout(() => {
          setIsLoading(false)
          onReady()
        }, 1500)
      } catch (error) {
        console.error("Error initializing Farcaster SDK:", error)
        // Still proceed even if there's an error
        setTimeout(() => {
          setIsLoading(false)
          onReady()
        }, 1500)
      }
    }
    
    initializeApp()
  }, [onReady])
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-600 to-indigo-700">
      <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-xl border-0">
        <CardContent className="p-8 space-y-6">
          {/* App Logo */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 rounded-full bg-purple-100">
              <Gamepad2 className="w-16 h-16 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Pro Play
            </h1>
          </div>

          {/* App Description */}
          <div className="text-center space-y-3">
            <p className="text-lg text-gray-700">
              Your Ultimate Esports Companion
            </p>
            <p className="text-sm text-gray-600">
              Live scores • Match predictions • Prize pools
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <FeatureCard
              title="Live Matches"
              description="Real-time updates from your favorite games"
            />
            <FeatureCard
              title="Predictions"
              description="Stake & earn from your game knowledge"
            />
            <FeatureCard
              title="Prize Pools"
              description="Win rewards from prediction pools"
            />
            <FeatureCard
              title="Notifications"
              description="Never miss an important match"
            />
          </div>

          {/* Footer */}
          <div className="text-center pt-6">
            <p className="text-sm text-gray-500">
              Powered by Base & Farcaster
            </p>
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-center justify-center mt-4">
                <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                <span className="ml-2 text-sm text-purple-600">Connecting...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-purple-100">
      <h3 className="font-semibold text-purple-700">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}
