/**
 * 手势和触摸事件相关的类型声明
 */

declare module 'gesture' {
  export interface GestureEvent {
    type: string;
    touches: Touch[];
    changedTouches: Touch[];
    timeStamp: number;
    target: any;
    currentTarget: any;
    preventDefault(): void;
    stopPropagation(): void;
  }

  export interface Touch {
    identifier: number;
    pageX: number;
    pageY: number;
    clientX: number;
    clientY: number;
  }

  export interface GestureState {
    x: number;
    y: number;
    dx: number;
    dy: number;
    vx: number;
    vy: number;
    scale: number;
    rotation: number;
    initialX: number;
    initialY: number;
    initialScale: number;
    initialRotation: number;
  }
}
