# Project TODO

- [x] Basic homepage layout
- [x] Navigation menu
- [x] Discovery feed page
- [x] Brand kit page
- [x] Live session page
- [x] User authentication system (signup/login/logout)
- [x] Profile onboarding flow
- [x] Profile completion enforcement
- [x] Producer dashboard with AppLayout
- [x] Room creation flow with database schema
- [x] SEO meta tags and Open Graph tags
- [x] Replace all yellow #E8FF47 with DIMI Green #2EE62E
- [x] Update Twitter footer link to https://x.com/_gwapspot?s=21
- [x] Create Rights Workspace page at /rights
- [x] Create Investor Brief page at /investor
- [x] Add 'Rights' link to shared DIMI nav bar
- [x] Wire Dashboard past sessions to /rights
- [x] Add 'View Investor Brief' link in Dashboard sidebar
- [x] Rights breadcrumb 'Dashboard' links to /app
- [x] Rights logo links to /
- [x] Investor Brief footer 'dimi.app' links to /
- [x] Investor Brief print stylesheet
- [x] Investor Brief standalone (no shared nav/footer)
- [x] Verify all pages functional (Landing, Discover, Session, Brand, Rights, Investor)

## Task 1: Wire Rights Workspace to real session data
- [x] Create releases table with title, BPM, key, genre, session reference
- [x] Create release_contributors table with contributor data, split percentages, signature status
- [x] Create tRPC endpoints for releases (get, update splits, sign)
- [x] Update Rights page to accept ?session=SESSION_ID URL param
- [x] Show empty workspace when no session ID present
- [x] Dynamically generate contributor rows from database
- [x] Save split percentages to database on change
- [x] Persist signature status across page refreshes
- [x] Write tests for release endpoints
- [x] Verify all existing pages still functional

## Task 2: Build Browse Rooms page at /rooms
- [x] Create /rooms page with room listing from database
- [x] Match session card design from /discover (waveform, live badge, viewer count)
- [x] Add filter row: All · Live Now · Upcoming · Following
- [x] Link "Join Room" CTA on Dashboard to /rooms
- [x] Link each card's "Watch Session" to /session?room=ROOM_ID
- [x] Add "Rooms" to shared nav between Discover and Dashboard
- [x] Seed database with session and creator data
- [x] Verify all existing pages still functional

## Task 3: Wire waitlist email form
- [ ] Integrate email service (Resend/SendGrid/Mailgun)
- [ ] Send confirmation email on waitlist submission
- [ ] Email subject: "You're on the DIMI waitlist."
- [ ] Dark background, DIMI Green accent, Fraunces headline email body
- [ ] Store email in database with timestamp
- [ ] Handle duplicate submissions with friendly message
- [ ] Button changes to "✓ You're in" and input disables on success
- [ ] Write tests for waitlist endpoint
- [ ] Verify all existing pages still functional
