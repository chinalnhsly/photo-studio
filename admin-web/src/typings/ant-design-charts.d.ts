// 为 @ant-design/charts 创建类型声明
declare module '@ant-design/charts' {
  export interface LineConfig {
    data: any[];
    xField: string;
    yField: string;
    seriesField?: string;
    height?: number;
    yAxis?: {
      title?: {
        text: string;
      };
    };
    legend?: {
      position?: 'left' | 'top' | 'bottom' | 'right' | 
        'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' |
        'right-top' | 'right-bottom' | 'left-top' | 'left-bottom';
    };
    smooth?: boolean;
    animation?: {
      appear?: {
        animation?: string;
        duration?: number;
      };
    };
    point?: {
      size?: number;
      shape?: string;
      style?: {
        stroke?: string;
        lineWidth?: number;
      };
    };
  }

  export interface PieConfig {
    data: Array<{ type: string; value: number }>;
    angleField: string;
    colorField: string;
    radius?: number;
    height?: number;
    appendPadding?: number;
    label?: {
      type?: string;
      content?: string;
    };
    interactions?: Array<{ type: string }>;
    legend?: {
      position?: 'left' | 'top' | 'bottom' | 'right' | 
        'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' |
        'right-top' | 'right-bottom' | 'left-top' | 'left-bottom';
    };
    pieStyle?: {
      lineWidth?: number;
    };
  }

  export interface ColumnConfig {
    data: any[];
    xField: string;
    yField: string;
    height?: number;
    label?: {
      position?: string;
      style?: {
        fill?: string;
        opacity?: number;
      };
    };
    meta?: {
      [key: string]: {
        alias?: string;
      };
    };
    color?: string;
  }

  export class Line extends React.Component<LineConfig> {}
  export class Pie extends React.Component<PieConfig> {}
  export class Column extends React.Component<ColumnConfig> {}
}
