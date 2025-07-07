import React from 'react';
import { Empty as AntEmpty } from 'antd';
import './index.less';

export interface EmptyComponentProps {
  title?: string;
  description?: string;
}

// Type definition that includes static properties
const Empty = AntEmpty as typeof AntEmpty & {
  PRESENTED_IMAGE_SIMPLE: React.ReactNode;
  PRESENTED_IMAGE_DEFAULT: React.ReactNode;
};

const EmptyComponent: React.FC<EmptyComponentProps> = ({
  title,
  description = '暂无数据',
}) => {
  return (
    <div className="empty-component">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <span>
            {title && <div className="empty-title">{title}</div>}
            <div className="empty-description">{description}</div>
          </span>
        }
      />
    </div>
  );
};

export default EmptyComponent;
