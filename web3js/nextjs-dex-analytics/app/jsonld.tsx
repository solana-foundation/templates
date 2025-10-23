/**
 * JSON-LD structured data for enhanced SEO
 */
export function JsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Solana DEX Analytics Template',
    description: 'Open-source Solana DEX analytics template for SPL token analytics and routing.',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1000',
    },
    provider: {
      '@type': 'Organization',
      name: 'Solana DEX Analytics Template',
      url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
