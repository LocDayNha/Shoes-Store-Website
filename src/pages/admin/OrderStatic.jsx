import React, { useEffect, useState } from 'react';
import { axiosClient } from '../../api/axiosClient';
import 'moment/locale/vi';
import { DatePicker, Form, Select, Space, Typography } from 'antd';
import localeVN from 'antd/es/date-picker/locale/vi_VN';
import 'dayjs/locale/vi';
import { Column, Area } from '@ant-design/plots';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;

const OrderStatic = () => {
  const [chartConfig, setChartConfig] = useState();
  const dateFormat = 'YYYY-MM-DD';
  const [form] = Form.useForm();
  const chartEnum = {
    TOTAL_ORDER: {
      value: 'TOTAL_ORDER',
      label: 'Tổng Số Lượng Đơn Hàng',
    },
    TOTAL_REVENUE: {
      value: 'TOTAL_REVENUE',
      label: 'Tổng Doanh Thu',
    },
    TOTAL_REVENUE_BY_BRAND: {
      value: 'TOTAL_REVENUE_BY_BRAND',
      label: 'Tổng Doanh Thu Theo Thương Hiệu',
    },
  };

  const chartOptions = [chartEnum.TOTAL_ORDER, chartEnum.TOTAL_REVENUE];

  const chartTypeEnum = {
    COLUMN: {
      label: 'Cột',
      value: 'COLUMN',
    },
    AREA: {
      label: 'Vùng',
      value: 'AREA',
    },
    PIE: {
      label: 'Tròn',
      value: 'PIE',
    },
  };

  const [chartTypeOptions, setChartTypeOptions] = useState([
    chartTypeEnum.COLUMN,
    chartTypeEnum.AREA,
  ]);

  const [selectedChartType, setSelectedChartType] = useState(chartTypeEnum.AREA.value);
  const [selectedChart, setSelectedChart] = useState(chartEnum.TOTAL_ORDER.value);
  const [isOrderStatusFieldReadOnly, setIsOrderStatusFieldReadOnly] = useState(false);

  const defaultFormValues = {
    orderStatus: 'ALL',
    dateType: 'month',
    dateRange: [dayjs().startOf('month').add(-6, 'months'), dayjs()],
    dateLabelFormat: 'YYYY',
    chartType: chartTypeEnum.AREA.value,
    chart: chartEnum.TOTAL_ORDER.value,
  };

  const handleFormValuesChange = async () => {
    if (selectedChart !== form.getFieldValue('chart')) {
      form.resetFields(['chartType']);
    }
    setIsOrderStatusFieldReadOnly(false);
    switch (form.getFieldValue('chart')) {
      case chartEnum.TOTAL_ORDER.value: {
        setChartTypeOptions([chartTypeEnum.COLUMN, chartTypeEnum.AREA]);
        await getTotalOrderChartData(form.getFieldsValue());
        break;
      }

      case chartEnum.TOTAL_REVENUE.value:
        setIsOrderStatusFieldReadOnly(true);
        setChartTypeOptions([chartTypeEnum.COLUMN, chartTypeEnum.AREA]);
        form.setFieldValue('orderStatus', 'COMPLETED');
        await getTotalRevenueChartData(form.getFieldsValue());
        break;
      default:
        break;
    }
    setSelectedChartType(form.getFieldValue('chartType'));
    setSelectedChart(form.getFieldValue('chart'));
  };

  useEffect(() => {
    getTotalOrderChartData(defaultFormValues);
  }, []);

  const getTotalOrderChartData = async ({ dateType, dateRange, orderStatus, dateLabelFormat }) => {
    try {
      switch (form.getFieldValue('dateType')) {
        case 'year':
          dateLabelFormat = 'YYYY';
          dateRange = [
            dateRange[0].startOf('years').format(dateFormat),
            dateRange[1].endOf('years').format(dateFormat),
          ];
          break;
        case 'month':
          dateLabelFormat = 'MM-YYYY';
          dateRange = [dateRange[0].format(dateFormat), dateRange[1].format(dateFormat)];
          break;
        case 'week':
          dateLabelFormat = 'DD-MM-YYYY';
          dateRange = [dateRange[0].format(dateFormat), dateRange[1].format(dateFormat)];
          break;
        case 'day':
          dateRange = [dateRange[0].format(dateFormat), dateRange[1].format(dateFormat)];
          break;
        default:
          break;
      }

      const { result } = await axiosClient.get('/statistics/order', {
        params: {
          dateType: dateType,
          fromDate: dateRange[0],
          toDate: dateRange[1],
          orderStatus: orderStatus,
          dateLabelFormat: dateLabelFormat,
        },
      });
      setChartConfig({
        data: result,
        xField: 'date',
        yField: 'total',
        label: {
          position: 'top',
          style: {
            fill: 'gray',
            opacity: 1,
          },
        },
        xAxis: {
          label: {
            autoHide: true,
            autoRotate: false,
          },
        },
        meta: {
          total: {
            alias: 'Tổng đơn hàng',
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  let numberFormat = new Intl.NumberFormat();

  const getTotalRevenueChartData = async ({ dateType, dateRange, dateLabelFormat }) => {
    try {
      switch (form.getFieldValue('dateType')) {
        case 'year':
          dateLabelFormat = 'YYYY';
          dateRange = [
            dateRange[0].startOf('years').format(dateFormat),
            dateRange[1].endOf('years').format(dateFormat),
          ];
          break;
        case 'month':
          dateLabelFormat = 'MM-YYYY';
          dateRange = [dateRange[0].format(dateFormat), dateRange[1].format(dateFormat)];
          break;
        case 'week':
          dateLabelFormat = 'DD-MM-YYYY';
          dateRange = [dateRange[0].format(dateFormat), dateRange[1].format(dateFormat)];
          break;
        case 'day':
          dateRange = [dateRange[0].format(dateFormat), dateRange[1].format(dateFormat)];
          break;
        default:
          break;
      }

      const { result } = await axiosClient.get('/statistics/order/revenue', {
        params: {
          dateType: dateType,
          fromDate: dateRange[0],
          toDate: dateRange[1],
          dateLabelFormat: dateLabelFormat,
        },
      });

      setChartConfig({
        data: result,
        xField: 'date',
        yField: 'revenue',
        label: {
          position: 'top',
          style: {
            fill: 'gray',
            opacity: 1,
          },
        },
        xAxis: {
          label: {
            autoHide: true,
            autoRotate: false,
          },
        },
        meta: {
          revenue: {
            alias: 'Tổng Doanh Thu',
            formatter: (v) => {
              return `${numberFormat.format(v)}đ`;
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-5">
      <Form
        layout="inline"
        form={form}
        initialValues={defaultFormValues}
        onValuesChange={handleFormValuesChange}
      >
        <div className="w-full flex justify-end">
          <div>
            <Typography.Text type="secondary" className=" mr-2">
              Biểu Đồ:
            </Typography.Text>
            <Form.Item name={'chart'} noStyle>
              <Select className="w-56 mr-2" options={chartOptions} />
            </Form.Item>

            <Typography.Text type="secondary" className=" mr-2">
              Loại Biểu Đồ:
            </Typography.Text>
            <Form.Item name={'chartType'} noStyle>
              <Select className="mr-2 w-20" options={chartTypeOptions} />
            </Form.Item>

            <Typography.Text type="secondary" className="mr-2">
              Trạng Thái Đơn Hàng:
            </Typography.Text>
            <Form.Item name={'orderStatus'} noStyle>
              <Select
                disabled={isOrderStatusFieldReadOnly}
                className="w-56"
                options={[
                  {
                    value: 'COMPLETED',
                    label: 'Đã Hoàn Thành',
                  },
                  {
                    value: 'ORDERED',
                    label: 'Đã Đặt Hàng',
                  },
                  {
                    value: 'PURCHASED',
                    label: 'Đã Đặt Hàng Và Thanh Toán',
                  },
                  {
                    value: 'DELIVERING',
                    label: 'Đang Vận Chuyển',
                  },
                  {
                    value: 'CANCELED',
                    label: 'Đã Huỷ',
                  },
                  {
                    value: 'REFUNDED',
                    label: 'Đã Hoàn Tiền',
                  },
                  {
                    value: 'ALL',
                    label: 'Tất Cả',
                  },
                ]}
              />
            </Form.Item>
            <Typography.Text type="secondary" className="ml-2 mr-2">
              Lọc theo:
            </Typography.Text>
            <Form.Item name={'dateType'} noStyle>
              <Select
                className="w-24"
                options={[
                  {
                    value: 'year',
                    label: 'Năm',
                  },
                  {
                    value: 'month',
                    label: 'Tháng',
                  },

                  {
                    value: 'week',
                    label: 'Tuần',
                  },
                  {
                    value: 'day',
                    label: 'Thứ',
                  },
                ]}
              />
            </Form.Item>
          </div>
        </div>
        <div className="flex justify-end w-full items-center mt-3">
          <Typography.Text type="secondary" className="mr-2">
            Khoảng thời gian:
          </Typography.Text>
          <Form.Item name={'dateRange'} noStyle>
            <RangePicker format="DD-MM-YYYY" locale={localeVN} />
          </Form.Item>
        </div>
      </Form>
      {chartConfig && selectedChartType === chartTypeEnum.COLUMN.value && (
        <div className="mt-10 w-full flex justify-center">
          <div className="w-[90%]">
            <Column {...chartConfig} />
          </div>
        </div>
      )}
      {chartConfig && selectedChartType === chartTypeEnum.AREA.value && (
        <div className="mt-10 w-full flex justify-center">
          <div className="w-[90%]">
            <Area {...chartConfig} />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatic;
