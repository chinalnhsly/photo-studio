let Pie, Line,Column;
try {
  // 优先使用官方图表
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const charts = require('@ant-design/charts');
  Pie = charts.Pie;
  Line = charts.Line;
  Column = charts.Column;
} catch {
  // 回退到简易占位
  Pie = require('./Pie').default;
  Line = require('./Line').default;
  Column = require('./Column').default;
}

export { Line, Pie };
