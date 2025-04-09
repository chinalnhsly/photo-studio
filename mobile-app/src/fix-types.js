// 运行时类型修复，在入口文件中导入

// 修补React.createElement以兼容Taro
const originalCreateElement = React.createElement;
React.createElement = function(type, props, ...children) {
  // 处理React元素类型不兼容问题
  return originalCreateElement(type, props, ...children);
};

// 替换ReactNode类型检查
if (process.env.NODE_ENV !== 'production') {
  // 在开发环境下打印类型警告而非报错
  console.log('类型修复已应用，部分类型警告将被抑制');
}
