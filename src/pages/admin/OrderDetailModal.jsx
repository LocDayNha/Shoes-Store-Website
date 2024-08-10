import { Modal, Descriptions, Divider, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import { axiosClient } from '../../api/axiosClient';
import moment from 'moment';

const OrderDetailModal = ({ orderId, isOpen, onClose }) => {
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    if (isOpen && orderId) {
      const getOrderDetail = async () => {
        try {
          const result = await axiosClient.get(`/order/get-order-detail/${orderId}`);
          if (result) {
            setOrderDetails(result.orders);
            console.log(result.orders);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getOrderDetail();
    }
  }, [isOpen]);

  const getOrderStatusPayment = (isPaid) => {
    return isPaid ? 'Đã thanh toán' : 'Chưa thanh toán';
  };

  const getOrderStatus = (status) => {
    if (status === 'ORDERED') {
      return 'Đã đặt hàng';
    } else if (status === 'PURCHASED') {
      return 'Đã thanh toán online';
    } else if (status === 'CANCELED') {
      return 'Đã hủy đơn hàng';
    } else if (status === 'DELIVERING') {
      return 'Đang vận chuyển đơn hàng';
    } else if (status === 'COMPLETED') {
      return 'Đã giao hàng thành công';
    } else if (status === 'REFUNDED') {
      return 'Đã hủy và hoàn tiền';
    }
  };

  return (
    <Modal
      title="Chi tiết đơn hàng"
      visible={isOpen}
      onCancel={onClose}
      footer={null}
      width={1200}
      bodyStyle={{ maxHeight: '600px', overflowY: 'auto' }}
    >
      {orderDetails.map((order, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>ID đơn hàng: {order?.uuid}</h3>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Descriptions bordered layout="vertical">
                <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label="Địa chỉ">
                  {order?.address}
                </Descriptions.Item>
                <Descriptions.Item
                  labelStyle={{ fontWeight: 'bold' }}
                  label="Số điện thoại nhận hàng"
                >
                  {order?.phoneNumber}
                </Descriptions.Item>
                <Descriptions.Item
                  labelStyle={{ fontWeight: 'bold' }}
                  label="Trạng thái thanh toán"
                >
                  {getOrderStatusPayment(order?.isPaid)}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label="Trạng thái đơn hàng">
                  {getOrderStatus(order?.status)}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label="Thời gian đặt hàng">
                  {moment(order?.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label="Tên người nhận">
                  {order?.user?.name}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Descriptions title="Thông tin sản phẩm" bordered layout="horizontal">
                {order.detail.map((productDetail, index) => {
                  const { images, title, unitPrice, size, color, quantity } = productDetail;
                  const firstImage = images[0]; // Hình ảnh đầu tiên của sản phẩm

                  return (
                    <React.Fragment key={index}>
                      <Descriptions.Item label={`Sản phẩm ${index + 1}`}>
                        <img
                          style={{ maxWidth: '200px', maxHeight: '200px' }}
                          src={firstImage?.url}
                          alt={firstImage?.name}
                        />
                        <p style={{ fontWeight: 'bold' }}>
                          {title} ({color}, {size})
                        </p>
                        <p style={{ fontWeight: 'bold' }}>{unitPrice.toLocaleString()} VND</p>
                        <p style={{ fontWeight: 'bold' }}>{quantity}x</p>
                      </Descriptions.Item>
                    </React.Fragment>
                  );
                })}
              </Descriptions>
            </Col>
          </Row>
          {index !== orderDetails.length - 1 && <Divider />}
        </div>
      ))}
    </Modal>
  );
};

export default OrderDetailModal;
