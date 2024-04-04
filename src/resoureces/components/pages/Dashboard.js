import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Spinner, Navbar, FormControl, Form, ListGroup } from 'react-bootstrap';
import '../css/Dashboard.css';
import AxiosInstance from '../../helper/Axiosintances';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const revenueData = [150000, 300000, 50000];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await AxiosInstance().get('/api/users');
        if (response && Array.isArray(response.users)) {
          const sortedUsers = response.users.sort((a, b) => b.balance - a.balance);
          setUsers(sortedUsers);
        } else {
          console.error('Error fetching users');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);  

  const getMonthNames = () => {
    const date = new Date();
    const currentMonth = date.getMonth();
    const formatter = new Intl.DateTimeFormat('en', { month: 'long' });

    return [
      formatter.format(new Date(date.getFullYear(), currentMonth - 2, 1)),
      formatter.format(new Date(date.getFullYear(), currentMonth - 1, 1)),
      formatter.format(new Date(date.getFullYear(), currentMonth, 1)),
    ];
  };

  const lineChartData = {
    labels: getMonthNames(),
    datasets: [
      {
        label: 'dữ liệu',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
        data: revenueData,
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
      <div style={{ height: '50px', backgroundColor: 'rgb(248, 249, 250)' }}></div>
      <div className="row">
        <div className="col-md-6">
          <h2 className="text-center">Doanh thu </h2>
          <div className="chart-container">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
        <div className="col-md-6">
          <h2 className="text-center">Xếp hạng người nạp</h2>
          <div className="user-list-container">
            <ListGroup>
              {filteredUsers.map((user, index) => (
                <ListGroup.Item key={user._id || index}>
                  <strong>{user.name}</strong> - {user.balance} vnd
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
