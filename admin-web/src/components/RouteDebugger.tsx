import React from 'react';
import { Card, Typography, Divider, Tag, Table } from 'antd';
import { useLocation, useRouteMatch } from 'umi';

const { Title, Paragraph, Text } = Typography;

interface RouteDebuggerProps {
  componentName: string;
  expectedPath: string;
}

/**
 * 路由调试组件 - 用于检测路由问题
 */
const RouteDebugger: React.FC<RouteDebuggerProps> = ({ componentName, expectedPath }) => {
  const location = useLocation();
  const match = useRouteMatch();
  
  const routeInfo = [
    { key: 'component', label: '当前组件', value: componentName },
    { key: 'pathname', label: '当前路径', value: location.pathname },
    { key: 'expected', label: '期望路径', value: expectedPath },
    { key: 'params', label: '路由参数', value: JSON.stringify(match.params || {}) },
    { key: 'query', label: '查询参数', value: JSON.stringify(location.query || {}) },
  ];

  return (
    <Card>
      <Title level={4}>路由调试信息</Title>
      <Paragraph>
        <Tag color="green">组件已成功加载</Tag>
      </Paragraph>
      <Divider />
      
      <Table 
        dataSource={routeInfo}
        columns={[
          { title: '属性', dataIndex: 'label', key: 'label' },
          { title: '值', dataIndex: 'value', key: 'value' }
        ]}
        pagination={false}
        size="small"
      />
      
      <Divider />
      <Paragraph>
        <Text type="secondary">
          如果您看到此页面，说明路由配置正确但组件内容可能有问题。请确保对应的页面组件存在且正确导出。
        </Text>
      </Paragraph>
    </Card>
  );
};

export default RouteDebugger;
