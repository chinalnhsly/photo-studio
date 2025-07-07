// 为 moment 添加额外的类型声明
declare module 'moment' {
  import * as momentNs from 'moment';
  export = momentNs;
  export as namespace moment;
  
  export type Moment = momentNs.Moment;
}
