import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminLayout from './components/Layout/AdminLayout';
import AdminHome from './pages/admin/AdminHome';
import Question from './pages/admin/Question';
import Product from './pages/admin/Product';
import Brand from './pages/admin/Brand';
import Order from './pages/admin/Order';
import OrderStatic from './pages/admin/OrderStatic';
import OrderByStatus from './pages/admin/OrderByStatus';
import CompletedOrders from './pages/admin/CompletedOrders';
import User from './pages/admin/User';
import ProductStatistic from './pages/admin/ProductStatistic';
import Rating from './pages/admin/Rating';
import ProductRating from './pages/admin/ProductRating';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/user" element={<User />} />
          <Route path="/admin/product" element={<Product />} />
          <Route path="/admin/brand" element={<Brand />} />
          <Route path="/admin/order" element={<Order />} />
          <Route path="/admin/static" element={<OrderStatic />} />
          <Route path="/admin/order-by-status" element={<OrderByStatus />} />
          <Route path="/admin/completed-orders" element={<CompletedOrders />} />
          <Route path="/admin/static/order" element={<OrderStatic />} />
          <Route path="/admin/static/product" element={<ProductStatistic />} />
          <Route path="/admin/rating" element={<Rating />} />
          <Route path="/admin/rating/order" element={<Rating />} />
          <Route path="/admin/rating/product" element={<ProductRating />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
