"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface StatusPanelProps {
  detectionEnabled: boolean
  lastShakeTime: Date | null
  intensityScore: number | null
}

export default function StatusPanel({ detectionEnabled, lastShakeTime, intensityScore }: StatusPanelProps) {
  return (
    <Card className="mb-6 border-2 border-gray-200">
      <CardHeader className="bg-gray-100">
        <CardTitle className="text-xl">System Status</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">Detection Status</span>
            <div className="mt-1">
              {detectionEnabled ? (
                <Badge variant="default" className="bg-green-600">
                  ON
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-600 border-red-600">
                  OFF
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">Last Shake Time</span>
            <span className="mt-1 font-mono">
              {lastShakeTime ? lastShakeTime.toLocaleTimeString() : "No shakes detected"}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">Intensity Score</span>
            <div className="mt-1 flex items-center">
              {intensityScore !== null ? (
                <>
                  <span className="font-bold mr-2">{intensityScore}</span>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${intensityScore}%` }}></div>
                  </div>
                </>
              ) : (
                "N/A"
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
