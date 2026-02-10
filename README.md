# Cloudflare Workers Full-Stack Chat Demo

[![Deploy to Cloudflare]([![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/bilbywilby/claimshield-medical-billing-dispute-generator))]([![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/bilbywilby/claimshield-medical-billing-dispute-generator))

A production-ready full-stack chat application built on Cloudflare Workers. Features a reactive React frontend with shadcn/ui, powered by a Durable Objects backend for multi-tenant entities (Users, ChatBoards, Messages). Supports real-time CRUD operations, pagination, and seeding with mock data.

## ✨ Key Features

- **Durable Objects Backend**: One DO per entity (User/ChatBoard) with automatic indexing for efficient listing/pagination.
- **Type-Safe APIs**: Hono router with full TypeScript support for Workers and client.
- **Reactive Frontend**: TanStack Query for data fetching/mutations, React Router, and shadcn/ui components.
- **Theme Support**: Dark/light mode with Tailwind CSS and CSS variables.
- **Error Handling**: Global error boundaries and client-side error reporting to Workers.
- **Production-Ready**: CORS, logging, health checks, and SPA asset handling.
- **Mock Data Seeding**: Pre-populated users, chats, and messages for instant demo.
- **Mobile-Responsive**: Tailwind-powered UI with sidebar layout.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, React Router, Lucide Icons, Sonner (toasts), Framer Motion.
- **Backend**: Cloudflare Workers, Hono, Durable Objects (SQLite-backed).
- **Data**: Global Durable Object for shared storage/indexing across entities.
- **Dev Tools**: Bun, Wrangler, ESLint, TypeScript.
- **Libraries**: Immer, Zod (forms), Recharts (optional charts), and more.

## 🚀 Quick Start

1. **Prerequisites**:
   - [Bun](https://bun.sh/) installed.
   - [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install/) logged in (`wrangler login`).

2. **Clone & Install**:
   ```bash
   git clone <your-repo-url>
   cd claim-shield-_mrsbngkxv-wxaqix7q0x
   bun install
   ```

3. **Development**:
   ```bash
   bun dev
   ```
   - Opens at `http://localhost:3000` (frontend).
   - Backend APIs at `http://localhost:8787/api/*`.
   - Edit `src/pages/HomePage.tsx` for UI or `worker/user-routes.ts` + `worker/entities.ts` for backend.

4. **Type Generation** (after `wrangler login`):
   ```bash
   bun cf-typegen
   ```

## 📚 Usage Examples

### Frontend (React + TanStack Query)
```tsx
// src/lib/api-client.ts - Use the typed API helper
import { api } from '@/lib/api-client';

const users = useQuery({
  queryKey: ['users'],
  queryFn: () => api<User[]>('/api/users'),
});
```

### Backend (Worker Routes)
Add routes in `worker/user-routes.ts`:
```ts
app.get('/api/users', async (c) => {
  await UserEntity.ensureSeed(c.env);
  return ok(c, await UserEntity.list(c.env));
});
```

Entities extend `IndexedEntity` for auto-indexing:
```ts
// worker/entities.ts
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = 'user';
  static readonly indexName = 'users';
  static seedData = MOCK_USERS;
}
```

APIs auto-support: `GET /api/users`, `POST /api/users`, `DELETE /api/users/:id`, pagination (`?cursor=&limit=10`).

### Mock Data
Pre-seeded on first request: 2 users, 1 chat board, 1 message.

## 🔧 Development Workflow

- **Frontend**: `src/` - Edit pages/components. Hot reload with `bun dev`.
- **Backend**: `worker/` - Add entities/routes. Auto-reload.
- **Shared Types**: `shared/` - Client/server sync (User, Chat, etc.).
- **UI Components**: shadcn/ui ready (`@/components/ui/*`).
- **Linting**: `bun lint`.
- **Build**: `bun build` (frontend only).
- **Preview**: `bun preview`.

**Pro Tips**:
- Extend `core-utils.ts` entities (DO NOT MODIFY - use as base).
- Sidebar layout: Wrap pages in `AppLayout` (`@/components/layout/AppLayout.tsx`).
- Theme: Use `useTheme()` hook.
- Errors: Auto-reported to `/api/client-errors`.

## ☁️ Deployment

1. **Configure**:
   - Update `wrangler.jsonc` (name, bindings).
   - Set secrets: `wrangler secret put <KEY>`.

2. **Deploy**:
   ```bash
   bun deploy
   ```
   Deploys Worker + Pages assets.

3. **Custom Domain** (Workers/Pages):
   ```
   wrangler pages deploy --project-name <pages-project> dist/
   wrangler deploy --name <worker-name>
   ```

[![Deploy to Cloudflare]([![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/bilbywilby/claimshield-medical-billing-dispute-generator))]([![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/bilbywilby/claimshield-medical-billing-dispute-generator))

**Live Demo APIs**:
- `GET /api/health`
- `GET /api/users`
- `POST /api/chats` `{ "title": "My Chat" }`

## 🤝 Contributing

1. Fork & PR.
2. Follow TypeScript/Tailwind conventions.
3. Update `shared/types.ts` for new entities.
4. Test APIs with curl/Postman.

## 📄 License

MIT. See [LICENSE](LICENSE) for details.

---

*Built with ❤️ for Cloudflare Workers*