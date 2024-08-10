import {
  Button,
  Dropdown,
  Form,
  Input,
  Menu,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  message,
} from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import {
  AiFillInfoCircle,
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineInfoCircle,
  AiOutlinePlus,
} from 'react-icons/ai';
import { axiosClient } from '../../api/axiosClient';
import moment from 'moment';
import 'moment/locale/vi';
import { MdMoreHoriz } from 'react-icons/md';
import OrderDetailModal from './OrderDetailModal';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const PurchasedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalPurpose, setIsModalPurpose] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const modalPurposes = {
    UPDATE_ORDER_STATUS: 'UPDATE_ORDER_STATUS',
    VIEW_INFO: 'VIEW_INFO',
  };
  const [viewOrderDetailModalOpen, setViewOrderDetailModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const OrderStatusEnum = {
    ORDERED: {
      value: 'ORDERED',
      label: 'Đã Đặt Hàng',
    },
    CANCELED: {
      value: 'CANCELED',
      label: 'Đã Huỷ',
    },
    DELIVERING: {
      value: 'DELIVERING',
      label: 'Đang Vận Chuyển',
    },
    COMPLETED: {
      value: 'COMPLETED',
      label: 'Đã Hoàn Thành',
    },
    PURCHASED: {
      value: 'PURCHASED',
      label: 'Đã Thanh Toán Online',
    },
    REFUNDED: {
      value: 'REFUNDED',
      label: 'Đã Hoàn Tiền',
    },
  };

  const OrderStatusMap = new Map([
    [OrderStatusEnum.ORDERED.value, OrderStatusEnum.ORDERED.label],
    [OrderStatusEnum.CANCELED.value, OrderStatusEnum.CANCELED.label],
    [OrderStatusEnum.DELIVERING.value, OrderStatusEnum.DELIVERING.label],
    [OrderStatusEnum.COMPLETED.value, OrderStatusEnum.COMPLETED.label],
    [OrderStatusEnum.PURCHASED.value, OrderStatusEnum.PURCHASED.label],
    [OrderStatusEnum.REFUNDED.value, OrderStatusEnum.REFUNDED.label],
  ]);

  const [orderStatusOptions, setOrderStatusOptions] = useState([OrderStatusEnum]);
  const [form] = Form.useForm();
  const [selectedOrder, setSelectedOrder] = useState({});
  const purchasedOrders = orders.filter(
    (order) => order.status === OrderStatusEnum.PURCHASED.value
  );

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e?.target?.value ? [e?.target?.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Lọc
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
          fontSize: '20px',
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString()?.toLowerCase()?.includes(value?.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput?.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: 'orange',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text?.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const getAllOrders = async () => {
    try {
      const result = await axiosClient.get('order/all');

      if (result) {
        setOrders(result.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'uuid',
      key: 'uuid',
      ...getColumnSearchProps('uuid'),
      render: (uuid) => <span style={{ color: 'black', fontWeight: 'bold' }}>{uuid}</span>,
    },
    {
      title: 'Tổng số tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (price) => (
        <span>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',

      render: (text, record) => {
        return <Tag>{OrderStatusMap.get(record?.status)}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => (
        <span>{createdAt && moment(createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
    {
      title: 'Người đặt hàng',
      dataIndex: 'userId.name',
      key: 'userId.name',
      render: (text, record) => record?.userId?.name,
    },
    {
      title: 'Tùy chọn',
      align: 'center',
      key: 'action',
      render: (text, record) => (
        <Dropdown
          menu={{
            onClick: (event) => {
              handleMenuClick(event?.key, record);
            },
            items: items,
          }}
        >
          <Button
            icon={
              <MdMoreHoriz
                style={{
                  verticalAlign: 'middle',
                  marginBottom: '1px',
                }}
                size={20}
              />
            }
          ></Button>
        </Dropdown>
      ),
    },
  ];

  const items = [
    {
      key: modalPurposes.VIEW_INFO,
      label: 'Chi tiết Đơn Hàng',
      icon: <AiOutlineInfoCircle />,
    },
    {
      key: modalPurposes.UPDATE_ORDER_STATUS,
      label: 'Cập Nhật Trạng Thái',
      icon: <AiOutlineEdit />,
    },
  ];

  const handleMenuClick = async (key, record) => {
    switch (key) {
      case modalPurposes.UPDATE_ORDER_STATUS: {
        setIsModalOpen(true);
        let statusOptions = await getOrderStatusByCurrentStatus(record?.status, record?.isPaid);
        setOrderStatusOptions(statusOptions);
        form.setFieldValue('status', record.status);
        setIsModalPurpose(modalPurposes.UPDATE_ORDER_STATUS);
        setSelectedOrder(record);
        break;
      }
      case modalPurposes.VIEW_INFO: {
        setSelectedOrderId(record?._id);
        setViewOrderDetailModalOpen(true);
        break;
      }

      default:
        break;
    }
  };

  const handleSubmitModal = () => {
    switch (isModalPurpose) {
      case modalPurposes.UPDATE_ORDER_STATUS:
        handleUpdateOrderStatus();
        break;

      default:
        break;
    }
  };

  const handleUpdateOrderStatus = async () => {
    let newStatus = form.getFieldValue('status');
    if (newStatus === selectedOrder.status) {
      handleCloseModal();
      return;
    }
    try {
      let result = await axiosClient.put('/order/update-status', {
        orderId: selectedOrder._id,
        status: newStatus,
      });
      getAllOrders();
      handleCloseModal();
      message.success('Cập nhật trạng thái đơn hàng thành công.');
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOrderStatusOptions([]);
    form.resetFields();
  };

  const getOrderStatusByCurrentStatus = (currentStatus, isPurchased) => {
    let orderStatusOptions = [];
    switch (currentStatus) {
      case OrderStatusEnum.ORDERED.value: {
        orderStatusOptions.push(
          OrderStatusEnum.ORDERED,
          OrderStatusEnum.DELIVERING,
          OrderStatusEnum.CANCELED
        );
        break;
      }
      case OrderStatusEnum.PURCHASED.value: {
        orderStatusOptions.push(
          OrderStatusEnum.PURCHASED,
          OrderStatusEnum.DELIVERING,
          OrderStatusEnum.REFUNDED
        );
        break;
      }
      case OrderStatusEnum.DELIVERING.value: {
        if (isPurchased) {
          orderStatusOptions.push(
            OrderStatusEnum.PURCHASED,
            OrderStatusEnum.DELIVERING,
            OrderStatusEnum.REFUNDED,
            OrderStatusEnum.COMPLETED
          );
          break;
        }
        orderStatusOptions.push(
          OrderStatusEnum.ORDERED,
          OrderStatusEnum.DELIVERING,
          OrderStatusEnum.COMPLETED,
          OrderStatusEnum.CANCELED
        );
        break;
      }
      case OrderStatusEnum.COMPLETED.value: {
        orderStatusOptions.push(OrderStatusEnum.COMPLETED);
        break;
      }
      case OrderStatusEnum.REFUNDED.value: {
        orderStatusOptions.push(OrderStatusEnum.REFUNDED);
        break;
      }
      case OrderStatusEnum.CANCELED.value: {
        orderStatusOptions.push(OrderStatusEnum.CANCELED);
        break;
      }
      default:
        break;
    }
    return orderStatusOptions;
  };
  const showDeleteConfirm = (orderId) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa đơn hàng này?',
      icon: <AiOutlineDelete size={15} color="#FF4D4F" />,
      content: 'Xóa đơn hàng sẽ không thể khôi phục.',
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        deleteOrder(orderId);
      },
    });
  };

  const deleteOrder = (orderId) => {
    try {
      // xóa đơn hàng bằng API
      axiosClient
        .delete(`order/delete/${orderId}`)
        .then(() => {
          message.success('Xóa đơn hàng thành công');
          // cập nhật danh sách đơn hàng
          getAllOrders();
        })
        .catch((error) => {
          console.log(error);
          message.error('Lỗi khi xóa đơn hàng');
        });
    } catch (error) {
      message.error('Xóa thất bại.');
      console.log(error);
    }
  };

  return (
    <div>
      <Modal
        width={400}
        open={isModalOpen}
        title="Cập Nhật Trạng Thái Đơn Hàng"
        onOk={handleSubmitModal}
        onCancel={handleCloseModal}
      >
        <Form form={form}>
          <Form.Item name="status">
            <Select
              style={{
                width: '100%',
              }}
              options={orderStatusOptions}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Table
        className="ml-5 mr-5"
        tableLayout="auto"
        bordered
        columns={columns}
        dataSource={purchasedOrders}
        pagination={{ pageSize: 7 }}
      />
      <OrderDetailModal
        isOpen={viewOrderDetailModalOpen}
        orderId={selectedOrderId}
        onClose={() => setViewOrderDetailModalOpen(false)}
      />
    </div>
  );
};

export default PurchasedOrders;
