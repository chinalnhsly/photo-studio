import React, { useState } from 'react';
import { Card, Divider, Switch, Space } from 'antd';
import TagSelect from './index';
import './demo.less';

const Demo: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>(['热门', '婚纱']);
  const [disabled, setDisabled] = useState<boolean>(false);
  
  // 定义推荐标签
  const tagSuggestions = ['热门', '婚纱', '儿童', '写真', '全家福', '证件照', '商业摄影', '旅拍', '艺术照'];
  
  // 定义颜色映射关系
  const colorMap: Record<string, string> = {
    '热门': '#f50',
    '婚纱': '#2db7f5',
    '儿童': '#87d068',
    '写真': '#108ee9',
  };

  return (
    <div className="tag-select-demo">
      <Card title="TagSelect 标签选择器示例">
        <Space style={{ marginBottom: 16 }}>
          <span>禁用：</span>
          <Switch
            checked={disabled}
            onChange={setDisabled}
          />
        </Space>
        
        <Divider orientation="left">基础用法</Divider>
        <TagSelect
          value={selectedTags}
          onChange={setSelectedTags}
          suggestions={tagSuggestions}  // 使用 suggestions 而不是 options
          placeholder="添加标签"
          disabled={disabled}
        />
        
        <Divider orientation="left">只读模式</Divider>
        <div className="example">
          <TagSelect
            value={selectedTags}
            onChange={setSelectedTags}
            suggestions={[]}  // 不提供推荐标签，只显示已选标签
            disabled={disabled}
          />
        </div>
        
        <Divider orientation="left">限制显示数量</Divider>
        <div className="example">
          <TagSelect
            value={selectedTags}
            onChange={setSelectedTags}
            suggestions={tagSuggestions}
            maxTags={5}  // 使用 maxTags 而不是 maxTagsShown
            disabled={disabled}
          />
        </div>
        
        <div className="current-value">
          <div>当前选中的标签：</div>
          <div className="json-display">
            {JSON.stringify(selectedTags, null, 2)}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Demo;
