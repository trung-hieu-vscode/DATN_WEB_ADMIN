import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Button, Spinner, ListGroup, Dropdown } from 'react-bootstrap';
import '../css/Dashboard.css';
import AxiosInstance from '../../helper/Axiosintances';

// Register the required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState([]);
  const [timePeriod, setTimePeriod] = useState('3months');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('3 Tháng');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance().get('/api/transaction/get_all_buy_vip');
      if (response.data && Array.isArray(response.data)) {
        const data = response.data.map(item => item.amount);
        setRevenueData(data);
      } else {
        console.error('Error fetching revenue data');
      }

      const responseUser = await AxiosInstance().get('/api/users');
      if (responseUser && Array.isArray(responseUser.users)) {
        const sortedUsers = responseUser.users.sort((a, b) => b.balance - a.balance);
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

  useEffect(() => {
    fetchData();
  }, []);

  const getDates = (period) => {
    const date = new Date();
    const currentMonth = date.getMonth();
    let dates = [];
    const formatter = new Intl.DateTimeFormat('vi', { month: 'long' });

    switch (period) {
      case '3months':
        dates = [
          formatter.format(new Date(date.getFullYear(), currentMonth - 2, 1)),
          formatter.format(new Date(date.getFullYear(), currentMonth - 1, 1)),
          formatter.format(new Date(date.getFullYear(), currentMonth, 1))
        ];
        break;
      case '1month':
        dates = [
          formatter.format(new Date(date.getFullYear(), currentMonth - 1, 1)),
          formatter.format(new Date(date.getFullYear(), currentMonth, 1))
        ];
        break;
      case '3weeks':
        for (let i = 20; i >= 0; i -= 7) {
          dates.push(new Date(date.getFullYear(), currentMonth, date.getDate() - i).toLocaleDateString());
        }
        break;
      case '1week':
        for (let i = 6; i >= 0; i--) {
          dates.push(new Date(date.getFullYear(), currentMonth, date.getDate() - i).toLocaleDateString());
        }
        break;
    }
    return dates;
  };

  function formatBalance(balance) {
    return new Intl.NumberFormat('de-DE').format(balance);
  }

  const handleSelectTimePeriod = (period, label) => {
    setTimePeriod(period);
    setSelectedTimePeriod(label);
  };

  const lineChartData = {
    labels: getDates(timePeriod),
    datasets: [
      {
        label: 'Dữ liệu',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
        data: revenueData,
        fill: false,
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'category'
      },
      y: {
        beginAtZero: true
      }
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
        <p className="mt-3">Đang tải vui lòng đợi...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <h1 className="display-4 post-page-title">Bảng điều khiển</h1>
      <div style={{ height: '50px', backgroundColor: 'rgb(248, 249, 250)' }}></div>
      <div className="row">
        <div className="col-md-6">
          <h2 className="text-center">Thống kê doanh thu</h2>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-time-period">
              {selectedTimePeriod}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item style={{fontSize:16}} onClick={() => handleSelectTimePeriod('3months', '3 tháng')}>3 tháng</Dropdown.Item>
              <Dropdown.Item style={{fontSize:16}} onClick={() => handleSelectTimePeriod('1month', '1 tháng')}>1 tháng</Dropdown.Item>
              <Dropdown.Item style={{fontSize:16}} onClick={() => handleSelectTimePeriod('1week', '1 tuần')}>1 tuần</Dropdown.Item>
              <Dropdown.Item style={{fontSize:16}} onClick={() => handleSelectTimePeriod('3weeks', '3 tuần')}>3 tuần</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div className="chart-container">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
        <div className="col-md-6">
          <h2 className="text-center">Xếp hạng nạp tiền</h2>
          <div className="user-list-container" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <ListGroup>
              {filteredUsers.map((user, index) => (
                <ListGroup.Item key={user._id || index}>
                  <strong>{user.name}</strong> - {formatBalance(user.balance)} vnd
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
