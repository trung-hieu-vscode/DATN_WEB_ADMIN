import React, { useState } from 'react';
import AxiosInstance from '../helper/Axiosintances';
import '../components/css/user.css'; // Đảm bảo rằng các styles đã được import đúng
import { FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      const body = { email, password, phone, name };
      const result = await AxiosInstance().post('api/register-user', body);

      if (result && result.success) {
        console.log('Đăng ký thành công');
        alert('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
        window.location.href = '/login'; // login 
      } else {
        alert('Đăng ký thất bại: ' + result.message);
      }
    } catch (error) {
      console.error(error);
      alert('Lỗi khi đăng ký: ' + error.response.message);
    }
  };

  return (
    <div className="body">
      <div className="wrapper">
        <form action="" onSubmit={(e) => e.preventDefault()}>
          <h1 style={{ color: "#fff" }}>Register</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Full Name"
              name='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FaUser className="icon" style={{ color: "#fff" }} />
          </div>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaEnvelope className="icon" style={{ color: "#fff" }} />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Phone"
              name='phone'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <FaPhone className="icon" style={{ color: "#fff" }} />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="icon" style={{ color: "#fff" }} />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Confirm Password"
              name='confirmPassword'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <FaLock className="icon" style={{ color: "#fff" }} />
          </div>

          <button type="button" onClick={handleRegister}>Register</button>

          <div className="login-link">
            <p style={{ color: "#fff" }}>Already have an account? <a href="/login">Login</a></p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register;