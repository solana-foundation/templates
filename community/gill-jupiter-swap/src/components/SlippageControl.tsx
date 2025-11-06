'use client'

import React, { useState } from 'react'
import { Settings } from 'lucide-react'

interface SlippageControlProps {
  slippage: number
  onSlippageChange: (slippage: number) => void
}

const SlippageControl: React.FC<SlippageControlProps> = ({ slippage, onSlippageChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [customSlippage, setCustomSlippage] = useState(slippage.toString())

  const presets = [0.1, 0.5, 1.0, 2.0]

  const handlePresetClick = (preset: number) => {
    onSlippageChange(preset)
    setCustomSlippage(preset.toString())
    setIsOpen(false)
  }

  const handleCustomSlippageChange = (value: string) => {
    setCustomSlippage(value)
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 50) {
      onSlippageChange(numValue)
    }
  }

  const handleCustomSlippageSubmit = () => {
    const numValue = parseFloat(customSlippage)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 50) {
      onSlippageChange(numValue)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <Settings className="w-4 h-4 text-gray-400" />
        <span className="text-white text-sm">{slippage}%</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 min-w-[200px]">
          <div className="p-4">
            <h3 className="text-white font-medium mb-3">Slippage Tolerance</h3>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePresetClick(preset)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    slippage === preset ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-gray-400 text-sm">Custom</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={customSlippage}
                  onChange={(e) => handleCustomSlippageChange(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="0.5"
                  min="0"
                  max="50"
                  step="0.1"
                />
                <button
                  onClick={handleCustomSlippageSubmit}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Set
                </button>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-400">
              <p>Your transaction will revert if the price changes unfavorably by more than this percentage.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SlippageControl
