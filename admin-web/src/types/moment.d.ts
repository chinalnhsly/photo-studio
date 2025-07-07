declare module 'moment' {
  import moment from 'moment';
  export = moment;
  export as namespace moment;
}

// 补充 Moment 接口
declare namespace moment {
  interface Moment {
    format(format?: string): string;
    // 添加其他需要的方法
  }
}
