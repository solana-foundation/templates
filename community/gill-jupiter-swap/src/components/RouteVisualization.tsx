'use client'

import React from 'react'
import { ChevronRight, ChevronDown, AlertTriangle, Info } from 'lucide-react'
import { RoutePlan, Token } from '../types'

interface RouteVisualizationProps {
  routePlan: RoutePlan[]
  fromToken: Token | null
  toToken: Token | null
  priceImpact: number
  isVisible: boolean
  onToggle: () => void
}

const RouteVisualization: React.FC<RouteVisualizationProps> = ({
  routePlan,
  fromToken,
  toToken,
  priceImpact,
  isVisible,
  onToggle
}) => {
  const getPriceImpactColor = (impact: number) => {
    if (impact < 1) return 'text-green-400'
    if (impact < 3) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getPriceImpactIcon = (impact: number) => {
    if (impact >= 3) return <AlertTriangle className="w-4 h-4" />
    return <Info className="w-4 h-4" />
  }

  return (
    <div className="card">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">Route Details</span>
          <span className="text-gray-400 text-sm">
            {routePlan.length} hop{routePlan.length > 1 ? 's' : ''}
          </span>
        </div>
        {isVisible ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {isVisible && (
        <div className="mt-3 space-y-3">
          {/* Price Impact */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getPriceImpactIcon(priceImpact)}
              <span className="text-gray-300 text-sm">Price Impact</span>
            </div>
            <span className={`font-medium ${getPriceImpactColor(priceImpact)}`}>
              {priceImpact.toFixed(2)}%
            </span>
          </div>

          {/* Route Path */}
          <div className="space-y-2">
            <span className="text-gray-300 text-sm">Route</span>
            <div className="flex items-center gap-2 flex-wrap">
              {fromToken && (
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded-lg">
                  {fromToken.logoURI && (
                    <img
                      src={fromToken.logoURI}
                      alt={fromToken.symbol}
                      className="w-4 h-4 rounded-full"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}
                  <span className="text-white text-xs">{fromToken.symbol}</span>
                </div>
              )}

              {routePlan.map((route, index) => (
                <React.Fragment key={index}>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded-lg">
                    <span className="text-white text-xs">{route.swapInfo.label}</span>
                  </div>
                </React.Fragment>
              ))}

              {toToken && (
                <>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded-lg">
                    {toToken.logoURI && (
                      <img
                        src={toToken.logoURI}
                        alt={toToken.symbol}
                        className="w-4 h-4 rounded-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                    <span className="text-white text-xs">{toToken.symbol}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Route Details */}
          {routePlan.length > 0 && (
            <div className="space-y-2">
              <span className="text-gray-300 text-sm">Swap Details</span>
              <div className="space-y-1">
                {routePlan.map((route, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">
                      {route.swapInfo.label} ({route.percent.toFixed(1)}%)
                    </span>
                    <span className="text-gray-300">
                      {route.swapInfo.feeAmount && parseFloat(route.swapInfo.feeAmount) > 0
                        ? `${(parseFloat(route.swapInfo.feeAmount) / Math.pow(10, 6)).toFixed(4)} SOL`
                        : 'No fee'
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning for high price impact */}
          {priceImpact >= 3 && (
            <div className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-200 text-xs">
                  High price impact! Consider splitting your trade into smaller amounts.
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default RouteVisualization
