# Smart Campus - Frontend

This is the frontend application for the Smart Campus management system.

## Project Structure

```
frontend/
├── src/
│   ├── admin/          # Admin portal pages and components
│   ├── comman/         # Common pages (Landing, Login, Register)
│   ├── faculty/        # Faculty portal pages and components
│   ├── hr/             # HR portal pages and components
│   ├── students/        # Student portal pages and components
│   ├── shared/          # Shared components, layouts, and utilities
│   ├── App.jsx         # Main application component with routing
│   ├── main.jsx        # Application entry point
│   ├── App.css         # Application styles
│   └── index.css       # Global styles
├── public/             # Static assets
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── index.html          # HTML template
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Portals

- **Student Portal**: `/student/*`
- **Faculty Portal**: `/faculty/*`
- **Admin Portal**: `/admin/*`
- **HR Portal**: `/hr/*`

## Technologies

- React 19
- Vite
- React Router DOM
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React Icons

