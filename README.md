# TheNearestThrone 🚽

A comprehensive restroom finder application for the Philippines, helping users locate the nearest public toilets with detailed information about cleanliness, accessibility, and amenities.

## Features

- **Interactive Map**: Real-time map showing restroom locations across Metro Manila and surrounding areas
- **Detailed Reviews**: User-generated reviews with star ratings and cleanliness scores
- **Advanced Filtering**: Filter by cleanliness rating, accessibility features, payment type, toilet type, and gender options
- **Location-Based Search**: Find restrooms near your current location or search specific areas
- **Comprehensive Details**: Each restroom listing includes:
  - Cleanliness rating (1-5 stars)
  - Type (Public/Private/Paid)
  - Gender options (Male, Female, Unisex)
  - Accessibility features
  - Available amenities (Paper towels, Bidet, Hand dryer, etc.)
  - Distance and walking time from your location

## Tech Stack

This is a [Next.js](https://nextjs.org) project built with modern web technologies:

- **Frontend**: Next.js 15.3.1 with App Router and Turbopack
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with Tailwind Merge and animations
- **Maps**: Leaflet with React-Leaflet and Leaflet-GeoSearch
- **UI Components**: Shadcn/ui built on Radix UI primitives
- **Forms**: React Hook Form with Zod validation and Hookform Resolvers
- **State Management**: Zustand
- **Icons**: Lucide React
- **Theming**: Next-themes for dark/light mode
- **Additional UI**:
  - Class Variance Authority for component variants
  - Vaul for drawer components
  - Custom animations with tailwindcss-animate and tw-animate-css

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/your-username/the-nearest-throne.git
cd the-nearest-throne
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Note: This project uses Turbopack for faster development builds.

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. **Browse Map**: Explore the interactive map to see all available restroom locations
2. **Apply Filters**: Use the sidebar filters to narrow down results based on your needs
3. **View Details**: Click on any map marker to see detailed information about that restroom
4. **Read Reviews**: Check user reviews and ratings to make informed decisions
5. **Get Directions**: Use the routing feature to get walking directions to your chosen restroom

## Project Structure

```
the-nearest-throne/
├── app/                    # Next.js App Router pages
├── components/            # Reusable React components
├── lib/                   # Utility functions and configurations
├── public/               # Static assets
└── styles/               # Global styles and Tailwind config
```

## Contributing

We welcome contributions to improve TheNearestThrone! Here's how you can help:

1. **Report Issues**: Found a bug or have a feature request? Open an issue
2. **Submit Reviews**: Help other users by adding reviews for restrooms you've visited
3. **Add Locations**: Know of a public restroom not on the map? Let us know
4. **Code Contributions**: Submit pull requests for bug fixes or new features

## Key Dependencies

- **shadcn/ui**: Modern component library built on Radix UI primitives with Tailwind CSS
- **leaflet & react-leaflet**: Interactive maps with geosearch functionality
- **react-hook-form & zod**: Type-safe form handling with validation
- **zustand**: Lightweight state management
- **next-themes**: Seamless theme switching support
- **lucide-react**: Beautiful, customizable SVG icons

### Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - beautifully designed components built on Radix UI
- [Radix UI](https://www.radix-ui.com/) - low-level UI primitives
- [React Leaflet](https://react-leaflet.js.org/) - React components for Leaflet maps
- [Zustand](https://zustand-demo.pmnd.rs/) - small, fast state management
- [React Hook Form](https://react-hook-form.com/) - performant forms with easy validation

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This project is open source and available under the [MIT License](LICENSE).

---

**TheNearestThrone** - Because everyone deserves access to clean, accessible restrooms! 🏆
