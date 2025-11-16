# TanStack Start Starter

A modern full-stack application template with TanStack Start, shadcn/ui, TypeScript, TanStack Query, and pre-built dashboard layouts for rapid development.

## 🌐 Live Demo

Check out the live demo: **[Coming Soon]()**

## ✨ Features

- **React 19** - Latest React version with modern features
- **TanStack Start** - Full-stack framework with SSR and file-based routing
- **TanStack Router** - Routing with nested layouts and type-safety
- **TypeScript** - Full type safety and better developer experience
- **TanStack Query** - Powerful data fetching and state management
- **shadcn/ui** - Beautiful and accessible UI components
- **Tailwind CSS v4** - Modern utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Nitro** - Universal server engine for SSR

## 🏗️ Pre-built Components

- **Sidebar Navigation** - Collapsible sidebar with nested menus
- **Dashboard Layout** - Professional dashboard with breadcrumbs
- **Dark Mode** - Built-in theme switching support
- **Responsive Design** - Mobile-first responsive layouts
- **Client Management** - Complete management system with filters and tables
- **Data Components** - Interactive tables with pagination and sorting

## 🚀 Quick Start

1. **Clone or use this template**

   ```bash
   git clone [your-repo-url]
   cd tanstack-starter
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start development server**

   ```bash
   pnpm dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── app-sidebar/    # Sidebar navigation components
│   ├── theme/          # Theme system and dark mode
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── integrations/       # External library integrations
│   └── tanstack-query/ # TanStack Query configuration
├── lib/                # Utility functions and configs
├── routes/             # Route components and layouts
│   ├── __root.tsx     # Root application layout
│   ├── backoffice/    # Administrative dashboard routes
│   └── index.tsx      # Home page
└── styles/             # Global styles and CSS
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm serve` - Preview production build
- `pnpm test` - Run tests with Vitest
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm check` - Format and lint code

## 🎨 Customization

This template is designed to be easily customizable:

1. **Update branding** - Change colors, logos, and titles
2. **Add routes** - Create new pages in the `routes/` directory
3. **Modify sidebar** - Edit navigation in `components/app-sidebar/`
4. **Extend components** - Add more shadcn/ui components as needed

## 📚 Tech Stack

- [React](https://react.dev/) - UI library
- [TanStack Start](https://tanstack.com/start) - Full-stack framework
- [TanStack Router](https://tanstack.com/router) - Routing
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [TanStack Query](https://tanstack.com/query) - Data fetching
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vite](https://vitejs.dev/) - Build tool
- [Nitro](https://nitro.unjs.io/) - Server engine

## 🧩 Adding shadcn/ui Components

Use the latest version of shadcn to add components:

```bash
pnpx shadcn@latest add button
```

## 📖 Development Guides

### Routing

This project uses TanStack Router with file-based routing. Routes are managed as files in `src/routes`.

#### Adding a Route

To add a new route, simply create a new file in the `./src/routes` directory.

#### Navigation

To use SPA navigation, import the `Link` component:

```tsx
import { Link } from "@tanstack/react-router";

// Usage
<Link to="/about">About</Link>
```

### Data Fetching

You can use TanStack Query or TanStack Router's built-in loaders:

```tsx
// Using route loader
const route = createRoute({
  path: "/users",
  loader: async () => {
    const response = await fetch("/api/users");
    return response.json();
  },
  component: () => {
    const data = route.useLoaderData();
    return <div>{/* Render data */}</div>;
  },
});
```

### State Management

TanStack Query is pre-configured for server state management. For local state, you can use React hooks or add TanStack Store.

## 🧪 Testing

This project uses [Vitest](https://vitest.dev/) for testing:

```bash
pnpm test
```

## 📄 License

This template is open source and available under the [MIT License](LICENSE).

---

**Ready to build something amazing? Start coding! 🚀**
