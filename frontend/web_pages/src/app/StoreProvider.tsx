'use client'

import { useRef } from 'react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { makeStore, AppStore } from '@/redux/store'

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore>(undefined)
  const queryClientRef = useRef<QueryClient | null>(null)

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  if (!queryClientRef.current) {
    // Create a singleton QueryClient per app session
    queryClientRef.current = new QueryClient()
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <Provider store={storeRef.current}>{children}</Provider>
    </QueryClientProvider>
  )
}