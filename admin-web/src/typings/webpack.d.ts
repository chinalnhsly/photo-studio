// webpack 类型声明（简化版）
declare module 'webpack' {
  export interface WebpackPluginInstance {
    apply(compiler: any): void;
  }
  
  export class ProvidePlugin implements WebpackPluginInstance {
    constructor(definitions: Record<string, string>);
    apply(compiler: any): void;
  }
  
  // 其他 webpack 导出
  export default function webpack(options: any, callback?: (err?: Error, stats?: any) => void): any;
}
