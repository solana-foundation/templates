'use client'

import localFont from 'next/font/local'
import TextGlitch from '@/components/text-glitch'

const font2 = localFont({
  src: '../../public/FKRasterGroteskCompact-Rounded.woff2',
  weight: '100',
})

const font3 = localFont({
  src: '../../public/caryotype-bold.woff2',
  weight: '100',
})

export default function HeroText() {
  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col w-full">
        <h1 className="font-thin tracking-tight leading-none">
          <TextGlitch>
            <span
              className={`block w-full text-[11vw] md:text-[11vw] lg:text-[11vw] whitespace-nowrap overflow-hidden text-neutral-100 blur-[0.7px] md:blur-[1.5px] md:tracking-wide ${font2.className}`}
            >
              High Quality Web3
            </span>
          </TextGlitch>

          <span
            className={`block w-full text-[10vw] md:text-[10vw] lg:text-[10.3vw] whitespace-nowrap overflow-hidden`}
          >
            <TextGlitch>
              <span className={`${font2.className} blur-[0.7px] md:blur-[1.5px] md:tracking-wide`}>Clothing</span>{' '}
            </TextGlitch>
            <span className={`${font3.className} font-black text-[13vw] ml-4`}>For high</span>
          </span>
          <span className={`flex w-full text-[10vw] whitespace-nowrap font-black ${font3.className}`}>
            quality web3{' '}
            <span className="flex ml-[1.5vw] md:ml-[1vw]">
              <img src="/b.svg" className="w-[8vw] h-[10vw] -mr-1 md:-mr-[2vw]" />
              <span className="mr-2">uilders</span>
            </span>
          </span>
        </h1>
      </div>
    </div>
  )
}
