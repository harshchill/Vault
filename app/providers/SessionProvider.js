"use client"
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

import React from 'react'

const SessionProvider = ({children}) => {
  return (
    <NextAuthSessionProvider>
      {children}
    </NextAuthSessionProvider>
  )
}

export default SessionProvider
