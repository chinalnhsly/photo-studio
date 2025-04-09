/// <reference types="jest" />

declare namespace jest {
  interface Matchers<R> {
    toHaveBeenCalledExactly(...args: any[]): R;
  }
}
