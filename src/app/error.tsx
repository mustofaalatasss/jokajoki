"use client"
import * as React from "react"
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div style={{ padding: 20, backgroundColor: 'red', color: 'white', fontFamily: 'monospace' }}>
      <h2>FATAL ERROR! FOTOKAN INI KE SAYA:</h2>
      <p>{error.message}</p>
      <pre>{error.stack}</pre>
    </div>
  )
}
