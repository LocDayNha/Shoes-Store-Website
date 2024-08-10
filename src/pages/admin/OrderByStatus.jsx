import React from 'react';
import { Tabs } from 'antd';
import CompletedOrders from './CompletedOrders';
import CanceleddOrders from './CanceledOrder';
import DeliveringOrders from './DeliveringOrders';
import OrderedOrders from './OrderedOrders';
import PurchasedOrders from './PurchasedOrders';

const { TabPane } = Tabs;

const OrderByStatus = () => (
  <Tabs defaultActiveKey="1" centered>
    <TabPane tab="Đã đặt hàng" key="orderedOrders">
      <OrderedOrders />
    </TabPane>
    <TabPane tab="Đã thanh toán trước" key="purchasedOrders">
      <PurchasedOrders />
    </TabPane>
    <TabPane tab="Đang vận chuyển" key="deliveringOrders">
      <DeliveringOrders />
    </TabPane>
    <TabPane tab="Hoàn thành" key="completedOrders">
      <CompletedOrders />
    </TabPane>
    <TabPane tab="Đã hủy" key="canceledOrders">
      <CanceleddOrders />
    </TabPane>
  </Tabs>
);
export default OrderByStatus;
