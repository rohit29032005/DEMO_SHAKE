"use client"

import Image from "next/image"

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50">
      <div className="w-32 h-32 relative mb-6 animate-pulse">
        <Image
          src="/logo.jpg?height=128&width=128"
          alt="Shake Alert Logo"
          width={128}
          height={128}
          className="object-contain"
          priority
        />
      </div>
      <h1 className="text-4xl font-bold tracking-tight">Shake Alert Web</h1>
      <p className="mt-2 text-red-500">Earthquake Early Detection</p>
    </div>
  )
}
