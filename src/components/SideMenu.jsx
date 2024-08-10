import { Layout, Menu, Image, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useShareStore from '../store/useSharedStore';
import { useNavigate } from 'react-router-dom';

const SideMenu = (props) => {
  const { sideMenuItems } = props;
  const { isMenuToggleCollapsed } = useShareStore((state) => state);
  const location = useLocation();
  const navigate = useNavigate();
  
  return (
    <Layout.Sider
      trigger={null}
      collapsed={isMenuToggleCollapsed}
      width={'20%'}
      // className="bg-cyan-900"
    >
      <div className="flex justify-center items-center" style={{ height: '10%' }}>
        <Link onClick={() => {
                  Modal.confirm({
                    title: 'Bạn có chắc chắn muốn đăng xuất không?',
                    okText: 'Có',
                    okType: 'danger',
                    cancelText: 'Không',
                    onOk() {
                      navigate('/login');
                    },
    
                  });
                }}>
          {/* <Image
            // src={menuToggleCollapsed ? onlyLogo : fullLogo}
            preview={false}
            height={isMenuToggleCollapsed ? 45 : 50}
          /> */}
          {isMenuToggleCollapsed ? <></> : <h1>THEFIVEMENS SHOES</h1>}
        </Link>
      </div>
      <div style={{ height: '90%' }}>
        <Menu
          // defaultOpenKeys={['qlbs']}
          selectedKeys={[location.pathname]}
          defaultSelectedKeys={[location.pathname]}
          theme="dark"
          mode="inline"
          items={sideMenuItems}
          // className="bg-cyan-900"
        ></Menu>
      </div>
    </Layout.Sider>
  );
};

export default SideMenu;
