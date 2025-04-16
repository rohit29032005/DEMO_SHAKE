"use client"

import { useEffect, useState, useRef } from "react"

interface ShakeDetectorProps {
  onShakeDetected: (intensity: number) => void
  threshold?: number
  cooldownPeriod?: number
}

export default function ShakeDetector({ onShakeDetected, threshold = 15, cooldownPeriod = 2000 }: ShakeDetectorProps) {
  const [isSupported, setIsSupported] = useState(false)
  const lastShakeTime = useRef<number>(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Check if DeviceMotionEvent is supported
    if (typeof window !== "undefined" && "DeviceMotionEvent" in window) {
      setIsSupported(true)

      // Create audio element for alert sound
      audioRef.current = new Audio("/alert.mp3")

      // Request permission for iOS devices
      if (
        typeof DeviceMotionEvent !== "undefined" &&
        typeof (DeviceMotionEvent as any).requestPermission === "function"
      ) {
        // This is for iOS 13+ devices
        document.addEventListener("click", requestPermission, { once: true })
      }
    }

    return () => {
      if (
        typeof DeviceMotionEvent !== "undefined" &&
        typeof (DeviceMotionEvent as any).requestPermission === "function"
      ) {
        document.removeEventListener("click", requestPermission)
      }
    }
  }, [])

  const requestPermission = async () => {
    try {
      if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
        const permissionState = await (DeviceMotionEvent as any).requestPermission()
        if (permissionState === "granted") {
          window.addEventListener("devicemotion", handleMotion)
        }
      }
    } catch (error) {
      console.error("Error requesting motion permission:", error)
    }
  }

  useEffect(() => {
    if (isSupported) {
      // For non-iOS devices or iOS < 13
      if (
        typeof DeviceMotionEvent === "undefined" ||
        typeof (DeviceMotionEvent as any).requestPermission !== "function"
      ) {
        window.addEventListener("devicemotion", handleMotion)
      }

      return () => {
        window.removeEventListener("devicemotion", handleMotion)
      }
    }
  }, [isSupported])

  const handleMotion = (event: DeviceMotionEvent) => {
    const now = Date.now()

    // Check if we're still in cooldown period
    if (now - lastShakeTime.current < cooldownPeriod) {
      return
    }

    const acceleration = event.accelerationIncludingGravity

    if (!acceleration || acceleration.x === null || acceleration.y === null || acceleration.z === null) {
      return
    }

    const accelerationMagnitude = Math.sqrt(
      Math.pow(acceleration.x, 2) + Math.pow(acceleration.y, 2) + Math.pow(acceleration.z, 2),
    )

    // Detect shake based on acceleration magnitude
    if (accelerationMagnitude > threshold) {
      lastShakeTime.current = now

      // Play alert sound
      if (audioRef.current) {
        audioRef.current.play().catch((err) => console.error("Error playing sound:", err))
      }

      // Calculate intensity score (0-100)
      const intensity = Math.min(100, Math.round((accelerationMagnitude / threshold) * 50))

      // Trigger shake detected callback
      onShakeDetected(intensity)

      // Log shake event
      console.log(`Shake detected at ${new Date().toLocaleTimeString()} with intensity ${intensity}`)
    }
  }

  // No visible UI for this component
  return null
}
