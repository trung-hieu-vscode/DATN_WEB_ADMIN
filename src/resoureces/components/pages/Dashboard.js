import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Button, Spinner, ListGroup, Dropdown } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/Dashboard.css';
import AxiosInstance from '../../helper/Axiosintances';
import moment from 'moment';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState([]);
  const [startDate, setStartDate] = useState(moment().subtract(6, 'days').toDate());
  const [endDate, setEndDate] = useState(new Date());
  const [totalPosts, setTotalPosts] = useState(0);

  const fetchData = async () => {
    try {
      const response = await AxiosInstance().get('/api/transaction/get_all_buy_vip');
      if (response.data && Array.isArray(response.data)) {
        const data = response.data.map(item => item.amount);
        setRevenueData(data);
      } else {
        console.error('Error fetching revenue data');
      }
      const responsePosts = await AxiosInstance().get('/api/postnews');
      if (responsePosts && Array.isArray(responsePosts.data)) {
        setTotalPosts(responsePosts.data.length);
      } else {
        console.error('Error fetching posts');
      }
      const responseUser = await AxiosInstance().get('/api/users');
      if (responseUser && Array.isArray(responseUser.users)) {
        const sortedUsers = responseUser.users.sort((a, b) => b.balance - a.balance);
        setUsers(sortedUsers);
      } else {
        console.error('Error fetching users');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const getDates = () => {
    let dateArray = [];
    let currentDate = moment(startDate).startOf('day');
    let end = moment(endDate).startOf('day');
    while (currentDate <= end) {
      dateArray.push(currentDate.format('DD-MM'));
      currentDate = currentDate.add(1, 'days');
    }
    return dateArray;
  };

  function formatBalance(balance) {
    return new Intl.NumberFormat('de-DE').format(balance);
  }

  const barChartData = {
    labels: getDates(),
    datasets: [
      {
        label: 'VNĐ',
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(0, 123, 255, 0.75)',
        hoverBorderColor: 'rgba(0, 123, 255, 1)',
        data: revenueData,
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    maintainAspectRatio: false,
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

  const totalAmount = revenueData.reduce((total, amount) => total + amount, 0);
  const totalUsers = users.length;

  const boxData1 = {
    background: 'rgba(0, 123, 255, 1)',
    alignItems: 'center',
    height: 90,
    width: 200,
    borderRadius: 10,
    alignContent: 'center',
    marginRight: '20px',
  
  }
  const boxData = {
    background: '#28a745',
    alignItems: 'center',
    height: 90,
    width: 200,
    borderRadius: 10,
    alignContent: 'center',
    marginRight: '20px',
  
  }
  const boxData2 = {
    background: '#f9862e',
    alignItems: 'center',
    height: 90,
    width: 200,
    borderRadius: 10,
    alignContent: 'center',
    marginRight: '20px',
  
  }

  return (
    <div className="container-fluid">
      <h1 className="display-4 post-page-title">Bảng điều khiển</h1>
      <div style={{ height: '50px', backgroundColor: 'rgb(248, 249, 250)' }}></div>
      <div className="d-flex justify-content-start" style={{marginTop:10}}>
        <div className="box-container" style={boxData1}>
          <p className="text-center" style={{ color: 'white', fontSize: 16, marginTop:'5%' }}><strong>Tổng doanh thu:</strong><br/>{formatBalance(totalAmount)}</p>
        </div>
        <div className="box-container" style={boxData2}>
          <p className="text-center" style={{ color: 'white', fontSize: 16, marginTop:'5%' }}><strong>Tổng số người dùng:</strong><br/>{totalUsers}</p>
        </div>
        <div className="box-container" style={boxData}>
          <p className="text-center" style={{ color: 'white', fontSize: 16, marginTop:'5%' }}><strong>Tổng số bài đăng:</strong><br/>{totalPosts}</p> {/* Add totalPosts here */}
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <h2 className="text-center">Thống kê doanh thu</h2>
          <div className="text-center" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
  <DatePicker
    selected={startDate}
    onChange={date => setStartDate(date)}
    selectsStart
    startDate={startDate}
    endDate={endDate}
    className="date-picker"
    dateFormat="dd-MM-yyyy"
    style={{ marginRight: '20px' }}
  />
  <DatePicker
    selected={endDate}
    onChange={date => setEndDate(date)}
    selectsEnd
    startDate={startDate}
    endDate={endDate}
    minDate={startDate}
    className="date-picker"
    dateFormat="dd-MM-yyyy"
  />
</div>

          <div className="chart-container">
            <Bar data={barChartData} options={barChartOptions} height={400} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
