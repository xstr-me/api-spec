// Jest setup file for xstr.me API client tests
import 'cross-fetch/polyfill';

// Global test configuration
global.console = {
  ...console,
  // uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Mock axios for testing (since the generated client uses axios)
jest.mock('axios');

// Setup default test timeout
jest.setTimeout(10000);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
