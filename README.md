# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## AnginOmbak Application

AnginOmbak is a location-based application that helps users find and select locations on a map, share adventures, and connect with other users.

### Features

- **Location Services**
  - Interactive map using Leaflet
  - Multiple ways to select a location:
    - Click directly on the map
    - Use current location with browser geolocation
    - Search by location name or postal code
  - Location suggestions with Google Places API
  - Support for Singapore postal codes with district mapping

- **Social Features**
  - User posts with text and media content
  - Video sharing support (both direct video files and YouTube videos)
  - Like, comment, and share functionality
  - Public/private post visibility options
  - User profiles with customizable avatars

- **Marketplace**
  - Browse local vendors and services
  - Filter and sort marketplace listings
  - Detailed vendor information

- **User Interface**
  - Consistent styling across all pages
  - Responsive design for mobile and desktop
  - Intuitive navigation with footer links
  - Grey button styling for Social page
  - Indigo button styling for Marketplace

### Google Places API Integration

The application uses Google Places API for location search and suggestions. To use this feature:

1. Get a Google Maps API key from the [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs in your Google Cloud project:
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. Add your API key to the `.env` file:
   ```
   VITE_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY
   ```
4. Restart the development server

The application will use Google Places API for:
- Location search suggestions as you type
- Detailed place information when a suggestion is selected
- Reverse geocoding when clicking on the map

If the Google Maps API is not available, the application will fall back to OpenStreetMap's Nominatim service.

## Deployment on Vercel

This application is configured for seamless deployment on Vercel. Follow these steps to deploy:

### Option 1: Deploy from the Vercel Dashboard

1. Push your code to a GitHub, GitLab, or Bitbucket repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New" > "Project"
4. Import your repository
5. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Add environment variables (if needed):
   - Add your `VITE_GOOGLE_MAPS_API_KEY` if you're using Google Maps
7. Click "Deploy"

### Option 2: Deploy using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your project directory:
   ```bash
   cd /path/to/anginombak
   vercel
   ```

4. Follow the prompts to configure your deployment
5. For production deployment:
   ```bash
   vercel --prod
   ```

### Environment Variables on Vercel

If your application uses environment variables:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add your environment variables (e.g., `VITE_GOOGLE_MAPS_API_KEY`)
4. Redeploy your application for the changes to take effect

### CORS Configuration

This application includes CORS handling for external API requests:

1. **Development Environment**: The Vite development server includes a proxy configuration in `vite.config.ts` that handles CORS for OpenStreetMap Nominatim API requests.

2. **Production Environment**: The Vercel deployment includes:
   - CORS headers in `vercel.json` for all routes
   - A serverless API proxy function in `/api/proxy.js` that handles requests to external APIs
   - URL rewriting in `vercel.json` to route API requests through the proxy

This configuration ensures that all external API requests work correctly in both development and production environments.

### Troubleshooting Deployment Issues

- **404 errors on page refresh**: This is handled by the `vercel.json` configuration which includes proper rewrites for SPA routing
- **Environment variables not working**: Make sure they are prefixed with `VITE_` for client-side access
- **Build failures**: Check the build logs in Vercel dashboard for specific errors
- **CORS errors**: If you encounter CORS issues with external APIs, check the proxy configuration in `api/proxy.js` and `vercel.json`
