import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Steps,
  Button,
  Select,
  DatePicker,
  Input,
  Row,
  Col,
  Radio,
  Space,
  Divider,
  TimePicker,
  Avatar,
  Tag,
  Typography,
  message,
  Spin,
  Alert,
  InputNumber,
  Checkbox,
  Popover,
  Empty,
  Result,
  Modal,
  Descriptions
} from 'antd';
//import type { FilterOptionConfig, OptionFilterProp } from 'antd/lib/select';
import {
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  ShopOutlined,
  CameraOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  LoadingOutlined,
  QuestionCircleOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useParams, useLocation } from 'umi';
import { history } from '../../utils/compatibility';
import moment from 'moment';
import { 
  checkAvailability, 
  createBooking, 
  getBookingDetail, 
  updateBooking,
  getAvailableTimeslots,
  BookingDetailResponse, 
  AvailableTimeslotsResponse, 
  AvailabilityCheckResponse,
  CreateBookingResponse
} from '../../services/booking';
import './BookingForm.scss';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { RangePicker } = TimePicker  as any;

// 预约创建/编辑表单
const BookingForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const [form] = Form.useForm();
  const queryParams = new URLSearchParams(location.search);
  const initialCustomerId = queryParams.get('customerId');
  const initialPhotographerId = queryParams.get('photographerId');
  const initialStudioId = queryParams.get('studioId');
  const initialDate = queryParams.get('date');
  
  const isEdit = !!id;
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  interface Customer {
    id: number;
    name: string;
    phoneNumber: string;
    email: string;
    avatar: null | string;
  }
  
  const [customerSearchResults, setCustomerSearchResults] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerSearchLoading, setCustomerSearchLoading] = useState(false);
  interface Photographer {
    id: number;
    name: string;
    specialty: string[];
    rating: number;
    avatar: null | string;
  }
  
  const [photographerOptions, setPhotographerOptions] = useState<Photographer[]>([]);
  interface Studio {
    id: number;
    name: string;
    address: string;
    equipments: string[];
  }
  
  const [studioOptions, setStudioOptions] = useState<Studio[]>([]);
  const [photographerLoading, setPhotographerLoading] = useState(false);
  const [studioLoading, setStudioLoading] = useState(false);
  interface AvailableTimeslot {
    isAvailable: boolean;
    startTime: string;
    endTime: string;
    // Add other properties used in your code if needed
  }
  
  const [availableTimeSlots, setAvailableTimeSlots] = useState<AvailableTimeslot[]>([]);
  const [timeSlotLoading, setTimeSlotLoading] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'available' | 'conflict' | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  interface Conflict {
    type: string;
    startTime: string;
    endTime: string;
  }
  
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [shootingTypeOptions, setShootingTypeOptions] = useState([
    '个人写真', '婚纱摄影', '全家福', '儿童摄影', '商业摄影', '活动拍摄', '证件照'
  ]);
  interface Package {
    id: number;
    name: string;
    description: string;
    price: number;
    shootingTypes: string[];
    duration: number;
    includedServices: string[];
  }
  
  const [packageOptions, setPackageOptions] = useState<Package[]>([]);
  const [packageLoading, setPackageLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [priceDetails, setPriceDetails] = useState({
    basePrice: 0,
    additionalFees: 0,
    discountAmount: 0,
    totalPrice: 0
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [bookingCreated, setBookingCreated] = useState(false);
  const [bookingNumber, setBookingNumber] = useState('');

  // 初始化加载
  useEffect(() => {
    if (isEdit) {
      fetchBookingDetail();
    } else {
      fetchInitialData();
    }
  }, []);

  // 当日期或摄影师或工作室变化时，更新可用时间段
  useEffect(() => {
    const { date, photographerId, studioId } = form.getFieldsValue(['date', 'photographerId', 'studioId']);
    
    if (date && photographerId && studioId) {
      fetchAvailableTimeSlots(date.format('YYYY-MM-DD'), photographerId, studioId);
    }
  }, [form.getFieldValue('date'), form.getFieldValue('photographerId'), form.getFieldValue('studioId')]);

  // 获取初始数据
  const fetchInitialData = async () => {
    setLoading(true);
    
    try {
      // 加载摄影师数据
      await fetchPhotographers();
      
      // 加载工作室数据
      await fetchStudios();
      
      // 加载套餐数据
      await fetchPackages();
      
      // 如果有URL参数，设置初始值
      if (initialCustomerId) {
        await fetchCustomerById(initialCustomerId);
      }
      
      const initialFormValues: any = {};
      
      if (initialPhotographerId) {
        initialFormValues.photographerId = Number(initialPhotographerId);
      }
      
      if (initialStudioId) {
        initialFormValues.studioId = Number(initialStudioId);
      }
      
      if (initialDate) {
        initialFormValues.date = moment(initialDate);
      } else {
        // 默认选择明天日期
        initialFormValues.date = moment().add(1, 'days');
      }
      
      form.setFieldsValue(initialFormValues);
      
      // 如果有初始摄影师、工作室和日期，获取可用时间段
      if (initialPhotographerId && initialStudioId && initialFormValues.date) {
        fetchAvailableTimeSlots(
          initialFormValues.date.format('YYYY-MM-DD'), 
          Number(initialPhotographerId), 
          Number(initialStudioId)
        );
      }
    } catch (error) {
      console.error('加载初始数据失败', error);
      message.error('初始化数据加载失败，请刷新页面重试');
    } finally {
      setLoading(false);
    }
  };

  // 获取预约详情
  const fetchBookingDetail = async () => {
    setLoading(true);
    try {
      const response: BookingDetailResponse = await getBookingDetail(Number(id));
      const bookingData = response.data;
      
      // 设置选中的客户
      setSelectedCustomer({
        id: bookingData.customerId,
        name: bookingData.customerName,
        phoneNumber: bookingData.customerPhone,
        email: bookingData.customerEmail,
        avatar: bookingData.customerAvatar,
      });
      
      // 加载摄影师和工作室选项
      await Promise.all([
        fetchPhotographers(),
        fetchStudios(),
        fetchPackages()
      ]);
      
      // 设置表单值
      form.setFieldsValue({
        customerId: bookingData.customerId,
        photographerId: bookingData.photographerId,
        studioId: bookingData.studioId,
        date: moment(bookingData.date),
        timeRange: [
          moment(bookingData.startTime, 'HH:mm'), 
          moment(bookingData.endTime, 'HH:mm')
        ],
        shootingType: bookingData.shootingType,
        packageId: bookingData.packageId,
        notes: bookingData.notes,
        staffNotes: bookingData.staffNotes,
      });
      
      // 如果有套餐，设置选中的套餐
      if (bookingData.packageId) {
        const packageInfo = packageOptions.find(pkg => pkg.id === bookingData.packageId);
        if (packageInfo) {
          setSelectedPackage(packageInfo);
          calculatePrice(packageInfo);
        }
      }
      
      // 获取可用时间段
      if (bookingData.date && bookingData.photographerId && bookingData.studioId) {
        fetchAvailableTimeSlots(
          bookingData.bookingDate || bookingData.date, 
          bookingData.photographerId, 
          bookingData.studioId
        );
      }
      
    } catch (error) {
      console.error('获取预约详情失败', error);
      message.error('无法加载预约详情，请刷新页面重试');
    } finally {
      setLoading(false);
    }
  };

  // 获取所有摄影师
  const fetchPhotographers = async () => {
    setPhotographerLoading(true);
    try {
      // 模拟API调用，获取摄影师列表
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 示例数据
      const mockPhotographers = [
        { id: 1, name: '李明', specialty: ['婚纱摄影', '写真摄影'], rating: 4.8, avatar: null },
        { id: 2, name: '王哲', specialty: ['儿童摄影', '全家福'], rating: 4.7, avatar: null },
        { id: 3, name: '张艺', specialty: ['商业摄影', '形象照'], rating: 4.9, avatar: null },
        { id: 4, name: '赵勇', specialty: ['婚纱摄影', '活动拍摄'], rating: 4.6, avatar: null },
      ];
      
      setPhotographerOptions(mockPhotographers);
    } catch (error) {
      console.error('获取摄影师失败', error);
      message.error('获取摄影师列表失败');
    } finally {
      setPhotographerLoading(false);
    }
  };

  // 获取所有工作室
  const fetchStudios = async () => {
    setStudioLoading(true);
    try {
      // 模拟API调用，获取工作室列表
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 示例数据
      const mockStudios = [
        { id: 1, name: '阳光摄影工作室', address: '北京市海淀区中关村大街1号', equipments: ['背景布', '柔光灯', '反光板'] },
        { id: 2, name: '星空摄影基地', address: '北京市朝阳区建国路88号', equipments: ['专业闪光灯', '大型摄影棚', '水下摄影设备'] },
        { id: 3, name: '艺术空间摄影', address: '北京市西城区西单北大街120号', equipments: ['复古场景', '自然光摄影区', '中式风格布景'] },
      ];
      
      setStudioOptions(mockStudios);
    } catch (error) {
      console.error('获取工作室失败', error);
      message.error('获取工作室列表失败');
    } finally {
      setStudioLoading(false);
    }
  };

  // 获取套餐列表
  const fetchPackages = async () => {
    setPackageLoading(true);
    try {
      // 模拟API调用，获取套餐列表
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 示例数据
      const mockPackages = [
        {
          id: 1,
          name: '基础写真套餐',
          description: '1小时拍摄，10张精修照片，提供电子版',
          price: 599,
          shootingTypes: ['个人写真'],
          duration: 60, // 分钟
          includedServices: ['10张精修照片', '提供电子版'],
        },
        {
          id: 2,
          name: '标准婚纱套餐',
          description: '3小时拍摄，30张精修照片，提供电子版和相册',
          price: 1999,
          shootingTypes: ['婚纱摄影'],
          duration: 180, // 分钟
          includedServices: ['30张精修照片', '提供电子版', '精美相册一本'],
        },
        {
          id: 3,
          name: '豪华全家福套餐',
          description: '2小时拍摄，20张精修照片，提供电子版和相框',
          price: 1299,
          shootingTypes: ['全家福'],
          duration: 120, // 分钟
          includedServices: ['20张精修照片', '提供电子版', '精美相框一个'],
        },
        {
          id: 4,
          name: '儿童成长记录套餐',
          description: '1.5小时拍摄，15张精修照片，提供电子版',
          price: 799,
          shootingTypes: ['儿童摄影'],
          duration: 90, // 分钟
          includedServices: ['15张精修照片', '提供电子版', '儿童玩具道具'],
        },
      ];
      
      setPackageOptions(mockPackages);
    } catch (error) {
      console.error('获取套餐列表失败', error);
      message.error('获取套餐列表失败');
    } finally {
      setPackageLoading(false);
    }
  };

  // 通过ID获取客户
  const fetchCustomerById = async (customerId: string) => {
    setCustomerSearchLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 示例数据
      const mockCustomer = {
        id: Number(customerId),
        name: '张小明',
        phoneNumber: '13800138000',
        email: 'zhangxm@example.com',
        avatar: null,
        memberLevel: 'gold',
        birthday: '1990-01-15',
        tags: ['重要客户', '婚纱客户']
      };
      
      setSelectedCustomer(mockCustomer);
      
      // 设置客户ID到表单
      form.setFieldsValue({ customerId: Number(customerId) });
      
    } catch (error) {
      console.error('获取客户信息失败', error);
      message.error('获取客户信息失败');
    } finally {
      setCustomerSearchLoading(false);
    }
  };

  // 搜索客户
  const handleSearchCustomer = async (value: string) => {
    if (!value || value.length < 2) {
      setCustomerSearchResults([]);
      return;
    }
    
    setCustomerSearchLoading(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 示例数据
      const mockResults = [
        { id: 101, name: '张小明', phoneNumber: '13800138000', email: 'zhangxm@example.com', avatar: null },
        { id: 102, name: '李明', phoneNumber: '13900139000', email: 'liming@example.com', avatar: null },
        { id: 103, name: '王小红', phoneNumber: '13700137000', email: 'wangxh@example.com', avatar: null },
      ].filter(item => 
        item.name.includes(value) || 
        item.phoneNumber.includes(value) || 
        item.email.includes(value)
      );
      
      setCustomerSearchResults(mockResults);
    } catch (error) {
      console.error('搜索客户失败', error);
      message.error('搜索客户失败');
    } finally {
      setCustomerSearchLoading(false);
    }
  };

  // 选择客户
  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    form.setFieldsValue({ customerId: customer.id });
    setCustomerSearchResults([]);
  };

  // 创建新客户
  const handleCreateCustomer = () => {
    // 跳转到创建客户页面
    history.push('/customer/add');
  };

  // 重置客户选择
  const handleResetCustomer = () => {
    setSelectedCustomer(null);
    form.setFieldsValue({ customerId: undefined });
  };

  // 获取可用时间段
  const fetchAvailableTimeSlots = async (date: string, photographerId: number, studioId: number) => {
    if (!date || !photographerId || !studioId) return;
    
    setTimeSlotLoading(true);
    try {
      const response: AvailableTimeslotsResponse = await getAvailableTimeslots({
        date,
        photographerId,
        studioId
      });
      
      // 确保类型兼容
      const slots: AvailableTimeslot[] = response.data.timeSlots.map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: slot.available,
        photographerId: slot.photographerId,
        photographerName: slot.photographerName
      }));
      setAvailableTimeSlots(slots);
    } catch (error) {
      console.error('获取可用时间段失败', error);
      message.error('获取可用时间段失败');
      setAvailableTimeSlots([]);
    } finally {
      setTimeSlotLoading(false);
    }
  };

  // 选择时间段
  const handleSelectTimeSlot = (slot: any) => {
    if (slot.isAvailable) {
      setSelectedTimeSlot(slot);
      form.setFieldsValue({
        timeRange: [moment(slot.startTime, 'HH:mm'), moment(slot.endTime, 'HH:mm')]
      });
    }
  };

  // 检查可用性
  const handleCheckAvailability = async () => {
    const formValues = await form.validateFields([
      'date', 
      'photographerId', 
      'studioId', 
      'timeRange'
    ]);
    
    if (!formValues) return;
    
    setAvailabilityLoading(true);
    
    try {
      const checkResult: AvailabilityCheckResponse = await checkAvailability({
        date: formValues.date.format('YYYY-MM-DD'),
        photographerId: formValues.photographerId,
        studioId: formValues.studioId,
        startTime: formValues.timeRange[0].format('HH:mm'),
        endTime: formValues.timeRange[1].format('HH:mm'),
        ...(isEdit ? { bookingId: Number(id) } : {})
      });
      
      setAvailabilityChecked(true);
      
      if (checkResult.data.available) {
        setAvailabilityStatus('available');
        setConflicts([]);
      } else {
        message.error(`预约时间冲突: ${checkResult.data.conflictReason || '选择的时间已被预订'}`);
        setAvailabilityStatus('conflict');
        // 正确处理冲突数据
        const conflictData: Conflict[] = checkResult.data.alternativeTimeSlots 
          ? checkResult.data.alternativeTimeSlots.flatMap(alt => 
              alt.timeSlots.map(slot => ({
                type: 'time',
                startTime: slot.startTime,
                endTime: slot.endTime
              }))
            )
          : [];
        setConflicts(conflictData);
      }
    } catch (error) {
      console.error('检查可用性失败', error);
      message.error('检查可用性失败');
      setAvailabilityChecked(false);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  // 选择套餐
  const handleSelectPackage = (packageId: number) => {
    const selectedPkg = packageOptions.find(pkg => pkg.id === packageId);
    setSelectedPackage(selectedPkg ?? null);
    calculatePrice(selectedPkg);
    
    // 如果套餐中指定了拍摄类型，自动选择
    if (selectedPkg && selectedPkg.shootingTypes && selectedPkg.shootingTypes.length === 1) {
      form.setFieldsValue({ shootingType: selectedPkg.shootingTypes[0] });
    }
  };

  // 计算价格
  const calculatePrice = (packageInfo: any) => {
    if (!packageInfo) {
      setPriceDetails({
        basePrice: 0,
        additionalFees: 0,
        discountAmount: 0,
        totalPrice: 0
      });
      return;
    }
    
    const basePrice = packageInfo.price;
    const additionalFees = 0; // 可以根据各种条件计算附加费用
    const discountAmount = 0; // 可以根据会员等级、优惠券等计算折扣
    const totalPrice = basePrice + additionalFees - discountAmount;
    
    setPriceDetails({
      basePrice,
      additionalFees,
      discountAmount,
      totalPrice
    });
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const submitData = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        startTime: values.timeRange[0].format('HH:mm'),
        endTime: values.timeRange[1].format('HH:mm'),
        totalPrice: priceDetails.totalPrice
      };
      
      setSubmitting(true);
      
      if (isEdit) {
        await updateBooking(Number(id), submitData);
        message.success('预约更新成功');
        history.push(`/booking/detail/${id}`);
      } else {
        const response: CreateBookingResponse = await createBooking(submitData);
        message.success('预约创建成功');
        setFormSubmitted(true);
        setBookingCreated(true);
        setBookingNumber(response.data.bookingNumber);
      }
    } catch (error) {
      console.error('提交预约失败', error);
      message.error('提交失败，请检查表单内容');
    } finally {
      setSubmitting(false);
    }
  };

  // 前一步
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // 下一步
  const nextStep = async () => {
    try {
      if (currentStep === 0) {
        // 验证客户信息
        await form.validateFields(['customerId']);
      } else if (currentStep === 1) {
        // 验证预约时间和资源
        await form.validateFields(['date', 'photographerId', 'studioId', 'timeRange']);
        
        // 检查可用性
        if (!availabilityChecked || availabilityStatus !== 'available') {
          await handleCheckAvailability();
          
          // 如果检查后依然有冲突，阻止前进
          if (availabilityStatus === 'conflict') {
            return;
          }
        }
      } else if (currentStep === 2) {
        // 验证服务信息
        await form.validateFields(['shootingType', 'packageId']);
      }
      
      // 进入下一步
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('表单验证失败', error);
    }
  };

  // 渲染步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderCustomerStep();
      case 1:
        return renderTimeResourceStep();
      case 2:
        return renderServiceStep();
      case 3:
        return renderReviewStep();
      case 4:
        return renderSuccessStep();
      default:
        return null;
    }
  };

  // 客户信息步骤
  const renderCustomerStep = () => {
    return (
      <div className="customer-form">
        <Form.Item
          name="customerId"
          label="选择客户"
          rules={[{ required: true, message: '请选择客户' }]}
          style={{ display: 'none' }}
        >
          <Input type="hidden" />
        </Form.Item>
        
        {selectedCustomer ? (
          <div className="selected-customer">
            <div className="customer-info">
              <Avatar 
                size={64} 
                icon={<UserOutlined />} 
                src={selectedCustomer.avatar}
              />
              <div className="customer-details">
                <div className="customer-name">{selectedCustomer.name}</div>
                <div className="customer-contacts">
                  <div><PhoneOutlined /> {selectedCustomer.phoneNumber}</div>
                  {selectedCustomer.email && <div><MailOutlined /> {selectedCustomer.email}</div>}
                </div>
              </div>
            </div>
            <Button 
              onClick={handleResetCustomer}
              icon={<CloseOutlined />}
            >
              重新选择
            </Button>
          </div>
        ) : (
          <div className="customer-selection">
            <div className="empty-selection">
              <div className="empty-icon"><UserOutlined /></div>
              <div className="empty-text">请搜索并选择客户</div>
            </div>
            
            <div className="customer-search">
              <Input.Search
                placeholder="输入客户姓名或手机号搜索"
                enterButton
                loading={customerSearchLoading}
                onSearch={handleSearchCustomer}
                style={{ width: 300 }}
              />
              
              <div className="search-results">
                {customerSearchLoading && (
                  <div className="loading-container">
                    <Spin />
                  </div>
                )}
                
                {!customerSearchLoading && customerSearchResults.length > 0 && (
                  <div className="customer-list">
                    {customerSearchResults.map(customer => (
                      <div 
                        key={customer.id} 
                        className="customer-item"
                        onClick={() => handleSelectCustomer(customer)}
                      >
                        <Avatar icon={<UserOutlined />} src={customer.avatar} />
                        <div className="customer-info">
                          <div className="customer-name">{customer.name}</div>
                          <div className="customer-phone">{customer.phoneNumber}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {!customerSearchLoading && customerSearchResults.length === 0 && (
                  <div className="no-results">
                    <Empty 
                      description="未找到客户" 
                    />
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={handleCreateCustomer}
                      style={{ marginTop: 16 }}
                    >
                      创建新客户
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 时间与资源步骤
  const renderTimeResourceStep = () => {
    return (
      <div className="time-resource-form">
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="date"
              label="预约日期"
              rules={[{ required: true, message: '请选择预约日期' }]}
            >
              <DatePicker 
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              disabledDate={(current: moment.Moment | null): boolean => {
                // 不能选择今天之前的日期
                return Boolean(current && current < moment().startOf('day'));
              }}
              placeholder="选择预约日期"
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="photographerId"
              label="摄影师"
              rules={[{ required: true, message: '请选择摄影师' }]}
            >
                <Select 
                placeholder="选择摄影师" 
                loading={photographerLoading}
                showSearch
                filterOption={(input: string, option: any) => {
                  const optionText = typeof option === 'string' ? option : (option.label as string);
                  return optionText.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                >
                {photographerOptions.map((photographer: Photographer) => (
                  <Option key={photographer.id} value={photographer.id}>
                  {photographer.name}
                  </Option>
                ))}
                </Select>
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="studioId"
              label="工作室"
              rules={[{ required: true, message: '请选择工作室' }]}
            >
              <Select 
                placeholder="选择工作室" 
                loading={studioLoading}
                showSearch
                filterOption={(input: string, option: any) => {
                  const optionText = typeof option === 'string' ? option : (option.label as string);
                  return optionText.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
              >
                {studioOptions.map(studio => (
                  <Option key={studio.id} value={studio.id}>
                    {studio.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        {/* 显示可用时间段 */}
        <div className="available-slots">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="section-title">可用时间段</div>
            {timeSlotLoading && <Spin size="small" />}
          </div>
          
          {!timeSlotLoading && availableTimeSlots.length > 0 && (
            <div className="time-slots">
              {availableTimeSlots.map((slot, index) => (
                <Tag
                  key={index}
                  color={slot.isAvailable ? 'blue' : 'default'}
                  onClick={() => handleSelectTimeSlot(slot)}
                  style={{ 
                    cursor: slot.isAvailable ? 'pointer' : 'not-allowed',
                    opacity: slot.isAvailable ? 1 : 0.5
                  }}
                >
                  {slot.startTime}-{slot.endTime}
                </Tag>
              ))}
            </div>
          )}
          
      {!timeSlotLoading && availableTimeSlots.length === 0 && (
        <Empty
          description="无可用时间段" 
        />
      )}
        </div>
        
        <Form.Item
          name="timeRange"
          label="预约时间段"
          rules={[{ required: true, message: '请选择预约时间段' }]}
        >
          <RangePicker 
            format="HH:mm"
            style={{ width: '100%' }}
            minuteStep={15}
            placeholder={['开始时间', '结束时间']}
          />
        </Form.Item>
        
        {/* 可用性检查结果 */}
        <div className="availability-section">
          <Button 
            type="primary" 
            onClick={handleCheckAvailability}
            loading={availabilityLoading}
            icon={<CheckCircleOutlined />}
          >
            检查可用性
          </Button>
          
          {availabilityChecked && (
            <div className="availability-result">
              {availabilityStatus === 'available' ? (
                <Alert 
                  message="所选时间段可预约" 
                  type="success" 
                  showIcon 
                />
              ) : (
                <Alert 
                  message="所选时间段存在冲突" 
                  description={
                    <div className="conflicts-list">
                      {conflicts.map((conflict, index) => (
                        <div key={index} className="conflict-item">
                          <div className="conflict-type">
                            {conflict.type === 'photographer' ? '摄影师时间冲突' : '工作室时间冲突'}
                          </div>
                          <div>已被预约: {conflict.startTime} - {conflict.endTime}</div>
                        </div>
                      ))}
                    </div>
                  }
                  type="error" 
                  showIcon 
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // 服务信息步骤
  const renderServiceStep = () => {
    return (
      <div className="service-form">
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="shootingType"
              label="拍摄类型"
              rules={[{ required: true, message: '请选择拍摄类型' }]}
            >
              <Select placeholder="选择拍摄类型">
                {shootingTypeOptions.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12}>
            <Form.Item
              name="packageId"
              label="选择套餐"
              rules={[{ required: true, message: '请选择套餐' }]}
            >
              <Select 
                placeholder="选择套餐"
                onChange={handleSelectPackage}
                loading={packageLoading}
              >
                {packageOptions.map(pkg => (
                  <Option key={pkg.id} value={pkg.id}>
                    {pkg.name} - ¥{pkg.price}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        {/* 套餐详情 */}
        {selectedPackage && (
          <div className="package-details">
            <div className="package-name">{selectedPackage.name}</div>
            <div className="package-description">{selectedPackage.description}</div>
            <div className="package-included">
              <div className="section-title">包含内容:</div>
              <ul className="included-list">
                {selectedPackage.includedServices.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        <Divider />
        
        {/* 价格详情 */}
        <div className="price-details">
          <div className="price-item">
            <span className="price-label">基础价格</span>
            <span className="price-value">¥{priceDetails.basePrice.toFixed(2)}</span>
          </div>
          {priceDetails.additionalFees > 0 && (
            <div className="price-item">
              <span className="price-label">附加费用</span>
              <span className="price-value">¥{priceDetails.additionalFees.toFixed(2)}</span>
            </div>
          )}
          {priceDetails.discountAmount > 0 && (
            <div className="price-item discount">
              <span className="price-label">优惠金额</span>
              <span className="price-value">-¥{priceDetails.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="price-item total">
            <span className="price-label">总计</span>
            <span className="price-value">¥{priceDetails.totalPrice.toFixed(2)}</span>
          </div>
        </div>
        
        <Divider />
        
        {/* 备注 */}
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              name="notes"
              label="客户备注"
            >
              <TextArea 
                rows={4}
                placeholder="请输入客户特殊需求或其他备注"
              />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              name="staffNotes"
              label="内部备注"
            >
              <TextArea 
                rows={4}
                placeholder="供工作人员查看的内部备注"
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  };

  // 确认步骤
  const renderReviewStep = () => {
    const formValues = form.getFieldsValue();
    const selectedPhotographer = photographerOptions.find(p => p.id === formValues.photographerId);
    const selectedStudio = studioOptions.find(s => s.id === formValues.studioId);
    const startTime = formValues.timeRange?.[0]?.format('HH:mm');
    const endTime = formValues.timeRange?.[1]?.format('HH:mm');
    
    return (
      <div className="review-form">
        <div className="info-card">
          <Title level={5}>客户信息</Title>
          <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
            <Descriptions.Item label="客户姓名">{selectedCustomer?.name}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{selectedCustomer?.phoneNumber}</Descriptions.Item>
            {selectedCustomer?.email && (
              <Descriptions.Item label="电子邮箱">{selectedCustomer.email}</Descriptions.Item>
            )}
          </Descriptions>
        </div>
        
        <div className="info-card">
          <Title level={5}>预约信息</Title>
          <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
            <Descriptions.Item label="预约日期">{formValues.date?.format('YYYY-MM-DD')}</Descriptions.Item>
            <Descriptions.Item label="预约时间">{startTime} - {endTime}</Descriptions.Item>
            <Descriptions.Item label="拍摄类型">{formValues.shootingType}</Descriptions.Item>
            <Descriptions.Item label="套餐选择">{selectedPackage?.name}</Descriptions.Item>
          </Descriptions>
        </div>
        
        <div className="info-card">
          <Title level={5}>资源信息</Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              {selectedPhotographer && (
                <div className="resource-info">
                  <Avatar size={48} icon={<CameraOutlined />} />
                  <div className="resource-meta">
                    <div className="resource-name">{selectedPhotographer.name}</div>
                    <div className="resource-attrs">
                      {selectedPhotographer.specialty?.map(spec => (
                        <Tag key={spec}>{spec}</Tag>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Col>
            <Col xs={24} md={12}>
              {selectedStudio && (
                <div className="resource-info">
                  <div className="studio-image">
                    <div className="no-image">
                      <ShopOutlined />
                    </div>
                  </div>
                  <div className="resource-meta">
                    <div className="resource-name">{selectedStudio.name}</div>
                    <div className="resource-attrs">
                      <div className="studio-address">{selectedStudio.address}</div>
                    </div>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </div>
        
        <div className="info-card">
          <Title level={5}>价格信息</Title>
          <div className="price-details">
            <div className="price-item">
              <span className="price-label">基础价格</span>
              <span className="price-value">¥{priceDetails.basePrice.toFixed(2)}</span>
            </div>
            {priceDetails.additionalFees > 0 && (
              <div className="price-item">
                <span className="price-label">附加费用</span>
                <span className="price-value">¥{priceDetails.additionalFees.toFixed(2)}</span>
              </div>
            )}
            {priceDetails.discountAmount > 0 && (
              <div className="price-item discount">
                <span className="price-label">优惠金额</span>
                <span className="price-value">-¥{priceDetails.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="price-item total">
              <span className="price-label">总计</span>
              <span className="price-value">¥{priceDetails.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {formValues.notes && (
          <div className="info-card">
            <Title level={5}>客户备注</Title>
            <div className="note-content">{formValues.notes}</div>
          </div>
        )}
        
        {formValues.staffNotes && (
          <div className="info-card">
            <Title level={5}>内部备注</Title>
            <div className="note-content">{formValues.staffNotes}</div>
          </div>
        )}
      </div>
    );
  };

  // 成功步骤
  const renderSuccessStep = () => {
    return (
      <Result
        status="success"
        title="预约创建成功!"
        subTitle={`预约号: ${bookingNumber}`}
        extra={[
          <Button
            type="primary"
            key="detail"
            onClick={() => history.push(`/booking/detail/${bookingNumber}`)}
          >
            查看详情
          </Button>,
          <Button
            key="list"
            onClick={() => history.push('/booking/list')}
          >
            返回列表
          </Button>,
        ]}
      />
    );
  };

  // 步骤操作按钮
  const renderStepsAction = () => {
    if (currentStep === 4) return null; // 成功页面不需要按钮
    
    return (
      <div className="steps-action">
        {currentStep > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={prevStep}>
            上一步
          </Button>
        )}
        {currentStep < 3 && (
          <Button type="primary" onClick={nextStep}>
            下一步
          </Button>
        )}
        {currentStep === 3 && (
          <Button 
            type="primary" 
            onClick={handleSubmit}
            loading={submitting}
          >
            提交预约
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="booking-form-page">
      <div className="page-header">
        <div className="page-title">
          <Button icon={<ArrowLeftOutlined />} onClick={() => history.push('/booking/list')}>
            返回
          </Button>
          <Title level={4}>{isEdit ? '编辑预约' : '创建预约'}</Title>
        </div>
      </div>
      
      <Card>
        <Steps current={currentStep} className="booking-steps">
          <Step title="选择客户" icon={<UserOutlined />} />
          <Step title="选择时间和资源" icon={<CalendarOutlined />} />
          <Step title="选择服务" icon={<CameraOutlined />} />
          <Step title="确认预约" icon={<CheckCircleOutlined />} />
        </Steps>
        
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
          >
            <div className="steps-content">
              {renderStepContent()}
            </div>
          </Form>
          
          {renderStepsAction()}
        </Spin>
      </Card>
    </div>
  );
};

export default BookingForm;
