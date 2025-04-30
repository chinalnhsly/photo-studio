/**
 * 此文件修复 Ant Design 组件在 TypeScript 中的类型问题
 * 解决"不能用作 JSX 组件。其返回类型 ReactNode 不是有效的 JSX 元素"错误
 */
import React from 'react';
import 'antd';

declare module 'antd' {
  // 修复布局组件
  export const Row: React.FC<any>;
  export const Col: React.FC<any>;
  export const Layout: React.FC<any> & {
    Header: React.FC<any>;
    Content: React.FC<any>;
    Footer: React.FC<any>;
    Sider: React.FC<any>;
  };

  // 修复表单组件
  export const Form: React.FC<any> & {
    Item: React.FC<any>;
    List: React.FC<any>;
    useForm: any;
  };
  export const Input: React.FC<any> & {
    TextArea: React.FC<any>;
    Search: React.FC<any>;
    Password: React.FC<any>;
    Group: React.FC<any>;
  };
  export const Select: React.FC<any> & {
    Option: React.FC<any>;
    OptGroup: React.FC<any>;
  };
  export const Checkbox: React.FC<any> & {
    Group: React.FC<any>;
  };
  export const Radio: React.FC<any> & {
    Group: React.FC<any>;
    Button: React.FC<any>;
  };
  export const Cascader: React.FC<any>;
  export const Switch: React.FC<any>;
  export const Upload: React.FC<any>;
  export const Rate: React.FC<any>;
  export const Slider: React.FC<any>;
  export const InputNumber: React.FC<any>;
  export const DatePicker: React.FC<any> & {
    RangePicker: React.FC<any>;
    MonthPicker: React.FC<any>;
    WeekPicker: React.FC<any>;
  };
  export const TimePicker: React.FC<any>;
  export const Transfer: React.FC<any>;
  export const TreeSelect: React.FC<any>;
  export const Mentions: React.FC<any>;

  // 修复数据展示组件
  export const Table: React.FC<any> & {
    Column: React.FC<any>;
    ColumnGroup: React.FC<any>;
    Summary: React.FC<any> & {
      Row: React.FC<any>;
      Cell: React.FC<any>;
    };
  };
  export const Tabs: React.FC<any> & {
    TabPane: React.FC<any>;
  };
  export const Tag: React.FC<any>;
  export const Card: React.FC<any> & {
    Meta: React.FC<any>;
    Grid: React.FC<any>;
  };
  export const Calendar: React.FC<any>;
  export const Badge: React.FC<any>;
  export const Descriptions: React.FC<any> & {
    Item: React.FC<any>;
  };
  export const Avatar: React.FC<any> & {
    Group: React.FC<any>;
  };
  export const List: React.FC<any> & {
    Item: React.FC<any> & {
      Meta: React.FC<any>;
    };
  };
  export const Statistic: React.FC<any> & {
    Countdown: React.FC<any>;
  };
  export const Timeline: React.FC<any> & {
    Item: React.FC<any>;
  };
  export const Tooltip: React.FC<any>;
  export const Comment: React.FC<any>;
  export const Image: React.FC<any> & {
    PreviewGroup: React.FC<any>;
  };

  // 修复导航组件
  export const Menu: React.FC<any> & {
    Item: React.FC<any>;
    SubMenu: React.FC<any>;
    ItemGroup: React.FC<any>;
    Divider: React.FC<any>;
  };
  export const Dropdown: React.FC<any>;
  export const Pagination: React.FC<any>;
  export const Steps: React.FC<any> & {
    Step: React.FC<any>;
  };
  export const Breadcrumb: React.FC<any> & {
    Item: React.FC<any>;
    Separator: React.FC<any>;
  };

  // 修复反馈组件
  export const Alert: React.FC<any>;
  export const Modal: React.FC<any> & {
    confirm: any;
    info: any;
    success: any;
    error: any;
    warning: any;
  };
  export const Drawer: React.FC<any>;
  export const Spin: React.FC<any>;
  export const Progress: React.FC<any>;
  export const Result: React.FC<any>;
  export const Skeleton: React.FC<any> & {
    Avatar: React.FC<any>;
    Title: React.FC<any>;
    Paragraph: React.FC<any>;
    Button: React.FC<any>;
    Input: React.FC<any>;
  };
  export const Empty: React.FC<any>;
  export const Popconfirm: React.FC<any>;
  export const Popover: React.FC<any>;
  export const message: any;
  export const notification: any;

  // 修复其他组件
  export const Button: React.FC<any>;
  export const Space: React.FC<any>;
  export const Divider: React.FC<any>;
  export const Typography: React.FC<any> & {
    Title: React.FC<any>;
    Paragraph: React.FC<any>;
    Text: React.FC<any>;
    Link: React.FC<any>;
  };
  export const ConfigProvider: React.FC<any>;
}

// 修复图标组件
declare module '@ant-design/icons' {
  const IconComponent: React.FC<any>;
  export default IconComponent;
  
  // 修复常用图标
  export const UserOutlined: React.FC<any>;
  export const HomeOutlined: React.FC<any>;
  export const SettingOutlined: React.FC<any>;
  export const PlusOutlined: React.FC<any>;
  export const LoadingOutlined: React.FC<any>;
  export const EditOutlined: React.FC<any>;
  export const DeleteOutlined: React.FC<any>;
  export const SearchOutlined: React.FC<any>;
  export const DownloadOutlined: React.FC<any>;
  export const UploadOutlined: React.FC<any>;
  export const ArrowLeftOutlined: React.FC<any>;
  export const ArrowRightOutlined: React.FC<any>;
  export const ArrowUpOutlined: React.FC<any>;
  export const ArrowDownOutlined: React.FC<any>;
  export const CheckCircleOutlined: React.FC<any>;
  export const CloseCircleOutlined: React.FC<any>;
  export const InfoCircleOutlined: React.FC<any>;
  export const ExclamationCircleOutlined: React.FC<any>;
  export const QuestionCircleOutlined: React.FC<any>;
  export const MenuFoldOutlined: React.FC<any>;
  export const MenuUnfoldOutlined: React.FC<any>;
  export const FileOutlined: React.FC<any>;
  export const FolderOutlined: React.FC<any>;
  export const PictureOutlined: React.FC<any>;
  export const CalendarOutlined: React.FC<any>;
  export const StarOutlined: React.FC<any>;
  export const StarFilled: React.FC<any>;
  export const LikeOutlined: React.FC<any>;
  export const LikeFilled: React.FC<any>;
  export const PhoneOutlined: React.FC<any>;
  export const MailOutlined: React.FC<any>;
  export const TeamOutlined: React.FC<any>;
  export const ShopOutlined: React.FC<any>;
  export const BookOutlined: React.FC<any>;
  export const CameraOutlined: React.FC<any>;
  export const EyeOutlined: React.FC<any>;
  export const EyeInvisibleOutlined: React.FC<any>;
  export const CloseOutlined: React.FC<any>;
  export const CheckOutlined: React.FC<any>;
  export const ScheduleOutlined: React.FC<any>;
  export const BellOutlined: React.FC<any>;
  export const MessageOutlined: React.FC<any>;
  export const EnvironmentOutlined: React.FC<any>;
  export const ShareAltOutlined: React.FC<any>;
  export const LockOutlined: React.FC<any>;
  export const UnlockOutlined: React.FC<any>;
  export const CopyOutlined: React.FC<any>;
  export const ReloadOutlined: React.FC<any>;
  export const MoreOutlined: React.FC<any>;
  export const TrophyOutlined: React.FC<any>;
  export const FileImageOutlined: React.FC<any>;
  export const QrcodeOutlined: React.FC<any>;
}

// 修复 React Router 组件
declare module 'react-router-dom' {
  export const Link: React.FC<any>;
  export const NavLink: React.FC<any>;
}

// 修复 UMI 组件
declare module 'umi' {
  export const Link: React.FC<any>;
}
