import React from 'react';
import { Layout as AntLayout } from 'antd';
import Header from '../Header';
import SideMenu from '../SideMenu';
const GlobalLayout = (props) => {
  const { sideMenuItems } = props;
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <SideMenu sideMenuItems={sideMenuItems} />

      <AntLayout className="site-layout">
        <Header />
        {props.children}
      </AntLayout>
    </AntLayout>
  );
};

export default GlobalLayout;
