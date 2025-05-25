import { defineConfig } from 'umi';
import routes from './config/routes';
import path from 'path';
import webpack from 'webpack';
import sass from 'sass';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes,
  fastRefresh: {},
  mfsu: false,
  cssLoader: {
    localsConvention: 'camelCase',
  },
  extraPostCSSPlugins: [],
  theme: {
    'primary-color': '#1890ff',
    'link-color': '#1890ff',
  },
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  dva: {
    immer: true,
    hmr: false,
  },
  hash: true,
  antd: {
    config: {
      disableReactStrictMode: true
    }
  },
  ignoreMomentLocale: true,
  targets: {
    ie: 11,
  },
  alias: {
    '@ant-design/icons/lib/dist': '@ant-design/icons/lib/index.es.js',
    'react': path.resolve(__dirname, './node_modules/react'),
    'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    'antd/es/color-picker': path.resolve(__dirname, './src/components/CompatAntd/ColorPicker'),
    'antd/lib/color-picker': path.resolve(__dirname, './src/components/CompatAntd/ColorPicker'),
  },
  chainWebpack(config: import('umi').IWebpackChainConfig) {
    const rule = (config as any).module.rule('scss').test(/\.scss$/);
    rule.use('style-loader').loader('style-loader').end();
    rule.use('css-loader').loader('css-loader').end();
    rule.use('sass-loader').loader('sass-loader').options({ implementation: sass }).end();
    config.plugin('provide-react').use(webpack.ProvidePlugin, [{
      React: 'react',
    }]);
  }
});
