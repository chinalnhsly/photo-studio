// Umi 相关类型声明
declare module 'umi' {
  export interface IConfig {
    routes?: any[];
    history?: any;
    mode?: 'development' | 'production';
    // ...其他配置项
    [key: string]: any;
  }
  
  export function defineConfig(config: IConfig): IConfig;
  export const history: {
    push(path: string): void;
    replace(path: string): void;
    go(n: number): void;
    goBack(): void;
    goForward(): void;
  };
  export const useRouteMatch: any;
  export const useLocation: any;
  
  // webpack chain 类型
  export interface IWebpackChainConfig {
    plugin(name: string): {
      use: any;
      // ...其他方法
    };
    // ...其他方法
  }
}
