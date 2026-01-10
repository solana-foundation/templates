'use client'

import type React from 'react'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ProductImage } from '@/store/types'

interface ProductGalleryProps {
  productName: string
  selectedColor: string | null
  productImage: ProductImage | undefined
  defaultImage: string
  currentView: 'front' | 'back'
  setCurrentView: (view: 'front' | 'back') => void
}

export function ProductGallery({
  productName,
  selectedColor,
  productImage,
  defaultImage,
  currentView,
  setCurrentView,
}: ProductGalleryProps) {
  const [showZoom, setShowZoom] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const hasBackImage = productImage?.back

  const getImage = () => {
    if (!productImage) return defaultImage || null
    const image = currentView === 'front' ? productImage.front : productImage.back || productImage.front
    return image || null
  }

  const getHighResImage = () => {
    if (!productImage) return defaultImage || null
    if (currentView === 'front') {
      return productImage.frontHighRes || productImage.front || null
    }
    return productImage.backHighRes || productImage.back || productImage.front || null
  }

  const toggleView = () => {
    if (hasBackImage) {
      setCurrentView(currentView === 'front' ? 'back' : 'front')
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return

    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect()

    const x = Math.max(0, Math.min(1, (e.clientX - left) / width))
    const y = Math.max(0, Math.min(1, (e.clientY - top) / height))

    setZoomPosition({ x, y })
    setShowZoom(true)
  }

  const handleMouseLeave = () => {
    setShowZoom(false)
  }

  return (
    <div className="relative text-foreground">
      <div
        ref={imageContainerRef}
        className="aspect-square bg-foreground/10 relative rounded-lg overflow-hidden cursor-zoom-in group"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={getImage() || '/placeholder.svg?height=500&width=500'}
          alt={`${productName} ${selectedColor || ''} ${currentView}`}
          fill
          className="object-contain transition-opacity duration-300 rounded-lg"
        />

        {showZoom && (
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-zinc-800 z-10"
            style={{
              backgroundImage: `url(${getHighResImage() || '/placeholder.svg?height=1000&width=1000'})`,
              backgroundPosition: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`,
              backgroundSize: '200%',
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}
      </div>

      {hasBackImage && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className={`rounded-full px-3 py-1 ${
              currentView === 'front' ? 'bg-primary text-primary-foreground' : 'bg-secondary/80'
            }`}
            onClick={() => setCurrentView('front')}
          >
            Front
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className={`rounded-full px-3 py-1 ${
              currentView === 'back' ? 'bg-primary text-primary-foreground' : 'bg-secondary/80'
            }`}
            onClick={() => setCurrentView('back')}
          >
            Back
          </Button>
        </div>
      )}

      {hasBackImage && (
        <div className="absolute inset-y-0 left-0 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80 p-0 cursor-pointer"
            onClick={toggleView}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
        </div>
      )}

      {hasBackImage && (
        <div className="absolute inset-y-0 right-0 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80 p-0 cursor-pointer"
            onClick={toggleView}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      )}

      {hasBackImage && (
        <div className="absolute top-2 right-2 text-xs font-medium bg-background/80 px-2 py-1 rounded">
          {currentView === 'front' ? 'Front' : 'Back'}
        </div>
      )}
    </div>
  )
}
