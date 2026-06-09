# ClearMyFridge

A mobile-first web app that helps you manage your fridge inventory, discover recipes based on what you have, track your shopping list, and get notified before food expires.

## Features

- **Home** — overview dashboard
- **Fridge** — track your current fridge contents
- **Recipes** — get recipe suggestions based on available ingredients
- **Shopping** — manage your shopping list
- **Alerts** — expiry notifications so nothing goes to waste

## Tech Stack

| Tool | Purpose |
|---|---|
| [React 19](https://react.dev) | UI library |
| [Vite](https://vite.dev) | Build tool & dev server |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| [React Router v6](https://reactrouter.com) | Client-side routing |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/Testeriusz/clearmyfridge.git
cd clearmyfridge
npm install
```

### Running locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for production

```bash
npm run build
```

The output will be in the `dist/` directory.

## Project Structure

```
src/
├── components/
│   └── BottomNav.jsx   # Bottom navigation bar
├── pages/
│   ├── Home.jsx
│   ├── Fridge.jsx
│   ├── Recipes.jsx
│   ├── Shopping.jsx
│   └── Alerts.jsx
├── App.jsx             # Router setup
└── main.jsx            # Entry point
```

## License

MIT
