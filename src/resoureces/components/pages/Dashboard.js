import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Dashboard.css';

const Dashboard = (props) => {
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
    
    const userList = [
        { id: 1, name: 'Người dùng 1', email: 'user1@example.com' },
        { id: 2, name: 'Người dùng 2', email: 'user2@example.com' },
        { id: 3, name: 'Người dùng 3', email: 'user3@example.com' }
    ];

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
