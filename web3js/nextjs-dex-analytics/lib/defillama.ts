'use server'

interface LlamaPricePoint {
  timestamp: number
  price: number
  confidence: number
}

interface LlamaCoinEntry {
  symbol: string
  prices: LlamaPricePoint[]
}

interface LlamaBatchResponse {
  coins: Record<string, LlamaCoinEntry>
}

export interface NormalizedTrendingToken {
  symbol: string
  currentPrice: number
  change24h: number
  prices: { timestamp: number; price: number }[]
}

const COINGECKO_IDS: string[] = [
  'coingecko:solana',
  'coingecko:orca',
  'coingecko:raydium',
  'coingecko:jupiter-exchange-solana',
  'coingecko:pump-fun',
]

function generateHourlyTimestamps(hours: number): number[] {
  const clamped = Number.isFinite(hours) && hours > 1 ? Math.floor(hours) : 24
  const stepHours = clamped > 72 ? 6 : 1
  const now = Math.floor(Date.now() / 1000)
  const timestamps: number[] = []
  for (let i = clamped; i >= 0; i -= stepHours) {
    timestamps.push(now - i * 3600)
  }
  if (timestamps[timestamps.length - 1] !== now) {
    timestamps.push(now)
  }
  return timestamps
}

export async function fetchTrendingTokensData(hours: number): Promise<NormalizedTrendingToken[]> {
  const timestamps = generateHourlyTimestamps(hours)
  const coinsParam = encodeURIComponent(JSON.stringify(Object.fromEntries(COINGECKO_IDS.map((id) => [id, timestamps]))))
  const url = `https://coins.llama.fi/batchHistorical?coins=${coinsParam}&searchWidth=2400`
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) {
    throw new Error(`DeFi Llama request failed with status ${res.status}`)
  }
  const data: LlamaBatchResponse = await res.json()
  const entries = Object.values(data.coins)
  return entries.map((entry) => {
    const sorted = [...entry.prices].sort((a, b) => a.timestamp - b.timestamp)
    const first = sorted[0]?.price ?? 0
    const last = sorted[sorted.length - 1]?.price ?? 0
    const changePct = first > 0 ? ((last - first) / first) * 100 : 0
    return {
      symbol: entry.symbol,
      currentPrice: last,
      change24h: changePct,
      prices: sorted.map((p) => ({ timestamp: p.timestamp, price: p.price })),
    }
  })
}

// EXAMPLE RETURNED DATA THIS IS EXACTLY THE FORMAT WE WILL RECEIVE FROM THE ABOVE FETCH REQUEST
/*
{
  "coins": {
    "coingecko:solana": {
      "symbol": "SOL",
        "prices": [
          {
            "timestamp": 1760468765,
            "price": 201.93961456349797,
            "confidence": 0.99
          },
          {
            "timestamp": 1760472358,
            "price": 199.40030997214248,
            "confidence": 0.99
          },
          {
            "timestamp": 1760475954,
            "price": 200.47044167229342,
            "confidence": 0.99
          },
          {
            "timestamp": 1760479554,
            "price": 201.74294878093653,
            "confidence": 0.99
          },
          {
            "timestamp": 1760483163,
            "price": 201.99216609385152,
            "confidence": 0.99
          },
          {
            "timestamp": 1760486764,
            "price": 202.8823002736927,
            "confidence": 0.99
          },
          {
            "timestamp": 1760490363,
            "price": 203.06165251681944,
            "confidence": 0.99
          },
          {
            "timestamp": 1760493955,
            "price": 203.62493658403926,
            "confidence": 0.99
          },
          {
            "timestamp": 1760501159,
            "price": 201.34925106068044,
            "confidence": 0.99
          },
          {
            "timestamp": 1760497555,
            "price": 203.28813213952205,
            "confidence": 0.99
          },
          {
            "timestamp": 1760504742,
            "price": 203.69155897663268,
            "confidence": 0.99
          },
          {
            "timestamp": 1760508363,
            "price": 204.9244376541187,
            "confidence": 0.99
          }
        ]
    },
    "coingecko:orca": {
      "symbol": "ORCA",
        "prices": [
          {
            "timestamp": 1760471993,
            "price": 1.7109376645943182,
            "confidence": 0.99
          },
          {
            "timestamp": 1760468403,
            "price": 1.7180109048571963,
            "confidence": 0.99
          },
          {
            "timestamp": 1760479207,
            "price": 1.7137933080555094,
            "confidence": 0.99
          },
          {
            "timestamp": 1760475594,
            "price": 1.7187321896962462,
            "confidence": 0.99
          },
          {
            "timestamp": 1760482801,
            "price": 1.7099827488186763,
            "confidence": 0.99
          },
          {
            "timestamp": 1760486399,
            "price": 1.7137125377205469,
            "confidence": 0.99
          },
          {
            "timestamp": 1760489991,
            "price": 1.7161822153351953,
            "confidence": 0.99
          },
          {
            "timestamp": 1760493605,
            "price": 1.7131519986180925,
            "confidence": 0.99
          },
          {
            "timestamp": 1760500806,
            "price": 1.69906117027593,
            "confidence": 0.99
          },
          {
            "timestamp": 1760504396,
            "price": 1.7101698289729392,
            "confidence": 0.99
          },
          {
            "timestamp": 1760508011,
            "price": 1.705545476024393,
            "confidence": 0.99
          },
          {
            "timestamp": 1760497196,
            "price": 1.7101721251614475,
            "confidence": 0.99
          }
        ]
    },
    "coingecko:raydium": {
      "symbol": "RAY",
        "prices": [
          {
            "timestamp": 1760468405,
            "price": 2.0335447515073266,
            "confidence": 0.99
          },
          {
            "timestamp": 1760471995,
            "price": 1.9980095794622812,
            "confidence": 0.99
          },
          {
            "timestamp": 1760475595,
            "price": 2.003473555172286,
            "confidence": 0.99
          },
          {
            "timestamp": 1760479195,
            "price": 2.0114192071974735,
            "confidence": 0.99
          },
          {
            "timestamp": 1760482791,
            "price": 2.003254261443196,
            "confidence": 0.99
          },
          {
            "timestamp": 1760486400,
            "price": 2.0114333360974057,
            "confidence": 0.99
          },
          {
            "timestamp": 1760489992,
            "price": 2.003098449109412,
            "confidence": 0.99
          },
          {
            "timestamp": 1760493608,
            "price": 1.9830238875094566,
            "confidence": 0.99
          },
          {
            "timestamp": 1760497197,
            "price": 1.99149297677534,
            "confidence": 0.99
          },
          {
            "timestamp": 1760500807,
            "price": 1.9664568362582042,
            "confidence": 0.99
          },
          {
            "timestamp": 1760504397,
            "price": 1.9779648324106218,
            "confidence": 0.99
          },
          {
            "timestamp": 1760508011,
            "price": 1.9776467166541252,
            "confidence": 0.99
          }
        ]
    },
    "coingecko:jupiter": {
      "symbol": "JUP",
        "prices": [
          {
            "timestamp": 1760475530,
            "price": 0.0008925888835344107,
            "confidence": 0.99
          },
          {
            "timestamp": 1760489879,
            "price": 0.000951894600267491,
            "confidence": 0.99
          },
          {
            "timestamp": 1760504332,
            "price": 0.0008461808892392098,
            "confidence": 0.99
          }
        ]
    }
  }
}
  */
