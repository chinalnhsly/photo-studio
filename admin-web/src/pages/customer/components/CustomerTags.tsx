import React, { useState, useEffect } from 'react';
import {
  Modal,
  Tag,
  Input,
  Space,
  message,
  Divider,
  Typography,
  Alert,
} from 'antd';
import { PlusOutlined, CheckCircleFilled } from '@ant-design/icons';
import { getCommonTags } from '../../../services/customer';

const { Text } = Typography;

interface CustomerTagsProps {
  visible: boolean;
  customer: any;
  onCancel: () => void;
  onConfirm: (tags: string[]) => void;
}

const CustomerTags: React.FC<CustomerTagsProps> = ({
  visible,
  customer,
  onCancel,
  onConfirm,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [commonTags, setCommonTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (visible && customer) {
      setSelectedTags(customer.tags || []);
      fetchCommonTags();
    }
  }, [visible, customer]);
  
  // 获取常用标签
// 在获取常用标签的方法中调整响应处理
const fetchCommonTags = async () => {
  setLoading(true);
  try {
    const response = await getCommonTags();
    // 添加响应状态检查
    if (response.success) {
      setCommonTags((response.data || []).map(tag => tag.name));
    } else {
      message.error('获取标签列表失败');
    }
  } catch (error) {
    console.error('获取常用标签失败:', error);
    message.error('获取标签列表失败');
  } finally {
    setLoading(false);
  }
};
  
  // 处理标签点击
  const handleTagClick = (tag: string) => {
    const newSelectedTags = [...selectedTags];
    if (newSelectedTags.includes(tag)) {
      // 移除标签
      const index = newSelectedTags.indexOf(tag);
      newSelectedTags.splice(index, 1);
    } else {
      // 添加标签
      newSelectedTags.push(tag);
    }
    
    setSelectedTags(newSelectedTags);
  };
  
  // 处理输入确认
  const handleInputConfirm = () => {
    const trimmedInput = inputValue.trim();
    
    if (trimmedInput && !selectedTags.includes(trimmedInput)) {
      setSelectedTags([...selectedTags, trimmedInput]);
    }
    
    setInputVisible(false);
    setInputValue('');
  };
  
  // 处理标签确认
  const handleOk = () => {
    onConfirm(selectedTags);
  };
  
  // 推荐但未选择的标签
  const unusedCommonTags = commonTags.filter(tag => !selectedTags.includes(tag));
  
  return (
    <Modal
      title={customer ? `管理 ${customer.name} 的标签` : '管理客户标签'}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={520}
      okText="保存"
      cancelText="取消"
    >
      <div className="selected-tags-container">
        <div className="section-title">当前标签</div>
        {selectedTags.length > 0 ? (
          <div className="selected-tags">
            {selectedTags.map(tag => (
              <Tag 
                key={tag} 
                closable 
                onClose={() => handleTagClick(tag)}
                className="selected-tag"
              >
                {tag}
              </Tag>
            ))}
          </div>
        ) : (
          <Text type="secondary" italic>客户暂无标签</Text>
        )}
        
        {inputVisible ? (
          <Input
            type="text"
            size="small"
            style={{ width: 120 }}
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
            className="tag-input"
            placeholder="输入标签名称"
            maxLength={20}
            autoFocus
          />
        ) : (
          <Tag onClick={() => setInputVisible(true)} className="add-tag-button">
            <PlusOutlined /> 新建标签
          </Tag>
        )}
      </div>
      
      <Divider />
      
      {unusedCommonTags.length > 0 && (
        <div className="common-tags-container">
          <div className="section-title">推荐标签</div>
          <div className="common-tags">
            {unusedCommonTags.map(tag => (
              <Tag 
                key={tag}
                className="common-tag"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Tag>
            ))}
          </div>
        </div>
      )}
      
      <Alert
        message="提示：标签可用于客户分组、筛选和营销活动的目标人群选择"
        type="info"
        showIcon
        style={{ marginTop: 16 }}
      />
      
     
    </Modal>
  );
};

export default CustomerTags;
