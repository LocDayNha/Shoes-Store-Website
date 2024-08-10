import { Layout } from 'antd';
import { useLocation } from 'react-router-dom';
import useShareStore from '../store/useSharedStore';
import { AiOutlineMenuUnfold, AiOutlineMenuFold, AiOutlineSearch } from 'react-icons/ai';
const Header = () => {
  const { isMenuToggleCollapsed, setIsMenuToggleCollapsed } = useShareStore((state) => state);
  //   const { signOut } = useAuthStore((state) => state);
  const location = useLocation();

  const getPageTitle = () => {
    const pathnameURL = location.pathname;

    switch (pathnameURL) {
      case '/expert/dashboard':
        return 'Dashboard';
      case '/admin/home':
        return 'Trang chủ';
      case '/admin/user':
        return 'Người dùng';
      case '/admin/product':
        return 'Sản phẩm';
      case '/admin/brand':
        return 'Thương hiệu';
      case '/admin/order-by-status':
        return 'Đơn hàng';
      case '/admin/static':
        return 'Thống kê';

      default:
        return 'Dashboard';
    }
  };

  const handleClickToggleMenu = () => {
    console.log(isMenuToggleCollapsed);
    setIsMenuToggleCollapsed(!isMenuToggleCollapsed);
  };

  return (
    <Layout.Header className="bg-gray-300 flex justify-between p-0 px-3">
      <div className="flex items-center">
        {isMenuToggleCollapsed ? (
          <AiOutlineMenuUnfold
            size={30}
            className="cursor-pointer"
            onClick={() => handleClickToggleMenu()}
          />
        ) : (
          <AiOutlineMenuFold
            size={30}
            className="cursor-pointer"
            onClick={() => handleClickToggleMenu()}
          />
        )}
        <h2 style={{ display: 'inline', marginLeft: 10 }}>{getPageTitle()}</h2>
      </div>
      {/* <div>
        <AiOutlineSearch className="cursor-pointer text-2xl h-full" />
      </div> */}
    </Layout.Header>
  );
};

export default Header;
