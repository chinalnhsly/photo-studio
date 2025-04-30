const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// 兼容性矩阵
const COMPATIBILITY_MATRIX = {
  'react': {
    version: '17.0.2',
    dependencies: {
      'react-redux': '^7.2.0',
      'react-dom': '17.0.2',
      '@ant-design/pro-components': '^2.0.0'
    }
  }
};

function checkDependencies() {
  console.log(chalk.blue('检查依赖版本兼容性...'));
  
  const packagePath = path.resolve(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const dependencies = { 
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };
  
  const reactVersion = dependencies.react;
  const matrix = COMPATIBILITY_MATRIX.react;
  
  console.log(chalk.green(`当前 React 版本: ${reactVersion}`));
  
  let hasIncompatible = false;
  
  Object.keys(matrix.dependencies).forEach(dep => {
    if (dependencies[dep]) {
      const requiredVersion = matrix.dependencies[dep];
      const currentVersion = dependencies[dep];
      
      console.log(`检查 ${dep}: 当前版本 ${currentVersion}, 兼容版本 ${requiredVersion}`);
      
      if (currentVersion.startsWith('^9') && dep === 'react-redux') {
        console.log(chalk.red(`⚠️ 警告: ${dep}@${currentVersion} 不兼容 React 17, 需要使用 ${requiredVersion}`));
        hasIncompatible = true;
      }
    }
  });
  
  if (hasIncompatible) {
    console.log(chalk.yellow('发现不兼容的依赖版本，请运行 ./fix-redux.sh 修复问题'));
  } else {
    console.log(chalk.green('✅ 所有依赖版本兼容'));
  }
}

checkDependencies();
