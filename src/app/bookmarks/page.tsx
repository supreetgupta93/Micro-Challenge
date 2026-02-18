'use client'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Bookmarks() {
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // PHASE 10: Fetch Bookmarks (Private to user)
  const fetchBookmarks = async (userId: string) => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookmarks:', error)
      return
    }

    setBookmarks(data || [])
  }

  // PHASE 11: Add Bookmark
  const addBookmark = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !title || !url) return

    const { error } = await supabase.from('bookmarks').insert({
      title,
      url,
      user_id: user.id
    })

    if (error) {
      console.error('Error adding bookmark:', error)
      return
    }

    setTitle('')
    setUrl('')
    // Refresh bookmarks after adding
    await fetchBookmarks(user.id)
  }

  // PHASE 12: Delete Bookmark
  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only delete their own

    if (error) {
      console.error('Error deleting bookmark:', error)
      return
    }

    // Refresh bookmarks after deletion
    await fetchBookmarks(user.id)
  }

  // PHASE 13: Supabase Realtime Subscription
  useEffect(() => {
    let channel: any = null
    let isMounted = true

    const checkAuth = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      if (!isMounted) return

      setUser(session.user)
      await fetchBookmarks(session.user.id)

      // Realtime subscription - listen to changes on bookmarks table
      channel = supabase
        .channel(`bookmarks-${session.user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${session.user.id}`
          },
          async (payload) => {
            console.log('New bookmark inserted:', payload)
            if (isMounted) {
              await fetchBookmarks(session.user.id)
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${session.user.id}`
          },
          async (payload) => {
            console.log('Bookmark updated:', payload)
            if (isMounted) {
              await fetchBookmarks(session.user.id)
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${session.user.id}`
          },
          async (payload) => {
            console.log('Bookmark deleted:', payload)
            if (isMounted) {
              await fetchBookmarks(session.user.id)
            }
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status)
        })

      if (isMounted) {
        setLoading(false)
      }
    }

    checkAuth()

    // Cleanup subscription on unmount
    return () => {
      isMounted = false
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [router])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Bookmarks</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* PHASE 7: Add Bookmark Form */}
        <form onSubmit={addBookmark} className="mb-8 border border-gray-300 p-6 rounded-lg bg-white shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                placeholder="Bookmark title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
            >
              Add Bookmark
            </button>
          </div>
        </form>

        {/* Display Bookmarks */}
        <div className="space-y-4">
          {bookmarks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500 text-lg">No bookmarks yet</p>
              <p className="text-gray-400 text-sm">Add your first bookmark above</p>
            </div>
          ) : (
            bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg mb-1 break-words">{bookmark.title}</h3>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-sm break-all hover:underline"
                    >
                      {bookmark.url}
                    </a>
                  </div>
                  <button
                    onClick={() => deleteBookmark(bookmark.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex-shrink-0"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
