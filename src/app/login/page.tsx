'use client'
import { supabase } from '@/lib/supabaseClient'

export default function Login() {
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/bookmarks`
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 bg-black text-white rounded-full flex items-center justify-center font-bold">
            SB
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-black text-center mb-1">Welcome back</h1>
        <p className="text-sm text-gray-700 text-center mb-6">Sign in with Google to manage your private bookmarks.</p>

        <button
          onClick={login}
          className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:shadow-md transition"
        >
          <svg className="h-5 w-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.3H272v95.2h147.1c-6.4 34.9-26 64.4-55.6 84.2l89.8 69.7c52.3-48.2 82.2-119.4 82.2-198.8z"/>
            <path fill="#34A853" d="M272 544.3c73.6 0 135.4-24.4 180.6-66.3l-89.8-69.7c-25 17-57 27-90.8 27-69.8 0-129-47.1-150-110.3l-92.1 71.2C76.3 490 167.6 544.3 272 544.3z"/>
            <path fill="#FBBC05" d="M122 326.9c-10.9-32.3-10.9-67.3 0-99.6L29.9 156.1C10.8 192.6 0 232.6 0 272s10.8 79.4 29.9 115.9l92.1-71z"/>
            <path fill="#EA4335" d="M272 107.7c39.9 0 75.7 13.7 103.9 40.6l78-78C407.4 24.1 344.5 0 272 0 167.6 0 76.3 54.3 29.9 135.9l92.1 71.2c21-63.2 80.2-110.3 150-110.3z"/>
          </svg>

          <span className="text-black font-medium">Continue with Google</span>
        </button>

        <div className="mt-6 text-center text-xs text-gray-500">
          By continuing you agree to the project requirements.
        </div>
      </div>
    </div>
  )
}
