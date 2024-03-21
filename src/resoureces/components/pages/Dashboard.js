import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Spinner, Navbar, FormControl, Form } from 'react-bootstrap';
import '../css/Dashboard.css';
import AxiosInstance from '../../helper/Axiosintances';
import { postNewsData } from '../../Service/PostNewServices';

const Dashboard = (props) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [adCounts, setAdCounts] = useState(0);
  const [postCounts, setPostCounts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const responseUsers = await AxiosInstance().get('api/users');
        if (responseUsers && Array.isArray(responseUsers.users)) {
          const sortedUsers = responseUsers.users.sort((a, b) => new Date(b.balance) - new Date(a.balance));
          setUsers(sortedUsers);
        } else {
          console.error('Error');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postNewsData();
        if (response && Array.isArray(response)) {
          setPostCounts(response);
        } else {
          console.error('Error');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchPost();
  }, []);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await AxiosInstance().get('api/vips');
        if (response && Array.isArray(response)) {
          setAdCounts(response);
        } else {
          console.error('Error');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchAd();
  }, []);

  const lineChartData = {
    labels: ['Số lượng VIP', 'Số người dùng', 'Số tin đăng'],
    datasets: [
      {
        label: 'Dữ liệu',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 1,
        data: [adCounts.length, users.length, postCounts.length],
        fill: false,
      }
    ]
  };

  const lineChartOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  const filteredUsers = searchTerm.length === 0
    ? users
    : users.filter(user =>
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Đang tải bảng điều khiển...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <h1 className="display-4 post-page-title">Bảng điều khiển</h1>
      <div style={{height:'50px', backgroundColor:'rgb(248, 249, 250)'}}></div>
      <div style={{ height: 30, color: '#ddd' }}></div>
      <div className="row">
        <div className="col-md-6">
          <h2 className="text-center">Thống kê</h2>
          <div className="chart-container">
            <Line
              data={lineChartData}
              options={lineChartOptions}
            />
          </div>
        </div>
        <div className="col-md-6">
          <h2 className="text-center">Xếp hạng người nạp</h2>
          <div className="user-list-container">
            <ul className="list-group">
              {filteredUsers.map(user => (
                <li key={user.id} className="list-group-item">
                  <strong>{user.name}</strong> - {user.balance} vnd
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;