import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Dashboard.css';
import AxiosInstance from '../../helper/Axiosintances';

const Dashboard = (props) => {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await AxiosInstance().get('/api/users');
                setUserList(response); // Assuming response.data is an array of user objects
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const barChartData = {
        labels: ['Số lần quảng cáo', 'Số người dùng mới', 'Số tin đăng'],
        datasets: [
            {
                label: 'Dữ liệu',
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 1,
                data: [300, 500, 700]
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
                    <h2 className="text-center">Danh sách người dùng</h2>
                    <div className="user-list-container">
                        <ul className="list-group">
                            {userList.map(user => (
                                <li key={user.id} className="list-group-item">
                                    <strong>{user.name}</strong> - {user.email}
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
