# ReadIt Library

A library for the age of AI.

ReadIt Library is a digital library and bookstore-style platform dedicated to books, essays, stories, research pieces, guides, and other written works created with or by AI models. The platform provides a premium reading experience where users can discover, read, save, organize, and engage with AI-generated and AI-assisted content.

## Table of Contents

- [Product Vision](#product-vision)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Database Design](#database-design)
- [API Routes](#api-routes)
- [Setup Instructions](#setup-instructions)
- [Development Strategy](#development-strategy)
- [Accessibility & Performance](#accessibility--performance)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Product Vision

ReadIt Library aims to be a trusted, modern digital library where the content is the hero. The platform balances discovery, trust, reading comfort, library organization, and AI transparency to create an experience that feels closer to a premium digital library or elegant reading application than an AI dashboard.

### Core Concept

Users can:
- Discover AI-generated and AI-assisted writing across fiction, non-fiction, research, and more
- Browse a large digital catalog with sophisticated search and filtering
- Read works directly in the browser with a dedicated, customizable reader
- Save books to their personal library and create collections
- Track reading progress, bookmark passages, add notes, and highlight text
- See clear AI provenance for every work (model, version, involvement level)
- Submit their own AI-assisted works through a structured workflow
- Follow creators and continue reading exactly where they left off

### Brand Personality

- Modern, intelligent, calm, literary, curious, trustworthy
- Minimal, human-centered, technology-forward without looking overly futuristic
- Avoids cliché AI aesthetics (no glowing gradients, robot heads, or neon sci-fi interfaces)

## Key Features

### Reading Experience
- Dedicated digital reader with optimal typography and layout
- Pagination or continuous scroll modes
- Chapter navigation and table of contents
- Progress tracking that automatically saves
- Customizable reading settings (font, size, themes, spacing)
- Fullscreen mode and keyboard shortcuts
- Thumb-friendly mobile controls

### Interaction & Organization
- Highlights and notes with search and filtering
- Personal library with sections (Continue Reading, Saved, Want to Read, Finished, Collections)
- Drag-and-drop collection management
- Reading history and statistics
- Bookmarks at chapter, page, and passage levels

### Discovery & Search
- Global search across titles, authors, topics, and AI models
- Explore page with powerful filters (content type, genre, AI model, creator, date, etc.)
- Multiple views (grid/list) with persistent preferences
- Trending algorithm with transparent scoring
- Metadata-based recommendations (with architecture for ML embeddings later)
- Editorial curation (Featured, Editor's Pick, New, Trending)

### Creator & Publishing
- Creator dashboard for managing drafts, submissions, and published works
- Structured submission workflow with metadata capture
- Content validation (file type, size, metadata, duplicates)
- Moderation queue with audit trails
- Analytics for creators (views, reads, engagement)

### Administration
- Role-based access control (Reader, Creator, Moderator, Admin)
- Admin dashboard with real metrics and charts
- Content moderation queue
- User, creator, and model management
- Reports and audit logs
- Platform settings and AI model directory

### Trust & Transparency
- Clear AI provenance display for every work
- Differentiation between AI-generated, AI-assisted, and human-written with AI assistance
- Exact model/version tracking
- Human contribution disclosure
- Content warnings where appropriate

## Tech Stack

Unless there is a compelling technical reason not to, the platform uses:

### Frontend
- **Next.js** (latest stable) with React 19 and TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** or equivalent accessible component system
- **Lucide icons**

### Backend
- Next.js server functionality/API routes or clean backend layer
- **PostgreSQL** database
- **Prisma ORM** for database operations
- Object storage (AWS S3, Cloudinary, or equivalent) for:
  - Book covers
  - Manuscript files
  - Profile images
  - Creator assets

### Authentication
- Email/password with verification
- Google sign-in
- Password reset
- Session management (secure, HTTP-only cookies)

### Search
- PostgreSQL full-text search (initial)
- Architecture designed for semantic/vector search integration later

### Deployment
- Vercel or equivalent frontend hosting
- Managed PostgreSQL (Supabase, Neon, or similar)
- Environment variables (never hard-coded secrets)
- Production logging and error monitoring

## Database Design

The relational schema includes:

### Core Entities
- **User**: id, name, email, password hash/auth provider, avatar, bio, role, timestamps
- **Work**: id, title, subtitle, slug, description, contentType, body reference, coverUrl, creatorId, status, language, publishedAt, timestamps
- **AIProvenance**: workId, provider, model, modelVersion, involvementType, humanEdited, humanEditor, generationDate, disclosure
- **Category**: id, name, slug, description
- **Tag**: id, name, slug

### User Interactions
- **ReadingProgress**: id, userId, workId, chapterId, position, percentage, lastReadAt
- **Bookmark**: id, userId, workId, chapterId, position
- **Highlight**: id, userId, workId, chapterId, selectedText, startPosition, endPosition, color, createdAt
- **Note**: id, userId, workId, chapterId, highlightId, content, createdAt, updatedAt
- **Collection**: id, userId, name, description, coverUrl, visibility, timestamps
- **CollectionItem**: collectionId, workId, position
- **Review**: id, userId, workId, rating, content, status, createdAt
- **Submission**: id, creatorId, workId, status, moderatorId, moderatorNotes, submittedAt, reviewedAt
- **Report**: id, reporterId, workId, reviewId, type, description, status, createdAt
- **Follow**: followerId, followingId
- **ReadingHistory**: userId, workId, startedAt, lastOpenedAt, finishedAt

All major search/filter/query paths are indexed with appropriate foreign keys and constraints.

## API Routes

Clean API/service boundaries include:

- `GET /api/works` - List works with filtering
- `GET /api/works/:id` - Get specific work
- `POST /api/works` - Create new work (protected)
- `PATCH /api/works/:id` - Update work (protected)
- `DELETE /api/works/:id` - Delete work (protected)
- `GET /api/search` - Global search endpoint
- `POST /api/progress` - Update reading progress
- `POST /api/highlights` - Create highlight
- `POST /api/notes` - Create note
- `POST /api/collections` - Create collection
- `POST /api/reviews` - Submit review
- `POST /api/submissions` - Submit work for moderation
- `POST /api/reports` - Submit content report
- `GET /api/health` - Health check endpoint

All mutations require proper authorization and return meaningful HTTP status codes.

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd readit-library
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Update .env with your database connection string and other secrets
   ```

4. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Seed the database** (optional but recommended for development)
   ```bash
   npm run seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Open in browser**
   Visit `http://localhost:3000`

## Development Strategy

The platform is built in seven phases:

### Phase 1 — Foundation
- Project setup, database, authentication
- Design system, layout, navigation
- Seed data

### Phase 2 — Library
- Home, Explore, Search pages
- Categories, Book details, Article details

### Phase 3 — Reader
- Reader interface, chapters, progress tracking
- Bookmarks, highlights, notes, reading settings

### Phase 4 — Personalization
- My Library, Collections, History, Profile
- Recommendations

### Phase 5 — Publishing
- Creator accounts, submission workflow
- Drafts, publishing workflow, AI provenance

### Phase 6 — Moderation
- Admin dashboard, approval queue
- Reports, audit logs

### Phase 7 — Production Hardening
- Tests, accessibility, performance, SEO
- Security, error handling, deployment preparation

## Accessibility & Performance

### Accessibility
- Targets WCAG 2.2 AA where practical
- Semantic HTML, keyboard navigation, visible focus states
- Sufficient contrast, ARIA labels, accessible dialogs
- Reduced-motion support, screen-reader-friendly structure

### Performance
- Server-side rendering where beneficial
- Streaming/loading states, image optimization, lazy loading
- Proper caching, pagination, database indexes
- Minimized client-side JavaScript, optimistic updates
- Intelligent loading for long works (no full book in initial load)

## Deployment

Prepare for production with:

1. **Environment Variables** (never commit these):
   ```
   DATABASE_URL="your_postgresql_connection_string"
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="https://yourdomain.com"
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   AWS_ACCESS_KEY_ID="your_aws_access_key"
   AWS_SECRET_ACCESS_KEY="your_aws_secret_key"
   AWS_BUCKET_NAME="your_s3_bucket_name"
   ```

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Start production server**
   ```bash
   npm start
   ```

4. **Deploy to Vercel** (or equivalent) with:
   - Frontend build output
   - Environment variables configured
   - PostgreSQL database connected
   - Object storage bucket configured

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details.

---
*ReadIt Library: A library for the age of AI.*