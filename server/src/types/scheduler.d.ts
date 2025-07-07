declare module 'scheduler' {
  // 简单声明，让 TypeScript 不再报错
  export const unstable_now: () => number;
  export const unstable_scheduleCallback: (priorityLevel: number, callback: Function) => any;
  export const unstable_cancelCallback: (callbackNode: any) => void;
  export const unstable_shouldYield: () => boolean;
}
