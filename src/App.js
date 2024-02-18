import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Navigate, Outlet, Routes, BrowserRouter } from 'react-router-dom';
import React, { useState } from 'react';
import TestLoadapi from './resoureces/components/test/TestLoadapi';
// <<<<<<< HEAD
import Login from './resoureces/Users/Login';
import Sidebar from './resoureces/components/Sidebar';
import Dashboard from './resoureces/components/pages/Dashboard';
import Analytics from './resoureces/components/pages/Analytics';
import Product from './resoureces/components/pages/Product';
import ProductList from './resoureces/components/pages/ProductList';
import About from './resoureces/components/pages/About';
import User from './resoureces/components/pages/User';
import Register from './resoureces/Users/Register';
// import Login from './resoureces/components/users/Login';
import PostPage from './resoureces/components/post';
import Chart from './resoureces/components/pages/Chart';


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
  function WithSidebar({ children }) {
    return (
      <Sidebar>{children}</Sidebar>
    );
  }

  return (
    <div className="container">
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/register" element={<Register />} />
            {/* màn hình đăng nhập, quên mật khẩu... ở đây */}
            <Route path="/login" element={<Login saveUser={saveUserToLocalStorage} />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            {/* sau khi đăng nhập thành công thì chuyển qua đây */}
            <Route path='/' element={<WithSidebar><Dashboard /></WithSidebar>} />
            <Route path="/register" element={<Register />} />
            <Route path='/user' element={<WithSidebar><User /></WithSidebar>} />
            <Route path='/dashboard' element={<WithSidebar><Dashboard /></WithSidebar>} />
            <Route path='/analytics' element={<WithSidebar><Analytics /></WithSidebar>} />
            <Route path='/chart' element={<WithSidebar><Chart /></WithSidebar>} />
            <Route path='/product' element={<WithSidebar><Product /></WithSidebar>} />
            <Route path='/productList' element={<WithSidebar><ProductList /></WithSidebar>} />
            <Route path='/about' element={<WithSidebar><About /></WithSidebar>} />
          </Route>
          <Route path="/post" element={<PostPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
