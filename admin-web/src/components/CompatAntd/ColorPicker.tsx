import React from 'react';
import { Popover, Input, Tooltip } from 'antd';
import { SketchPicker } from 'react-color';

/**
 * 兼容 antd 5.x 的 ColorPicker 组件
 * 为 @ant-design/pro-field 提供兼容性支持
 */
export interface ColorPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  showText?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  format?: 'hex' | 'rgb' | 'hsb';
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  value = '#1890ff', 
  onChange, 
  showText = false,
  disabled = false,
}) => {
  const [color, setColor] = React.useState(value);
  const [visible, setVisible] = React.useState(false);
  
  const handleChange = (color: any) => {
    const newColor = color.hex;
    setColor(newColor);
    onChange?.(newColor);
  };
  
  const content = (
    <div onClick={e => e.stopPropagation()}>
      <SketchPicker
        color={color}
        onChange={handleChange}
        disableAlpha
      />
    </div>
  );
  
  return (
    <Popover
      content={content}
      trigger="click"
      visible={disabled ? false : visible}
      onVisibleChange={setVisible}
    >
      <Tooltip title={disabled ? "禁用状态" : color}>
        <div style={{ display: 'inline-flex', alignItems: 'center', cursor: disabled ? 'not-allowed' : 'pointer' }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 4,
              background: color,
              boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
              opacity: disabled ? 0.5 : 1
            }}
          />
            {showText && (
            <Input
              style={{ width: 80, marginLeft: 8 }}
              value={color}
              disabled={disabled}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newColor: string = e.target.value;
              setColor(newColor);
              onChange?.(newColor);
              }}
            />
            )}
        </div>
      </Tooltip>
    </Popover>
  );
};

export default ColorPicker;
