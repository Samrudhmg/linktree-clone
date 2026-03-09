# Implementation Plan
<!-- linktree clone -->


┌─────────────────────────────────────────┐
│              Frontend (Client)          │
│  ┌─────────────┐   ┌──────────────────┐ │
│  │  Admin Panel│   │  Public Profile  │ │
│  │  (dashboard)│   │  Page (@username)│ │
│  └──────┬──────┘   └────────┬─────────┘ │
└─────────┼───────────────────┼───────────┘
          │                   │
┌─────────▼───────────────────▼───────────┐
│              Backend (API)              │
│  Auth │ Links CRUD │ Analytics │ Users  │
└───────────────────┬─────────────────────┘
                    │
┌───────────────────▼─────────────────────┐
│                Database                 │
│   Users │ Links │ Clicks │ Themes       │
└─────────────────────────────────────────┘


Click (Analytics)
id, link_id (FK),
clicked_at, ip_address,
referrer, user_agent

all the use case for the interaction with the live page.


