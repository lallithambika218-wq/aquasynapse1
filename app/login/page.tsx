'use client'

import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="auth-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>
      </div>

      <div className="relative w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              card: 'bg-card border border-border rounded-2xl',
              footerActionLink: 'text-primary hover:text-primary/80',
            },
          }}
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  )
}
