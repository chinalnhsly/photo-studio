declare module 'webpack' {
  namespace webpack {
    class ProvidePlugin {
      constructor(definitions: Record<string, string | string[]>);
      apply(compiler: any): void;
    }
  }
  
  const ProvidePlugin: webpack.ProvidePlugin;
  
  export = webpack;
  export as namespace webpack;
}
