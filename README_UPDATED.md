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

2. Realtime updates incorrectly scoped or not updating UI
   - Fix: Subscribe with `filter: 'user_id=eq.<id>'` and refresh list on events; ensure subscription cleanup in `useEffect`.

3. Delete operation removing other users' bookmarks
   - Fix: Add `.eq('user_id', session.user.id)` to delete queries and enforce RLS in DB.

4. Layout overflow from long URLs
   - Fix: Use `break-words` / `break-all`, add responsive container, and card styles in `src/app/bookmarks/page.tsx`.

5. Global text color
   - Request: All text should be dark black.
   - Fix: Set `--foreground: #000000` in `src/app/globals.css`.

6. Security: Supabase keys visible
   - Action: Added `.gitignore` rules for `.env.local` and common Supabase secret files. If secrets were committed, rotate keys and purge history.

## Deployment (Vercel)

1. Push code to a **public** GitHub repo (ensure `.gitignore` prevents secrets).
2. Import repo in Vercel and add environment variables in the Project Settings.
3. Deploy. Vercel will build and provide a live URL.

## Next steps I can help with

- Push repository to GitHub and create a Vercel deployment.
- Purge secrets from git history if any were committed and rotate keys.
- Add screenshots or exact SQL for the table.

If you want me to do any of the above, tell me which step to take next.
