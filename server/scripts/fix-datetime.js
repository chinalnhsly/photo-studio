const fs = require('fs');
const path = require('path');

// 递归查找文件
function findFiles(dir, pattern, callback) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath, pattern, callback);
    } else if (pattern.test(file)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 检查文件内容是否包含datetime
      if (content.includes('datetime') || content.includes('Campaign') && content.includes('Date')) {
        callback(filePath, content);
      }
    }
  });
}

const srcDir = path.join(__dirname, '../src');

findFiles(srcDir, /\.ts$/, (filePath, content) => {
  // 替换 datetime 类型为 timestamptz
  const newContent = content
    .replace(/type:\s*['"]datetime['"]/g, `type: 'timestamptz'`)
    .replace(/type:\s*"datetime"/g, `type: 'timestamptz'`);
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Fixed datetime in: ${filePath}`);
  }
});

console.log('Scan complete!');
