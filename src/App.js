import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Navigate, Outlet, Routes, BrowserRouter } from 'react-router-dom';
import React, { useState } from 'react';
import TestLoadapi from './resoureces/components/test/TestLoadapi';
import Login from './resoureces/Users/Login';
import Sidebar from './resoureces/components/Sidebar';
import Dashboard from './resoureces/components/pages/Dashboard';
import Analytics from './resoureces/components/pages/Analytics';
import Comment from './resoureces/components/pages/Comment';
import Product from './resoureces/components/pages/Product';
import ProductList from './resoureces/components/pages/ProductList';
import About from './resoureces/components/pages/About';


function App() {

  //đọc thông tin user từ localStorage
  const getUserFromLocalStorage = () => {
    const userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    }
    return null
  }

  //Lưu thông tin user vào localStorage
  const saveUserToLocalStorage = (userInfo) => {
    if (!userInfo) {
      localStorage.removeItem('user');
      setUser(null);
      return
    }
    localStorage.setItem('user', JSON.stringify(userInfo));
    setUser(userInfo);
  }
  const [user, setUser] = useState(getUserFromLocalStorage);
  const ProtectedRoute = () => {
    if (user) {
      return <Outlet />
    }
    return <Navigate to="/login" />
  }
  const PublicRoute = () => {
    if (user) {
      return <Navigate to="/" />
    }
    return <Outlet />
  }
  return (
    <BrowserRouter>
      <Sidebar>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/analytics' element={<Analytics />} />
          <Route path='/comment' element={<Comment />} />
          <Route path='/product' element={<Product />} />
          <Route path='/productList' element={<ProductList />} />
          <Route path='/about' element={<About />} />
        </Routes>
      </Sidebar>
    </BrowserRouter>
  );
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>
            {/* màn hình đăng nhập, quên mật khẩu... ở đây */}
            <Route path="/login" element={<Login saveUser={saveUserToLocalStorage} />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            {/* sau khi đăng nhập thành công thì chuyển qua đây */}
            <Route path="/" element={<TestLoadapi />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
