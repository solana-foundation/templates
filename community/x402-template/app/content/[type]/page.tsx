import { CatsComponent } from '@/components/cats-component'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const CONTENT_CONFIG = {
  cheap: {
    price: '0.01',
    title: 'Budget Content',
    message: 'This is what you get when you pay for cheap content: angry, starving, and sad cats. 😿',
  },
  expensive: {
    price: '0.25',
    title: 'Premium Content',
    message: 'You deserve the best! Here are some happy, wealthy cats living their best lives. 🐱💰✨',
  },
} as const

type ContentType = keyof typeof CONTENT_CONFIG

export default async function ContentPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params

  if (!['cheap', 'expensive'].includes(type)) {
    notFound()
  }

  const contentType = type as ContentType
  const config = CONTENT_CONFIG[contentType]

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#14F195] to-[#9945FF] font-sans">
      <main className="flex w-full max-w-2xl flex-col items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
          <div className="bg-gradient-to-br from-purple-50 to-green-50 rounded-xl p-8 mb-8 border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔓 Exclusive Content Unlocked</h2>
            <p className="text-gray-700 leading-relaxed mb-6 font-medium">
              {config.message} You paid {config.price}!
            </p>
            <CatsComponent contentType={contentType} />
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-neutral-800 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
