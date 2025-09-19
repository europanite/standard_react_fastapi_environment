import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native'
      + '|@react-native'
      + '|react-clone-referenced-element'
      + '|@react-navigation'
      + '|react-navigation'
      + '|expo(nent)?'
      + '|@expo(nent)?/.*'
      + '|expo-modules-core'
      + '|expo-.*'
      + '|@expo/.*'
      + '|@react-native/polyfills'
    + ')/)',
  ],
  moduleNameMapper: {
    '\\.(png|jpe?g|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
    'react-native-reanimated': 'react-native-reanimated/mock',
  },
  setupFiles: ['<rootDir>/jest.setupFiles.js'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
};
export default config;
