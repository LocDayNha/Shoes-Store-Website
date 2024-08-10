import React, { useEffect, useState } from 'react';
import { axiosClient } from '../../api/axiosClient';
import 'moment/locale/vi';
import { DatePicker, Form, Select, Space, Typography } from 'antd';
import localeVN from 'antd/es/date-picker/locale/vi_VN';
import 'dayjs/locale/vi';
import { Column, Pie, Area } from '@ant-design/plots';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;

const ProductStatistic = () => {
  const [chartConfig, setChartConfig] = useState();
  const dateFormat = 'YYYY-MM-DD';

  const [form] = Form.useForm();
  const chartEnum = {
    TOTAL_SELLING: {
      value: 'TOTAL_SELLING',
      label: 'Tổng Số Lượng Bán',
    },
    TOTAL_SELLING_BY_BRANDS: {
      value: 'TOTAL_SELLING_BY_BRANDS',
      label: 'Tổng Số Lượng Bán Theo Thương Hiệu',
    },
  };

  const chartOptions = [chartEnum.TOTAL_SELLING, chartEnum.TOTAL_SELLING_BY_BRANDS];

  const chartTypeEnum = {
    COLUMN: {
      label: 'Cột',
      value: 'COLUMN',
    },
    PIE: {
      label: 'Tròn',
      value: 'PIE',
    },
    AREA: {
      label: 'Vùng',
      value: 'AREA',
    },
  };

  const [chartTypeOptions, setChartTypeOptions] = useState([
    chartTypeEnum.COLUMN,
    chartTypeEnum.PIE,
    chartTypeEnum.AREA,
  ]);

  const [selectedChartType, setSelectedChartType] = useState(chartTypeEnum.COLUMN.value);
  const [selectedChart, setSelectedChart] = useState(chartEnum.TOTAL_SELLING.value);
  const [isOrderStatusFieldReadOnly, setIsOrderStatusFieldReadOnly] = useState(false);
  const [isDateTypeFieldReadOnly, setIsDateTypeFieldReadOnly] = useState(true);

  const defaultFormValues = {
    orderStatus: 'COMPLETED',
    dateType: 'year',
    dateRange: [dayjs().startOf('month').add(-1, 'months'), dayjs()],
    dateLabelFormat: 'YYYY',
    chartType: chartTypeEnum.COLUMN.value,
    chart: chartEnum.TOTAL_SELLING.value,
  };

  const handleFormValuesChange = async () => {
    if (selectedChart !== form.getFieldValue('chart')) {
      form.resetFields(['chartType']);
    }
    setIsOrderStatusFieldReadOnly(false);
    switch (form.getFieldValue('chart')) {
      case chartEnum.TOTAL_SELLING.value:
        setChartTypeOptions([chartTypeEnum.COLUMN, chartTypeEnum.PIE, chartTypeEnum.AREA]);
        await getTotalSellingProductChartData(form.getFieldsValue());
        break;
      case chartEnum.TOTAL_SELLING_BY_BRANDS.value:
        setChartTypeOptions([chartTypeEnum.COLUMN, chartTypeEnum.PIE, chartTypeEnum.AREA]);
        await getTotalSellingProductByBrandsChartData(form.getFieldsValue());
        break;
      default:
        break;
    }
    setSelectedChartType(form.getFieldValue('chartType'));
    setSelectedChart(form.getFieldValue('chart'));
  };

  useEffect(() => {
    getTotalSellingProductChartData(defaultFormValues);
  }, []);

  const getTotalSellingProductChartData = async ({
    dateType,
    dateRange,
    orderStatus,
    chartType,
  }) => {
    try {
      const { result } = await axiosClient.get('/statistics/product/total-selling', {
        params: {
          dateType: dateType,
          fromDate: dateRange[0].format(dateFormat),
          toDate: dateRange[1].format(dateFormat),
          orderStatus: orderStatus,
        },
      });

      if (chartType === chartTypeEnum.COLUMN.value || chartType === chartTypeEnum.AREA.value) {
        setChartConfig({
          data: result,
          xField: 'productName',
          yField: 'total',
          label: {
            position: 'middle',
            style: {
              fill: '#FFFFFF',
              opacity: 0.6,
            },
          },
          xAxis: {
            label: {
              autoHide: false,
              autoRotate: true,
            },
          },
          meta: {
            total: {
              alias: 'Tổng số lượng bán',
            },
          },
        });
      }

      if (chartType === chartTypeEnum.PIE.value) {
        setChartConfig({
          appendPadding: 10,
          data: result,
          angleField: 'total',
          colorField: 'productName',
          radius: 0.9,
          width: 700,
          height: 500,
          label: {
            type: 'inner',
            offset: '-30%',
            content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
            style: {
              fontSize: 14,
              textAlign: 'center',
            },
          },
          meta: {
            total: {
              alias: 'Tổng số lượng bán',
            },
          },
          interactions: [
            {
              type: 'element-active',
            },
          ],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalSellingProductByBrandsChartData = async ({
    dateType,
    dateRange,
    orderStatus,
    chartType,
  }) => {
    try {
      const { result } = await axiosClient.get('/statistics/product/total-selling-by-brands', {
        params: {
          dateType: dateType,
          fromDate: dateRange[0].format(dateFormat),
          toDate: dateRange[1].format(dateFormat),
          orderStatus: orderStatus,
        },
      });

      if (chartType === chartTypeEnum.COLUMN.value || chartType === chartTypeEnum.AREA.value) {
        setChartConfig({
          data: result,
          xField: 'brandName',
          yField: 'total',
          label: {
            position: 'middle',
            style: {
              fill: '#FFFFFF',
              opacity: 0.6,
            },
          },
          xAxis: {
            label: {
              autoHide: false,
              autoRotate: true,
            },
          },
          meta: {
            total: {
              alias: 'Tổng số lượng bán theo thương hiệu',
            },
          },
        });
      }

      if (chartType === chartTypeEnum.PIE.value) {
        setChartConfig({
          appendPadding: 10,
          data: result,
          angleField: 'total',
          colorField: 'brandName',
          radius: 0.9,
          width: 700,
          height: 500,
          label: {
            type: 'inner',
            offset: '-30%',
            content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
            style: {
              fontSize: 14,
              textAlign: 'center',
            },
          },
          meta: {
            total: {
              alias: 'Tổng số lượng bán theo thương hiệu',
            },
          },
          interactions: [
            {
              type: 'element-active',
            },
          ],
        });
      }
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
            <Typography.Text type="secondary" className="mr-2">
              Loại Biểu Đồ:
            </Typography.Text>
            <Form.Item name={'chart'} noStyle>
              <Select className="w-72 mr-2" options={chartOptions} />
            </Form.Item>

            <Typography.Text type="secondary" className="mr-2">
              Kiểu:
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
                disabled={isDateTypeFieldReadOnly}
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
      {chartConfig && selectedChartType === chartTypeEnum.PIE.value && (
        <div className="mt-10 w-full flex justify-center">
          <div>
            <Pie {...chartConfig} />
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

export default ProductStatistic;
