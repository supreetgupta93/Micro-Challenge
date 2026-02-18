# Smart Bookmark

This is a small Next.js (App Router) project using Supabase (Auth, Database, Realtime) and Tailwind for styling.

---

## Quick start (run locally)

1. Install dependencies:

```bash
cd smart-bookmark
npm install
```

2. Create `.env.local` at the project root with your Supabase values (example below).

3. Start the development server:

```bash
npm run dev
```

4. Open http://localhost:3000

## Required environment variables (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

Do NOT commit `.env.local` to the repository. See `.gitignore`.

## Database / Supabase notes

- Create a `bookmarks` table with at least: `id`, `title`, `url`, `user_id`, `created_at`.
- Enable Row Level Security and add a policy so users only access their rows. Example SQL:

```sql
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can manage their bookmarks" ON public.bookmarks
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

## Features implemented

- Google OAuth login (Supabase)
- Add bookmark (title + URL)
- Bookmarks are private per user (filtered by `user_id` and RLS recommended)
- Real-time updates via Supabase Realtime (two-tab test)
- Delete your own bookmarks (delete query includes `user_id` guard)

## Challenges faced during assignment

### 1. **Real-Time Synchronization Across Multiple Tabs (MAJOR)**
   - Challenge: Making bookmarks appear instantly in one tab when added/deleted in another without page refresh
   - Complexity: Requires understanding of Supabase Realtime, subscriptions, and event-driven updates
   - Solution: Implemented dual approach with Supabase realtime `postgres_changes` + polling fallback every 2 seconds
   - Learning: Understanding WebSocket subscriptions, event lifecycle, cleanup requirements

### 2. **User Data Privacy & Security**
   - Challenge: Ensuring User A cannot see User B's bookmarks
   - Complexity: Required Row Level Security (RLS) on Supabase + filtering queries by `user_id`
   - Solution: Added `user_id` filters on all queries + documented Supabase RLS policies
   - Learning: Importance of backend security and access control

### 3. **Environment Variables Not Loading**
   - Challenge: Supabase credentials weren't being picked up by Next.js at runtime
   - Complexity: Debugging Next.js build caching and environment variable loading
   - Solution: Delete `.next` folder, verify `.env.local` location, add fallback values
   - Learning: Frontend framework build processes and environment variable handling

### 4. **OAuth Redirect URL Configuration**
   - Challenge: Google login was redirecting to localhost instead of live URL
   - Complexity: Supabase OAuth security requires whitelisting redirect URLs
   - Solution: Added Vercel URL to Supabase authentication redirect URLs
   - Learning: OAuth flow security, third-party integration configuration

### 5. **Layout & Text Overflow Issues**
   - Challenge: Long URLs breaking card layout, text overflowing containers
   - Complexity: CSS responsive design with Tailwind
   - Solution: Used `break-words`, `break-all`, responsive padding, max-width constraints
   - Learning: Modern CSS techniques for text wrapping and responsive design

### 6. **Performance: Avoiding Memory Leaks**
   - Challenge: Subscriptions and intervals must be cleaned up properly
   - Complexity: Understanding React useEffect cleanup and component lifecycle
   - Solution: Implemented `isMounted` flag, proper cleanup in useEffect return
   - Learning: Memory management in React, preventing state updates after unmount

### 7. **Git & Deployment Pipeline**
   - Challenge: Pushing code to GitHub and automatic deployment on Vercel
   - Complexity: Understanding git workflows, webhook triggers, CI/CD
   - Solution: Used `git add`, `git commit`, `git push`, configured GitHub + Vercel
   - Learning: Modern deployment workflows and automation

### 8. **Styling for Professional UX**
   - Challenge: Converting basic login form to realistic, professional card design
   - Complexity: Tailwind CSS flexbox, shadows, gradients, hover states
   - Solution: Designed Google OAuth card with gradient background, proper spacing
   - Learning: Modern web design principles and Tailwind best practices

---

## Key Learnings from This Assignment

✅ Full-stack authentication (Supabase OAuth)  
✅ Real-time database updates and subscriptions  
✅ Row-level security and data privacy  
✅ Responsive UI design with Tailwind CSS  
✅ Modern deployment pipeline (GitHub → Vercel)  
✅ Debugging environment and build issues  
✅ React hooks best practices (useEffect cleanup)  
✅ Third-party service integration  

---

## Problems encountered & how I solved them

1. Environment variables not loaded
   - Symptom: Error stating Supabase URL missing.
   - Fix: Stop dev server, delete `.next` directory and restart (`npm run dev`). Verified `.env.local` in project root.

2. **Realtime updates not reflecting in two tabs (MAJOR)**
   - Symptom: Add/delete bookmark in tab 1 → no update in tab 2 without page refresh.
   - Root cause: Supabase realtime subscription using `postgres_changes` events may not work if Realtime isn't enabled on the table or takes time to propagate.
   - Fix applied:
     - Implemented Supabase realtime subscription with `INSERT`, `UPDATE`, `DELETE` event listeners
     - **Added polling fallback**: Refetch bookmarks every 2 seconds to catch updates from other tabs
     - Combined approach: Realtime events + polling ensures updates appear instantly OR within 2 seconds
     - Separated event listeners instead of wildcard for better reliability
     - Added `isMounted` flag and `currentUserId` to prevent race conditions and memory leaks
     - Proper cleanup of both subscription channel and polling interval on unmount
   - Result: Real-time updates now work across two tabs reliably ✅
   - Note: If you enable Realtime on the Supabase table, updates will be instant. Polling is a fallback.

3. Delete operation removing other users' bookmarks
   - Symptom: Delete action removed bookmarks regardless of owner (or appeared to).
   - Fix: Send `.eq('user_id', session.user.id)` in the delete query to ensure only the owner can delete. Also rely on RLS on the DB for safety.

4. Layout overflow from long URLs
   - Symptom: Long URLs overflowed the bookmark card, breaking layout.
   - Fix: Updated CSS in `src/app/bookmarks/page.tsx` cards to use `break-words` / `break-all`, constrained container widths, and added consistent padding and rounded cards.

5. Global text color
   - Request: Make all text appear dark black.
   - Fix: Set `--foreground: #000000` in `src/app/globals.css`.

6. Security: Supabase keys accidentally visible
   - Action: Added `.gitignore` rules for `.env.local` and common Supabase secret/service_role files. If secrets were committed, rotate keys and purge history.

## Deployment (Vercel)

1. Push code to a **public** GitHub repo (ensure `.gitignore` prevents secrets).
2. Import repo in Vercel and add environment variables in the Project Settings.
3. Deploy. Vercel will build and provide a live URL.

## Next steps I can help with

- Push repository to GitHub and create a Vercel deployment.
- Purge secrets from git history if any were committed and rotate keys.
- Add screenshots or exact SQL for the table.

If you want me to do any of the above, tell me which step to take next.
