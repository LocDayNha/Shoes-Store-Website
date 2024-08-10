import { Layout as AntLayout } from 'antd';
import React from 'react';
import {
  FaChartPie,
  FaChartBar,
  FaShoppingCart,
  FaHome,
  FaUserAlt,
  FaCapsules,
  FaStar,
} from 'react-icons/fa';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import GlobalLayout from './GlobalLayout';
import { AiOutlineOrderedList } from 'react-icons/ai';
import { RiProductHuntLine } from 'react-icons/ri';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sideMenuItems = [
    {
      label: <Link to="/admin/home">Trang chủ</Link>,
      icon: <FaHome style={{ fontSize: '20px' }} />,
      key: '/admin/home',
    },
    {
      label: <Link to="/admin/user">Người dùng</Link>,
      icon: <FaUserAlt style={{ fontSize: '20px' }} />,
      key: '/admin/user',
    },
    {
      label: <Link to="/admin/product">Quản lý sản phẩm</Link>,
      icon: <FaCapsules style={{ fontSize: '20px' }} />,
      key: '/admin/product',
    },
    {
      label: <Link to="/admin/brand">Quản lý thương hiệu</Link>,
      icon: <FaChartPie style={{ fontSize: '20px' }} />,
      key: '/admin/brand',
    },
    {
      label: <Link to="/admin/order-by-status">Quản lý đơn hàng</Link>,
      icon: <FaShoppingCart style={{ fontSize: '20px' }} />,
      key: '/admin/order-by-status',
    },
    {
      label: 'Thống kê',
      icon: <FaChartBar style={{ fontSize: '20px' }} />,
      key: '/admin/static',
      children: [
        {
          key: '/admin/static/order',
          label: <Link to="/admin/static/order">Đơn hàng</Link>,
          icon: <AiOutlineOrderedList />,
        },
        {
          key: '/admin/static/product',
          label: <Link to="/admin/static/product">Sản Phẩm</Link>,
          icon: <RiProductHuntLine />,
        },
      ],
    },
    {
      label: 'Đánh giá',
      icon: <FaStar style={{ fontSize: '20px' }} />,
      key: '/admin/rating',
      children: [
        {
          key: '/admin/rating/order',
          label: <Link to="/admin/rating/order">Đơn hàng</Link>,
          icon: <AiOutlineOrderedList />,
        },
        {
          key: '/admin/rating/product',
          label: <Link to="/admin/rating/product">Sản Phẩm</Link>,
          icon: <RiProductHuntLine />,
        },
      ],
    },
    // {
    //   label: <Link to="/admin/order-by-status">OrderByStatus</Link>,
    //   icon: <FaShoppingCart style={{ fontSize: '20px' }} />,
    //   key: '/admin/order-by-status',
    // },
  ];

  return (
    <GlobalLayout sideMenuItems={sideMenuItems}>
      <AntLayout.Content>
        <Outlet />
      </AntLayout.Content>
    </GlobalLayout>
  );
};

export default AdminLayout;
