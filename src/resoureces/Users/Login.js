import React, { useState } from 'react';
import AxiosInstance from '../helper/Axiosintances';
import user from '../components/css/user.css'
import { FaUser, FaLock } from "react-icons/fa";
import Swal from 'sweetalert2';

const Login = (props) => {
  const { saveUser } = props;
  const [email, setEmail] = useState('user3@gmail.com');
  const [password, setPassword] = useState('111111');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const body = { email, password };
      const result = await AxiosInstance().post('api/login-user', body);
  
      if (result && result.success) {
        console.log('Đăng nhập thành công');
        saveUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        Swal.fire({
          icon: 'success',
          title: 'Đăng nhập thành công!',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        console.log('Đăng nhập thất bại');
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Đăng nhập thất bại!'
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Đã xảy ra lỗi khi đăng nhập!'
      });
    } finally {
      setLoading(false); // Reset loading state regardless of login success or failure
    }
  };

  return (
    <div className="body">
      <div className="wrapper">
        <form action="">
          <h1 style={{ color: "#fff" }}>Login</h1>
          <div className="input-box">
            <input
              type="email"
              placeholder="Mail"
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaUser className="icon" style={{ color: "#fff" }} />

          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              name='pswd'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="icon" style={{ color: "#fff" }} />
          </div>

          <div className="remember-forgot">
            <label style={{ color: "#fff" }}><input type="checkbox" />Remember me</label>
            <a href="#"> Forgot password ?</a>
          </div>

          <button type="button" onClick={handleLogin} disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>

          <div className="register-link">
            <p style={{ color: "#fff" }}> Don't have an account? <a href="/Register">register</a></p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login;
