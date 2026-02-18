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

## Problems encountered & how I solved them

1. Environment variables not loaded
   - Symptom: Error stating Supabase URL missing.
   - Fix: Stop dev server, delete `.next` directory and restart (`npm run dev`). Verified `.env.local` in project root.

2. **Realtime updates not reflecting in two tabs (MAJOR)**
   - Symptom: Add/delete bookmark in tab 1 → no update in tab 2 without page refresh.
   - Root cause: Supabase realtime subscription was using wildcard event `'*'` which was unreliable. Subscription callback wasn't being triggered consistently.
   - Fix applied:
     - Separated event listeners for `INSERT`, `UPDATE`, and `DELETE` instead of wildcard `'*'`
     - Added `isMounted` flag to prevent race conditions and state updates after unmount
     - Added console logging to debug subscription status
     - Added subscription status callback to monitor connection
     - Ensured proper cleanup with `supabase.removeChannel(channel)` on unmount
     - Made channel name unique per user: `bookmarks-${session.user.id}`
   - Result: Real-time updates now work instantly across two tabs ✅

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
