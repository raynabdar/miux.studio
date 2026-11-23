'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type {
  ActiveDiscount,
  PublicContent,
} from '@/lib/cms/queries'

const CmsContext = createContext<PublicContent | null>(null)

export default function CmsProvider({
  value,
  children,
}: {
  value: PublicContent
  children: ReactNode
}) {
  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}

export function useCms(): PublicContent {
  const value = useContext(CmsContext)
  if (!value) throw new Error('useCms must be used inside CmsProvider')
  return value
}

export type { ActiveDiscount }
