"use client"

import { useEffect, useState } from "react"
import SplashScreen from "@/components/splash-screen"
import ShakeDetector from "@/components/shake-detector"
import StatusPanel from "@/components/status-panel"
import MapSection from "@/components/map-section"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, BellOff } from "lucide-react"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)
  const [detectionEnabled, setDetectionEnabled] = useState(true)
  const [lastShakeTime, setLastShakeTime] = useState<Date | null>(null)
  const [intensityScore, setIntensityScore] = useState<number | null>(null)
  const [shakeDetected, setShakeDetected] = useState(false)

  useEffect(() => {
    // Auto-transition splash screen after 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleShakeDetected = (intensity: number) => {
    setShakeDetected(true)
    setLastShakeTime(new Date())
    setIntensityScore(intensity)

    // 🔊 Play alert sound
    const audio = new Audio("/sound.mp3") // Make sure sound.mp3 is in the /public folder
    audio.play().catch((e) => {
      console.warn("Audio play failed or was blocked:", e)
    })

    // Reset shake alert after 5 seconds
    setTimeout(() => {
      setShakeDetected(false)
    }, 5000)
  }

  if (showSplash) {
    return <SplashScreen />
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="bg-red-600 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Shake Alert Web</h1>
          <div className="flex items-center gap-2">
            {detectionEnabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
            <Switch checked={detectionEnabled} onCheckedChange={setDetectionEnabled} id="detection-toggle" />
            <Label htmlFor="detection-toggle" className="sr-only">
              Toggle Shake Detection
            </Label>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto p-4">
        {/* Shake detector */}
        {detectionEnabled && <ShakeDetector onShakeDetected={handleShakeDetected} />}

        {/* Shake alert */}
        {shakeDetected && (
          <div className="bg-red-600 text-white p-6 rounded-lg mb-6 animate-pulse shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-center">Shake Detected! Stay Safe!</h2>
          </div>
        )}

        {/* Status panel */}
        <StatusPanel
          detectionEnabled={detectionEnabled}
          lastShakeTime={lastShakeTime}
          intensityScore={intensityScore}
        />

        {/* Map section */}
        <MapSection />
      </div>

      {/* Footer */}
      <footer className="bg-black text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} Shake Alert Web - Earthquake Early Detection System</p>
        </div>
      </footer>
    </main>
  )
}
