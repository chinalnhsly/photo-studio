import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Avatar,
  Tabs,
  Tag,
  Button,
  Statistic,
  Timeline,
  List,
  Comment,
  Rate,
  Space,
  Divider,
  Image,
  Badge,
  Descriptions,
  Calendar,
  Spin,
  Empty,
  Tooltip,
  message,
  Modal,
  Form,
  Input,
  Select,
  DatePicker
} from 'antd';
import { ProTable } from '@ant-design/pro-components';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  StarOutlined,
  EditOutlined,
  LikeOutlined,
  MessageOutlined,
  PictureOutlined,
  TeamOutlined,
  TrophyOutlined,
  FileImageOutlined,
  ScheduleOutlined,
  CameraOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { useParams, history, Link } from 'umi';
import moment from 'moment';
import type {
  PhotographerData,
  PhotographerResponse,
  PhotographerBookingsResponse,
  PhotographerPortfolioResponse
} from '@/services/photographer';
import {
  getPhotographerDetail,
  getPhotographerBookings,
  getPhotographerPortfolio,
  updatePhotographerFeatured
} from '@/services/photographer';
import styles from './PhotographerDetail.less';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface PhotographerDetailProps {}

const PhotographerDetail: React.FC<PhotographerDetailProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [photographer, setPhotographer] = useState<PhotographerData | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [activeKey, setActiveKey] = useState<string>('overview');
  const [scheduleModalVisible, setScheduleModalVisible] = useState<boolean>(false);
  const [scheduleForm] = Form.useForm();
  //const history = useHistory();

  useEffect(() => {
    if (id) {
      fetchPhotographerData();
    }
  }, [id]);

  const fetchPhotographerData = async () => {
    setLoading(true);
    try {
      const [photographerRes, bookingsRes, portfolioRes] = await Promise.all([
        getPhotographerDetail(Number(id)),
        getPhotographerBookings(Number(id)),
        getPhotographerPortfolio(Number(id))
      ]);

      setPhotographer((photographerRes as PhotographerResponse).data);
      setBookings((bookingsRes as PhotographerBookingsResponse).data || []);
      setPortfolio((portfolioRes as PhotographerPortfolioResponse).data || []);
    } catch (error) {
      message.error('获取摄影师数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async () => {
    try {
      await updatePhotographerFeatured(Number(id), !photographer?.featured);
      message.success(photographer?.featured ? '已取消推荐展示' : '已设为推荐展示');
      if (photographer) {
        setPhotographer({
          ...photographer,
          featured: !photographer.featured
        });
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleCreateSchedule = (values: any) => {
    message.success('排班创建成功');
    setScheduleModalVisible(false);
    scheduleForm.resetFields();
  };

  const renderSkills = () => {
    const skills = photographer?.skills || [];
    return (
      <Row gutter={[16, 16]}>
        {skills.map((skill) => (
          <Col xs={12} sm={8} md={6} key={skill.name}>
            <div className={styles.skillItem}>
              <div className={styles.skillName}>{skill.name}</div>
              <Rate disabled defaultValue={Number(skill.rating) || 0} />
            </div>
          </Col>
        ))}
      </Row>
    );
  };

  const renderCalendarContent = (date: moment.Moment) => {
    const dayBookings = bookings.filter((booking) =>
      moment(booking.bookingTime).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
    );

    if (dayBookings.length === 0) return null;

    return (
      <ul className={styles.scheduleCellList}>
        {dayBookings.map((booking, index) => {
          const key = booking.id || index;
          const content = booking.title || `${booking.startTime} - ${booking.endTime}`;
          return (
            <li key={key} className={`booking-${booking.status}`}>
              {content}
            </li>
          );
        })}
      </ul>
    );
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (!photographer) {
    return (
      <Card className={styles.emptyContainer}>
        <Empty description="未找到摄影师信息" image={(Empty as any).PRESENTED_IMAGE_SIMPLE} />
        <div className={styles.emptyActions}>
          <Button type="primary" onClick={() => history.push('/photographer/list')}>
            返回列表
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className={styles.photographerDetailPage}>
      <div className={styles.pageHeader}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => history.goBack()}>
          返回
        </Button>
        <div className={styles.pageActions}>
          <Space>
            <Button icon={<EditOutlined />} onClick={() => history.push(`/photographer/edit/${id}`)}>
              编辑
            </Button>
            <Button type={photographer.featured ? 'default' : 'primary'} onClick={handleToggleFeatured}>
              {photographer.featured ? '取消推荐' : '设为推荐'}
            </Button>
          </Space>
        </div>
      </div>

      <Card className={styles.profileCard}>
        <Row gutter={24}>
          <Col xs={24} sm={8} md={6}>
            <div className={styles.avatarSection}>
              <Avatar size={120} src={photographer.avatar} icon={<UserOutlined />} />
              <div className={styles.statusBadge}>
                {photographer.status === 'active' ? (
                  <Tag color="success" icon={<CheckCircleOutlined />}>
                    在职
                  </Tag>
                ) : (
                  <Tag color="error" icon={<CloseCircleOutlined />}>
                    离职
                  </Tag>
                )}
              </div>
              {photographer.featured && (
                <div className={styles.featuredBadge}>
                  <Badge count="推荐" style={{ backgroundColor: '#52c41a' }} />
                </div>
              )}
            </div>
          </Col>

          <Col xs={24} sm={16} md={18}>
            <div className={styles.profileInfo}>
              <div className={styles.nameSection}>
                <Title level={3}>{photographer.name}</Title>
                <Tag color="blue" className={styles.levelTag}>
                  {photographer.level || '普通摄影师'}
                </Tag>
                <Rate disabled defaultValue={photographer.rating || 5} />
              </div>

              <div className={styles.contactSection}>
                <div>
                  <PhoneOutlined /> {photographer.phone}
                </div>
                <div>
                  <MailOutlined /> {photographer.email}
                </div>
              </div>

              <div className={styles.specialties}>
                {photographer.specialties &&
                  photographer.specialties.map((specialty: string) => <Tag key={specialty}>{specialty}</Tag>)}
              </div>
            </div>
          </Col>
        </Row>

        <Row gutter={16} className={styles.statsRow}>
          <Col xs={24} sm={8}>
            <Statistic title="总评分" value={photographer.rating} prefix={<StarOutlined />} suffix="/ 5" precision={1} />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic title="完成预约" value={photographer.completedBookings} prefix={<CheckCircleOutlined />} />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic title="顾客满意度" value={`${photographer.satisfaction}%`} prefix={<LikeOutlined />} />
          </Col>
        </Row>
      </Card>

      <Card className={styles.contentCard}>
        <Tabs activeKey={activeKey} onChange={setActiveKey}>
          <TabPane tab="总览" key="overview">
            <Row gutter={16}>
              <Col xs={24} lg={16}>
                <Card title="个人简介" className={styles.bioCard}>
                  <Paragraph>{photographer.bio}</Paragraph>
                </Card>

                <Card title="技能和特长" className={styles.skillsCard}>
                  {renderSkills()}
                </Card>

                <Card
                  title="作品集预览"
                  extra={<a onClick={() => setActiveKey('portfolio')}>查看全部</a>}
                  className={styles.portfolioPreviewCard}
                >
                  {portfolio.length > 0 ? (
                    <div className={styles.portfolioPreview}>
                      <Image.PreviewGroup>
                        <Row gutter={[8, 8]}>
                          {portfolio.slice(0, 4).map((image, index) => (
                            <Col span={6} key={index}>
                              <div className={styles.imageWrapper}>
                                <Image src={image.url} alt={`摄影作品 ${index + 1}`} />
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </Image.PreviewGroup>
                      {portfolio.length > 4 && (
                        <div className={styles.moreImages}>
                          <Button type="link" onClick={() => setActiveKey('portfolio')}>
                            查看更多 ({portfolio.length - 4} 张)
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Empty description="暂无作品" />
                  )}
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card title="工作信息" className={styles.workInfoCard}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="工号">{photographer.employeeId}</Descriptions.Item>
                    <Descriptions.Item label="入职日期">{photographer.joinDate}</Descriptions.Item>
                    <Descriptions.Item label="合同到期">{photographer.contractEndDate}</Descriptions.Item>
                    <Descriptions.Item label="工作室">
                      {photographer.studios &&
                        photographer.studios.map((studio: any) => (
                          <div key={studio.id}>
                            <Link to={`/studio/detail/${studio.id}`}>{studio.name}</Link>
                          </div>
                        ))}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                <Card
                  title="近期预约"
                  extra={
                    <Button onClick={() => setScheduleModalVisible(true)} type="link" icon={<ScheduleOutlined />}>
                      新增排班
                    </Button>
                  }
                  className={styles.upcomingBookingsCard}
                >
                  {bookings.length > 0 ? (
                    <Timeline>
                      {bookings.map((booking: any) => (
                        <Timeline.Item key={booking.id}>
                          <div className={styles.bookingItem}>
                            <div className={styles.bookingDate}>
                              <CalendarOutlined /> {booking.date}
                            </div>
                            <div className={styles.bookingTime}>
                              {booking.startTime} - {booking.endTime}
                            </div>
                            <div className={styles.bookingCustomer}>
                              <Link to={`/customer/detail/${booking.customerId}`}>
                                <span>{booking.customerName}</span>
                              </Link>
                            </div>
                            <div className={styles.bookingType}>{booking.shootingType}</div>
                            <div className={styles.bookingLink}>
                              <Link to={`/booking/detail/${booking.id}`}>
                                <span>查看详情</span>
                              </Link>
                            </div>
                          </div>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  ) : (
                    <Empty description="近期无预约" />
                  )}
                </Card>

                <Card title="数据统计" className={styles.statsCard}>
                  <div className={styles.statItem}>
                    <Tooltip title="本月完成预约次数">
                      <Statistic
                        title="本月预约"
                        value={photographer.monthlyBookings || 0}
                        valueStyle={{ color: '#3f8600' }}
                      />
                    </Tooltip>
                  </div>
                  <div className={styles.statItem}>
                    <Tooltip title="历史总预约次数">
                      <Statistic title="总预约量" value={photographer.totalBookings || 0} />
                    </Tooltip>
                  </div>
                  <div className={styles.statItem}>
                    <Tooltip title="客户返回预约比例">
                      <Statistic title="回头率" value={photographer.returnRate || 0} suffix="%" />
                    </Tooltip>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="作品集" key="portfolio">
            <Card title="作品集" className={styles.portfolioCard}>
              {portfolio.length > 0 ? (
                <div className={styles.portfolioGallery}>
                  <Image.PreviewGroup>
                    <Row gutter={[16, 16]}>
                      {portfolio.map((image, index) => (
                        <Col xs={12} sm={8} md={6} xl={4} key={index}>
                          <div className={styles.galleryItem}>
                            <Image
                              src={image.url}
                              alt={`摄影作品 ${index + 1}`}
                              className={styles.portfolioImage}
                            />
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Image.PreviewGroup>
                </div>
              ) : (
                <Empty description="暂无作品集" />
              )}

              <div className={styles.portfolioFooter}>
                <Space>
                  <Button
                    type="primary"
                    icon={<PictureOutlined />}
                    onClick={() => history.push(`/photographer/edit/${id}?tab=portfolio`)}
                  >
                    管理作品集
                  </Button>
                </Space>
              </div>
            </Card>
          </TabPane>

          <TabPane tab="排班日历" key="schedule">
            <Card title="排班管理" extra={<Button type="primary" icon={<ScheduleOutlined />} onClick={() => setScheduleModalVisible(true)}>新增排班</Button>}>
              <div className={styles.scheduleCalendar}>
                <DatePicker.RangePicker />
                <Divider />
                <Calendar dateCellRender={renderCalendarContent} />
              </div>
            </Card>
          </TabPane>

          <TabPane tab="预约历史" key="bookings">
            <Card title="预约历史">
              <ProTable
                rowKey="id"
                search={false}
                options={false}
                pagination={{
                  pageSize: 10,
                }}
                dataSource={bookings || []}
                columns={[
                  {
                    title: '预约号',
                    dataIndex: 'bookingNumber',
                    render: (text, record: any) => <Link to={`/booking/detail/${record.id}`}>{text}</Link>,
                  },
                  {
                    title: '客户',
                    dataIndex: 'customerName',
                    render: (text, record: any) => <Link to={`/customer/detail/${record.customerId}`}><span>{text}</span></Link>,
                  },
                  {
                    title: '日期',
                    dataIndex: 'date',
                    sorter: (a: any, b: any) => moment(a.date).valueOf() - moment(b.date).valueOf(),
                  },
                  {
                    title: '时间',
                    dataIndex: 'time',
                    render: (_, record: any) => `${record.startTime} - ${record.endTime}`,
                  },
                  {
                    title: '拍摄类型',
                    dataIndex: 'shootingType',
                  },
                  {
                    title: '状态',
                    dataIndex: 'status',
                    render: (_, record) => {
                      const status = record.status;
                      const statusMap: Record<string, { color: string, text: string }> = {
                        'completed': { color: 'green', text: '已完成' },
                        'cancelled': { color: 'red', text: '已取消' },
                        'pending': { color: 'orange', text: '待确认' },
                        'confirmed': { color: 'blue', text: '已确认' },
                      };
                      const { color, text } = statusMap[status] || { color: 'default', text: String(status) };
                      return <Tag color={color}>{text}</Tag>;
                    },
                  },
                  {
                    title: '评价',
                    dataIndex: 'rating',
                    render: (rating) => rating ? <Rate disabled defaultValue={Number(rating) || 0} /> : '未评价'
                  },
                ]}
              />
            </Card>
          </TabPane>

          <TabPane tab="评价" key="reviews">
            <Card title="客户评价">
              {photographer.reviews && photographer.reviews.length > 0 ? (
                <List
                  itemLayout="vertical"
                  dataSource={photographer.reviews}
                  pagination={{ pageSize: 5 }}
                  renderItem={(review: any) => (
                    <List.Item>
                      <Comment
                        author={<a>{review.customerName}</a>}
                        avatar={<Avatar src={review.customerAvatar} icon={<UserOutlined />} />}
                        content={
                          <>
                            <Rate disabled defaultValue={review.rating || 0} />
                            <p>{review.content}</p>
                          </>
                        }
                        datetime={
                          <Space>
                            <span>{review.date}</span>
                            <span>预约号: <Link to={`/booking/detail/${review.bookingId}`}>
                              <span>{review.bookingId}</span>
                            </Link></span>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="暂无评价" />
              )}
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title="创建排班"
        visible={scheduleModalVisible}
        onCancel={() => setScheduleModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setScheduleModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => scheduleForm.submit()}>
            创建
          </Button>,
        ]}
      >
        <Form form={scheduleForm} layout="vertical" onFinish={handleCreateSchedule}>
          <Form.Item name="date" label="日期" rules={[{ required: true, message: '请选择日期' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="timeRange" label="时间范围" rules={[{ required: true, message: '请选择时间范围' }]}>
            <Select placeholder="选择时间范围">
              <Option value="morning">上午 (9:00 - 12:00)</Option>
              <Option value="afternoon">下午 (13:00 - 17:00)</Option>
              <Option value="fullday">全天 (9:00 - 17:00)</Option>
            </Select>
          </Form.Item>
          <Form.Item name="studioId" label="工作室" rules={[{ required: true, message: '请选择工作室' }]}>
            <Select placeholder="选择工作室">
              {photographer.studios &&
                photographer.studios.map((studio: any) => (
                  <Option key={studio.id} value={studio.id}>
                    {studio.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="备注">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PhotographerDetail;
