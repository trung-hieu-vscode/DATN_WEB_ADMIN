import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Button, Spinner, ListGroup, Dropdown } from 'react-bootstrap';
import '../css/Dashboard.css';
import AxiosInstance from '../../helper/Axiosintances';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState([]);
  const [timePeriod, setTimePeriod] = useState('3months');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('3 Months');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance().get('/api/transaction/get_all_buy_vip');
      if (response && response.data && Array.isArray(response.data)) {
        const data = response.data.map(item => item.amount);
        setRevenueData(data);
      } else {
        console.error('Error fetching revenue data');
      }

      const usersResponse = await AxiosInstance().get('/api/users');
      if (usersResponse && usersResponse.users && Array.isArray(usersResponse.users)) {
        const sortedUsers = usersResponse.users.sort((a, b) => b.balance - a.balance);
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
    if (period === '3months') {
      const formatter = new Intl.DateTimeFormat('en', { month: 'long' });
      dates = [
        formatter.format(new Date(date.getFullYear(), currentMonth - 2, 1)),
        formatter.format(new Date(date.getFullYear(), currentMonth - 1, 1)),
        formatter.format(new Date(date.getFullYear(), currentMonth, 1))
      ];
    } else if (period === '1week') {
      for (let i = 6; i >= 0; i--) {
        dates.push(new Date(date.getFullYear(), currentMonth, date.getDate() - i).toLocaleDateString());
      }
    }
    return dates;
  };

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
        <p className="mt-3">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <h1 className="display-4 post-page-title">Dashboard</h1>
      <div style={{ height: '50px', backgroundColor: 'rgb(248, 249, 250)' }}></div>
      <div className="row">
        <div className="col-md-6">
          <h2 className="text-center">Thống kê</h2>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-time-period">
              {selectedTimePeriod} {/* Sử dụng state để hiển thị khoảng thời gian được chọn */}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleSelectTimePeriod('3months', '3 Months')}>3 Months</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectTimePeriod('1week', '1 Week')}>1 Week</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div className="chart-container">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
        <div className="col-md-6">
          <h2 className="text-center">Top Rechargers</h2>
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
