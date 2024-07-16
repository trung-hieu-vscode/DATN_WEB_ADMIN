import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Navigate, Outlet, Routes, BrowserRouter } from 'react-router-dom';
import React, { useState } from 'react';
import TestLoadapi from './resoureces/components/test/TestLoadapi';
import Login from './resoureces/Users/Login';
import Sidebar from './resoureces/components/Sidebar';
import Dashboard from './resoureces/components/pages/Dashboard';
import ListPostVip from './resoureces/components/pages/ListPostVip';
import About from './resoureces/components/pages/About';
import User from './resoureces/components/pages/User';
import Register from './resoureces/Users/Register';
import PostPage from './resoureces/components/pages/PostPage';
import PostUserId from './resoureces/components/pages/PostUserId';
import Order from './resoureces/components/pages/Order';
import Category from './resoureces/components/pages/Category';
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
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
          <Route path="/register" element={<Register/>} />
            {/* màn hình đăng nhập, quên mật khẩu... ở đây */}
            <Route path="/login" element={<Login saveUser={saveUserToLocalStorage} />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            {/* sau khi đăng nhập thành công thì chuyển qua đây */}
            <Route path='/' element={<WithSidebar><Dashboard /></WithSidebar>} />
            <Route path="/register" element={<Register/>} />
            <Route path='/user' element={<WithSidebar><User /></WithSidebar>} />
            <Route path='/dashboard' element={<WithSidebar><Dashboard /></WithSidebar>} />
            <Route path='/listpostvip' element={<WithSidebar><ListPostVip /></WithSidebar>} />
            <Route path='/postpage' element={<WithSidebar><PostPage /></WithSidebar>} />
            <Route path='/order' element={<WithSidebar><Order /></WithSidebar>} />
            <Route path='/Category' element={<WithSidebar><Category /></WithSidebar>} />
            {/* <Route path='/chart' element={<WithSidebar><Chart/></WithSidebar>} /> */}
            {/* <Route path='/productList' element={<WithSidebar><ProductList /></WithSidebar>} /> */}
            {/* <Route path='/postuserid' element={<WithSidebar><PostUserId /></WithSidebar>} /> */}
            <Route path='/user-posts/:idUser' element={<WithSidebar><PostUserId /></WithSidebar>} />
            <Route path='/about' element={<WithSidebar><About /></WithSidebar>} />
          </Route>
        </Routes>
      </BrowserRouter>
        );
}

export default App;
