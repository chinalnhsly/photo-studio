# Photo Studio Management System

A comprehensive management system for photo studios built with NestJS and React.

## Features

- User Authentication & Authorization
- Product Management
- Order Management
- Inventory Management
- Customer Management
- Photography Task Management
- Marketing Campaign Management
- Financial Statistics

## Tech Stack

- Frontend: React 18 + TypeScript + Ant Design Pro
- Backend: NestJS 9 + TypeScript
- Database: PostgreSQL + Redis
- ORM: Prisma
- Package Manager: pnpm
- Monorepo: TurboRepo

## Getting Started

### Prerequisites

- Node.js 16+
- pnpm 8+
- PostgreSQL 14+
- Redis 6+

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/photo-studio.git
cd photo-studio
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp apps/server/.env.example apps/server/.env
# Edit .env with your database credentials
```

4. Generate Prisma client
```bash
cd apps/server
pnpm prisma generate
pnpm prisma db push
```

5. Start development servers
```bash
# From root directory
pnpm dev
```

## Project Structure

```
photo-studio/
├── apps/
│   ├── server/        # NestJS backend
│   └── web/          # React frontend
├── packages/         # Shared packages
├── package.json
└── turbo.json
```

## License

ISC
