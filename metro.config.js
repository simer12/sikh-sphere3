const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add platform-specific extensions
config.resolver.sourceExts.push('web.tsx', 'web.ts', 'web.jsx', 'web.js');

// Alias react-native-maps to our mock for web
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-native-maps': path.resolve(__dirname, 'src/mocks/react-native-maps.web.js'),
};

module.exports = config;
