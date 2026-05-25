process.env.EXPO_PUBLIC_API_BASE = process.env.EXPO_PUBLIC_API_BASE || "http://localhost:8000/api/v1";

if (!Object.getOwnPropertyDescriptor(globalThis, '__ExpoImportMetaRegistry')) {
  Object.defineProperty(globalThis, '__ExpoImportMetaRegistry', {
    configurable: true,
    value: { get: () => null, has: () => false },
  });
}

jest.mock('@react-native/animated', () => ({}), { virtual: true });
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}), { virtual: true });
