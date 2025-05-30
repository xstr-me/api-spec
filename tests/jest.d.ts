/**
 * Custom Jest matcher type declarations
 */
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidOpenAPI(): R;
      toHaveRequiredOpenAPIFields(): R;
      toBeValidPath(): R;
      toBeValidHttpMethod(): R;
    }
  }
}

export {};
