# News Reader Mobile App

A basic news reader application built with React Native and Expo.

## Features

- **Latest News**: Browse the most recent news articles from various sources
- **Category Filtering**: Filter news by categories (business, entertainment, health, science, sports, technology)
- **Article Saving**: Save your favorite articles for offline reading
- **Dark Mode**: Switch between light and dark themes
- **Responsive Design**: Optimised for various screen sizes
- **Offline Support**: Access saved articles without an internet connection

## Tech Stack

- **React Native**: Cross-platform mobile framework
- **Expo**: Simplified React Native development environment
- **TypeScript**: Type-safe JavaScript
- **MobX**: State management
- **React Query**: Data fetching and caching
- **NativeWind/TailwindCSS**: Utility-first styling
- **React Navigation**: Navigation and routing
- **Axios**: HTTP client
- **AsyncStorage**: Local data persistence

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MasiMasinga/News-Reader-Mobile-App.git
cd news-reader-mobile-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with your News API key:
```
EXPO_PUBLIC_NEWS_API_KEY=your_api_key_here
EXPO_PUBLIC_NEWS_API_URL=https://newsapi.org/v2
```

4. Start the development server:
```bash
npx expo start
```

5. Follow the instructions in the terminal to run the app on your device or emulator.

## Project Structure

```
news-reader-app/
├── src/
│   ├── common/        # Shared components, types, and utilities
│   ├── navigation/    # Navigation configuration
│   ├── screens/       # Application screens
│   ├── services/      # API services
│   ├── stores/        # MobX stores
│   └── types/         # TypeScript definitions
├── assets/            # Images, fonts, etc.
├── App.tsx            # Root component
└── app.json           # Expo configuration
```

## API

This app uses the [News API](https://newsapi.org/) to fetch news articles. You'll need to register for a free API key.

## License

[MIT](LICENSE)
