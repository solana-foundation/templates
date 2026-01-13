import BouncingImage from '@/components/bouncing-image'
import HeroText from '@/components/hero-text'
import { Marquee } from '@/components/marquee'
import { ProductGrid } from '@/store/components/product-grid'
import { products } from '@/store/data'

export default function Home() {
  return (
    <div className="w-full space-y-4">
      <section className="relative w-full overflow-visible text-neutral-100 uppercase px-1">
        <BouncingImage
          src="/abstract-element-48.png"
          className="absolute w-[10vw] h-[10vw] left-[10vw] top-[5vw] md:left-[20vw] z-20"
          width={120}
          height={120}
        />
        <BouncingImage
          src="/abstract-element-32.png"
          className="absolute w-[10vw] h-[10vw] right-[10vw] top-[25vw] md:right-[20vw] md:top-[12vw] z-20"
          animate={{ y: [0, 15, 0] }}
          duration={5}
          width={100}
          height={100}
        />
        <HeroText />
      </section>

      <Marquee />

      <div className="container mx-auto px-4">
        <section className="flex flex-col items-center my-12 gap-10 w-full">
          <ProductGrid products={products} />
        </section>
      </div>
    </div>
  )
}
