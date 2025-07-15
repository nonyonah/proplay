"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Gamepad2 } from "lucide-react"

interface LoginPageProps {
  onLogin: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <Card className="w-full max-w-md mx-auto shadow-lg border border-gray-200 bg-white">
        <CardHeader className="text-center space-y-6 pt-8">
          <div className="flex items-center justify-center">
            <div className="p-4 rounded-full bg-purple-50">
              <Gamepad2 className="w-12 h-12 text-purple-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Esports Match Alerts</h1>
            <p className="text-gray-600 text-base leading-relaxed">
              Get match schedules and alerts for LoL, CS2, and Valorant. Sign in with Farcaster!
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
          <Button
            onClick={onLogin}
            className="w-full h-12 text-base font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 hover:scale-[1.02]"
          >
            Sign-In With Farcaster
          </Button>

          <div className="flex items-center justify-center">
            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-500">QR Code</span>
            </div>
          </div>

          <div className="text-center">
            <a href="#" className="text-sm text-purple-600 hover:text-purple-700 transition-colors">
              #EsportsHub
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
