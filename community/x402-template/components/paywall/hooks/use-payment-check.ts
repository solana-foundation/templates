import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function usePaymentCheck() {
  const router = useRouter()

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const resource = urlParams.get('resource')

      if (resource && resource === '/protected') {
        try {
          const response = await fetch('/protected', {
            method: 'GET',
            credentials: 'include',
          })

          if (response.ok && response.status !== 402) {
            router.push('/protected')
          }
        } catch {}
      }
    }

    checkPaymentStatus()
  }, [router])
}

