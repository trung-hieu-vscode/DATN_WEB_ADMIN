import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Dashboard.css';
import AxiosInstance from '../../helper/Axiosintances';

const Dashboard = (props) => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [adCounts, setAdCounts] = useState(0);
    const [newUserCounts, setNewUserCounts] = useState(0);
    const [postCounts, setPostCounts] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetching users
                const response = await AxiosInstance().get('api/users');
                if (response && Array.isArray(response.users)) {
                    const sortedUsers = response.users.sort((a, b) => new Date(b.balance) - new Date(a.balance));
                    setUsers(sortedUsers);
                } else {
                    console.error('Error');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const barChartData = {
        labels: ['Số lượng VIP', 'Số người dùng ', 'Số tin đăng'],
        datasets: [
            {
                label: 'Dữ liệu',
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 1,
                data: [postCounts, users.length, adCounts]
            }
        ]
    };

    const barChartOptions = {
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

    return (
        <div className="container-fluid">
            <h1 className="text-center mt-3 mb-5">Dashboard Page</h1>
            <div className="row">
                <div className="col-md-6">
                    <h2 className="text-center">Thống kê</h2>
                    <div className="chart-container">
                        <Bar
                            data={barChartData}
                            options={barChartOptions}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <h2 className="text-center">Danh sách người nạp</h2>
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
