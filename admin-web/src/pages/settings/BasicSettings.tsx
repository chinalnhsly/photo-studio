import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Tabs,
  Switch,
  Upload,
  Spin,
  Divider,
  Row,
  Col,
  Select,
  Tag,
} from "antd";
import {
  SaveOutlined,
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import moment from 'moment';
type Moment = moment.Moment;
import type {
  FormListFieldData,
  FormListOperation,
} from "antd/es/form/FormList";
import "./BasicSettings.less";

import TimePicker from 'antd/es/time-picker';

// 解构出 TimePicker.RangePicker 组件
const { RangePicker } = TimePicker;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;



// 定义类型接口
interface BusinessHour {
  day: string;
  open: boolean;
  timeRange?: [Moment, Moment];
  startTime?: string;
  endTime?: string;
}

interface Holiday {
  date: string;
  name: string;
}

interface NotificationTemplate {
  type: string;
  content: string;
  subject?: string;
}

const BasicSettings: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [companyForm] = Form.useForm();
  const [businessForm] = Form.useForm();
  const [notificationForm] = Form.useForm();

  // 加载设置数据
  useEffect(() => {
    fetchSettingsData();
  }, []);

  // 获取设置数据
  const fetchSettingsData = async () => {
    try {
      setLoading(true);
      // 实际项目中应该调用API获取数据
      // const response = await api.settings.get();

      // 模拟API请求延迟
      setTimeout(() => {
        // 使用模拟数据
        const mockData = {
          company: {
            name: "阳光摄影工作室",
            logo: "https://via.placeholder.com/200x80?text=Studio+Logo",
            address: "北京市朝阳区某某路123号",
            phone: "010-12345678",
            email: "contact@studio.com",
            website: "www.studio.com",
            description:
              "专业摄影服务提供商，提供婚纱摄影、写真、证件照等服务。",
          },
          business: {
            businessHours: [
              {
                day: "monday",
                open: true,
                startTime: "09:00",
                endTime: "18:00",
              },
              {
                day: "tuesday",
                open: true,
                startTime: "09:00",
                endTime: "18:00",
              },
              {
                day: "wednesday",
                open: true,
                startTime: "09:00",
                endTime: "18:00",
              },
              {
                day: "thursday",
                open: true,
                startTime: "09:00",
                endTime: "18:00",
              },
              {
                day: "friday",
                open: true,
                startTime: "09:00",
                endTime: "18:00",
              },
              {
                day: "saturday",
                open: true,
                startTime: "10:00",
                endTime: "17:00",
              },
              {
                day: "sunday",
                open: false,
                startTime: "10:00",
                endTime: "17:00",
              },
            ],
            appointmentSettings: {
              minAdvanceHours: 24,
              maxAdvanceDays: 30,
              intervalMinutes: 30,
            },
            holidays: [
              { date: "2023-01-01", name: "元旦" },
              { date: "2023-01-22", name: "春节" },
            ],
          },
          notification: {
            smsEnabled: true,
            emailEnabled: true,
            smsTemplates: [
              {
                type: "booking_confirmation",
                content:
                  "您的预约已确认，预约号：{booking_number}，时间：{time}，感谢您的光临！",
              },
              {
                type: "booking_reminder",
                content:
                  "温馨提醒：您明天有一个预约，时间：{time}，地点：{location}，期待您的光临！",
              },
            ],
            emailTemplates: [
              {
                type: "booking_confirmation",
                subject: "预约确认通知",
                content: "尊敬的{customer_name}，您的预约已确认...",
              },
              {
                type: "booking_reminder",
                subject: "预约提醒",
                content: "尊敬的{customer_name}，提醒您明天的预约...",
              },
            ],
          },
        };

        // 设置表单初始值
        companyForm.setFieldsValue(mockData.company);
        businessForm.setFieldsValue({
          businessHours: mockData.business.businessHours.map((item) => ({
            ...item,
            timeRange: item.open
              ? [moment(item.startTime, "HH:mm"), moment(item.endTime, "HH:mm")]
              : undefined,
          })),
          appointmentSettings: mockData.business.appointmentSettings,
          holidays: mockData.business.holidays,
        });
        notificationForm.setFieldsValue(mockData.notification);

        // 设置logo
        setLogoUrl(mockData.company.logo);

        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error("加载设置数据失败");
      setLoading(false);
    }
  };

  // 保存公司信息
  const handleSaveCompanyInfo = async () => {
    try {
      const values = await companyForm.validateFields();
      setSubmitting(true);

      // 实际项目中应该调用API保存数据
      // await api.settings.update({
      //   company: {
      //     ...values,
      //     logo: logoUrl
      //   }
      // });

      // 模拟API请求延迟
      setTimeout(() => {
        message.success("公司信息保存成功");
        setSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error("保存失败:", error);
      setSubmitting(false);
    }
  };

  // 保存营业设置
  const handleSaveBusinessSettings = async () => {
    try {
      const values = await businessForm.validateFields();
      setSubmitting(true);

      // 处理时间范围数据
      const businessHours = values.businessHours.map((item: any) => ({
        day: item.day,
        open: item.open,
        startTime:
          item.open && item.timeRange ? item.timeRange[0].format("HH:mm") : "",
        endTime:
          item.open && item.timeRange ? item.timeRange[1].format("HH:mm") : "",
      }));

      // 实际项目中应该调用API保存数据
      // await api.settings.update({
      //   business: {
      //     ...values,
      //     businessHours
      //   }
      // });

      // 模拟API请求延迟
      setTimeout(() => {
        message.success("营业设置保存成功");
        setSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error("保存失败:", error);
      setSubmitting(false);
    }
  };

  // 保存通知设置
  const handleSaveNotificationSettings = async () => {
    try {
      const values = await notificationForm.validateFields();
      setSubmitting(true);

      // 实际项目中应该调用API保存数据
      // await api.settings.update({
      //   notification: values
      // });

      // 模拟API请求延迟
      setTimeout(() => {
        message.success("通知设置保存成功");
        setSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error("保存失败:", error);
      setSubmitting(false);
    }
  };

  // 处理Logo上传
  const handleLogoChange = (info: any) => {
    if (info.file.status === "done") {
      // 实际项目中这里应该使用返回的URL
      setLogoUrl(URL.createObjectURL(info.file.originFileObj));
      message.success("Logo上传成功");
    } else if (info.file.status === "error") {
      message.error("Logo上传失败");
    }
  };

  // 渲染公司信息表单
  const renderCompanyForm = () => (
    <Form form={companyForm} layout="vertical" onFinish={handleSaveCompanyInfo}>
      <Row gutter={24}>
        <Col span={24} md={12}>
          <Form.Item
            name="name"
            label="公司名称"
            rules={[{ required: true, message: "请输入公司名称" }]}
          >
            <Input placeholder="请输入公司名称" />
          </Form.Item>

          <Form.Item
            name="address"
            label="公司地址"
            rules={[{ required: true, message: "请输入公司地址" }]}
          >
            <Input placeholder="请输入公司地址" />
          </Form.Item>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[{ required: true, message: "请输入联系电话" }]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="电子邮箱"
                rules={[
                  { required: true, message: "请输入电子邮箱" },
                  { type: "email", message: "请输入有效的电子邮箱" },
                ]}
              >
                <Input placeholder="请输入电子邮箱" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="website" label="公司网站">
            <Input placeholder="请输入公司网站" />
          </Form.Item>

          <Form.Item name="description" label="公司简介">
            <TextArea rows={4} placeholder="请输入公司简介" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="公司Logo"
            tooltip="建议尺寸: 200px × 80px，支持 JPG, PNG 格式"
          >
            <div className="logo-uploader">
              <Upload
                name="logo"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={() => false} // 阻止自动上传
                onChange={handleLogoChange}
              >
                {logoUrl ? (
                  <img src={logoUrl} alt="logo" style={{ width: "100%" }} />
                ) : (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>上传Logo</div>
                  </div>
                )}
              </Upload>
            </div>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={submitting}
          icon={<SaveOutlined />}
        >
          保存
        </Button>
      </Form.Item>
    </Form>
  );

  // 渲染营业设置表单
  const renderBusinessForm = () => {
    // 星期几映射
    const dayLabels = {
      monday: "星期一",
      tuesday: "星期二",
      wednesday: "星期三",
      thursday: "星期四",
      friday: "星期五",
      saturday: "星期六",
      sunday: "星期日",
    };

    return (
      <Form
        form={businessForm}
        layout="vertical"
        onFinish={handleSaveBusinessSettings}
      >
        <div className="section-title">营业时间</div>
        <Form.List name="businessHours">
          {(fields: FormListFieldData[]) => (
            <>
              {fields.map(({ key, name, ...restField }: FormListFieldData) => (
                <div key={key} className="business-hour-item">
                  <Row gutter={16} align="middle">
                    <Col span={4}>
                      <div className="day-label">
                        {
                          dayLabels[
                            businessForm.getFieldValue([
                              "businessHours",
                              name,
                              "day",
                            ]) as keyof typeof dayLabels
                          ]
                        }
                      </div>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        {...restField}
                        name={[name, "open"]}
                        valuePropName="checked"
                      >
                        <Switch
                          checkedChildren="营业"
                          unCheckedChildren="休息"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={16}>
                      <Form.Item
                        {...restField}
                        name={[name, "timeRange"]}
                        dependencies={[["businessHours", name, "open"]]}
                      >
                        <RangePicker
                          format="HH:mm"
                          disabled={
                            !businessForm.getFieldValue([
                              "businessHours",
                              name,
                              "open",
                            ])
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              ))}
            </>
          )}
        </Form.List>

        <Divider />

        <div className="section-title">预约设置</div>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name={["appointmentSettings", "minAdvanceHours"]}
              label="最短提前预约时间(小时)"
              rules={[{ required: true, message: "请输入最短提前预约时间" }]}
            >
              <Input type="number" min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={["appointmentSettings", "maxAdvanceDays"]}
              label="最长提前预约天数"
              rules={[{ required: true, message: "请输入最长提前预约天数" }]}
            >
              <Input type="number" min={1} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={["appointmentSettings", "intervalMinutes"]}
              label="预约时间间隔(分钟)"
              rules={[{ required: true, message: "请输入预约时间间隔" }]}
            >
              <Select>
                <Option value={15}>15分钟</Option>
                <Option value={30}>30分钟</Option>
                <Option value={60}>60分钟</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <div className="section-title">节假日设置</div>
        <Form.List name="holidays">
          {(
            fields: FormListFieldData[],
            { add, remove }: FormListOperation
          ) => (
            <>
              {fields.map(({ key, name, ...restField }: FormListFieldData) => (
                <Row
                  key={key}
                  gutter={16}
                  align="middle"
                  className="holiday-item"
                >
                  <Col span={10}>
                    <Form.Item
                      {...restField}
                      name={[name, "date"]}
                      rules={[{ required: true, message: "请选择日期" }]}
                    >
                      <Input type="date" placeholder="日期" />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      rules={[{ required: true, message: "请填写假日名称" }]}
                    >
                      <Input placeholder="假日名称" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      className="remove-button"
                    />
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  添加节假日
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            icon={<SaveOutlined />}
          >
            保存
          </Button>
        </Form.Item>
      </Form>
    );
  };

  // 渲染通知设置表单
  const renderNotificationForm = () => (
    <Form
      form={notificationForm}
      layout="vertical"
      onFinish={handleSaveNotificationSettings}
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name="smsEnabled" label="短信通知" valuePropName="checked">
            <Switch checkedChildren="开启" unCheckedChildren="关闭" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="emailEnabled"
            label="邮件通知"
            valuePropName="checked"
          >
            <Switch checkedChildren="开启" unCheckedChildren="关闭" />
          </Form.Item>
        </Col>
      </Row>

      <Divider />

      <div className="section-title">短信模板设置</div>
      <Form.List name="smsTemplates">
        {(fields: FormListFieldData[]) => (
          <>
            {fields.map(({ key, name, ...restField }: FormListFieldData) => {
              const templateType = notificationForm.getFieldValue([
                "smsTemplates",
                name,
                "type",
              ]);
              const templateLabel =
                templateType === "booking_confirmation"
                  ? "预约确认通知"
                  : templateType === "booking_reminder"
                  ? "预约提醒"
                  : templateType;

              return (
                <div key={key} className="template-item">
                  <Form.Item
                    label={templateLabel}
                    {...restField}
                    name={[name, "content"]}
                    rules={[{ required: true, message: "请输入模板内容" }]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                  <div className="template-variables">
                    <span>可用变量：</span>
                    {templateType === "booking_confirmation" && (
                      <>
                        <Tag>{"{" + "booking_number" + "}"}</Tag>
                        <Tag>{"{" + "customer_name" + "}"}</Tag>
                        <Tag>{"{" + "time" + "}"}</Tag>
                      </>
                    )}
                    {templateType === "booking_reminder" && (
                      <>
                        <Tag>{"{" + "customer_name" + "}"}</Tag>
                        <Tag>{"{" + "time" + "}"}</Tag>
                        <Tag>{"{" + "location" + "}"}</Tag>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </Form.List>

      <Divider />

      <div className="section-title">邮件模板设置</div>
      <Form.List name="emailTemplates">
        {(fields: FormListFieldData[]) => (
          <>
            {fields.map(({ key, name, ...restField }: FormListFieldData) => {
              const templateType = notificationForm.getFieldValue([
                "emailTemplates",
                name,
                "type",
              ]);
              const templateLabel =
                templateType === "booking_confirmation"
                  ? "预约确认通知"
                  : templateType === "booking_reminder"
                  ? "预约提醒"
                  : templateType;

              return (
                <div key={key} className="template-item">
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        label={`${templateLabel} - 邮件标题`}
                        {...restField}
                        name={[name, "subject"]}
                        rules={[{ required: true, message: "请输入邮件标题" }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        label={`${templateLabel} - 邮件内容`}
                        {...restField}
                        name={[name, "content"]}
                        rules={[{ required: true, message: "请输入邮件内容" }]}
                      >
                        <TextArea rows={6} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <div className="template-variables">
                    <span>可用变量：</span>
                    {templateType === "booking_confirmation" && (
                      <>
                        <Tag>{"{" + "booking_number" + "}"}</Tag>
                        <Tag>{"{" + "customer_name" + "}"}</Tag>
                        <Tag>{"{" + "time" + "}"}</Tag>
                        <Tag>{"{" + "date" + "}"}</Tag>
                        <Tag>{"{" + "package" + "}"}</Tag>
                      </>
                    )}
                    {templateType === "booking_reminder" && (
                      <>
                        <Tag>{"{" + "customer_name" + "}"}</Tag>
                        <Tag>{"{" + "time" + "}"}</Tag>
                        <Tag>{"{" + "date" + "}"}</Tag>
                        <Tag>{"{" + "location" + "}"}</Tag>
                        <Tag>{"{" + "photographer" + "}"}</Tag>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={submitting}
          icon={<SaveOutlined />}
        >
          保存
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div className="basic-settings-page">
      <Card className="settings-card">
        <Spin spinning={loading}>
          <Tabs defaultActiveKey="company">
            <TabPane tab="公司信息" key="company">
              {renderCompanyForm()}
            </TabPane>
            <TabPane tab="营业设置" key="business">
              {renderBusinessForm()}
            </TabPane>
            <TabPane tab="通知设置" key="notification">
              {renderNotificationForm()}
            </TabPane>
          </Tabs>
        </Spin>
      </Card>
    </div>
  );
};

export default BasicSettings;
