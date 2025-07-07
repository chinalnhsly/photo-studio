const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// 读取路由配置
const routesPath = path.resolve(__dirname, '../config/routes.ts');
const routesContent = fs.readFileSync(routesPath, 'utf8');

// 提取组件路径
const componentRegex = /component:\s*['"]([^'"]+)['"]/g;
let match;
const components = [];

while ((match = componentRegex.exec(routesContent)) !== null) {
  components.push(match[1]);
}

console.log(chalk.blue(`检查 ${components.length} 个路由组件...`));

// 检查组件文件是否存在
const pagesDir = path.resolve(__dirname, '../src/pages');

const missingComponents = [];

components.forEach(component => {
  // 跳过内部组件，如 './404'
  if (component.startsWith('./')) {
    return;
  }
  
  // 尝试多种可能的文件扩展名和索引文件
  const possiblePaths = [
    path.join(pagesDir, `${component}.tsx`),
    path.join(pagesDir, `${component}.jsx`),
    path.join(pagesDir, `${component}.ts`),
    path.join(pagesDir, `${component}.js`),
    path.join(pagesDir, component, 'index.tsx'),
    path.join(pagesDir, component, 'index.jsx'),
    path.join(pagesDir, component, 'index.ts'),
    path.join(pagesDir, component, 'index.js'),
  ];
  
  const exists = possiblePaths.some(p => fs.existsSync(p));
  
  if (!exists) {
    missingComponents.push({
      component,
      possiblePaths: possiblePaths.map(p => p.replace(pagesDir, '/src/pages'))
    });
  }
});

if (missingComponents.length === 0) {
  console.log(chalk.green('✅ 所有路由组件文件均存在'));
} else {
  console.log(chalk.red(`❌ 发现 ${missingComponents.length} 个缺失组件:`));
  
  missingComponents.forEach(({ component, possiblePaths }) => {
    console.log(chalk.yellow(`\n组件: ${component}`));
    console.log('可能的文件路径:');
    possiblePaths.forEach(p => {
      console.log(`  - ${p}`);
    });
  });
  
  // 提供创建缺失组件的命令
  console.log(chalk.blue('\n要创建缺失的组件，请执行:'));
  missingComponents.forEach(({ component }) => {
    const dir = path.dirname(path.join(pagesDir, component));
    const fileName = path.basename(component);
    
    console.log(`mkdir -p ${dir} && touch ${path.join(dir, `${fileName}.tsx`)}`);
  });
}

// 检查已配置但未在页面目录中找到的组件
