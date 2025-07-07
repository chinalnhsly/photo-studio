// @ts-nocheck
import { plugin } from './plugin';
import * as Plugin_0 from '../../app.tsx';
import * as Plugin_1 from '/home/liyong/photostudio/admin-web/src/.umi/plugin-antd/runtime.tsx';
import * as Plugin_2 from '/home/liyong/photostudio/admin-web/src/.umi/plugin-dva/runtime.tsx';
import * as Plugin_3 from '../plugin-initial-state/runtime';
import * as Plugin_4 from '../plugin-model/runtime';

  plugin.register({
    apply: Plugin_0,
    path: '../../app.tsx',
  });
  plugin.register({
    apply: Plugin_1,
    path: '/home/liyong/photostudio/admin-web/src/.umi/plugin-antd/runtime.tsx',
  });
  plugin.register({
    apply: Plugin_2,
    path: '/home/liyong/photostudio/admin-web/src/.umi/plugin-dva/runtime.tsx',
  });
  plugin.register({
    apply: Plugin_3,
    path: '../plugin-initial-state/runtime',
  });
  plugin.register({
    apply: Plugin_4,
    path: '../plugin-model/runtime',
  });

export const __mfsu = 1;
