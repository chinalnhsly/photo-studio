// 在 UmiJS 中，从特定位置导入 history 对象
// 参考: https://umijs.org/docs/api/runtime-api#history

// 方法1: 使用内置的 history 实例
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();
export { history };

// 方法2: 也可以使用以下方式从 UmiJS 运行时导入 (取消注释使用)
// import { history } from '@@/plugin-history/history';
// export { history };

// 其他兼容性工具函数可以在这里添加
