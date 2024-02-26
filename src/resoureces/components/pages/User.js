import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../helper/Axiosintances';
import swal from 'sweetalert';
import userList from '../css/userList.css';
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";

const User = () => {
    const [users, setUsers] = useState([]);
    const [showAddUserDialog, setShowAddUserDialog] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showEditUserDialog, setShowEditUserDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await AxiosInstance().get('api/users');
                if (response && Array.isArray(response.users)) {
                    const sortedUsers = response.users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setUsers(sortedUsers);
                } else {
                    console.error('Error');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = searchTerm.length === 0 
    ? users 
    : users.filter(user =>
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );

    // Styles
    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
    };
    const cellStyle = {
        border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'left',
    };
    const center = {
        border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'center',
    };

    return (
        <div className="container-fluid">
            <h1>User List</h1>
            <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px' }}
            />
            <table className="table" style={tableStyle}>
                <thead>
                    <tr>
                        <th style={cellStyle}>#</th>
                        <th style={cellStyle}>Name</th>
                        <th style={cellStyle}>Email</th>
                        <th style={center}>VIP</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user, index) => (
                        <tr key={user._id}>
                            <td style={cellStyle}>{index + 1}</td>
                            <td style={cellStyle}>{user.name}</td>
                            <td style={cellStyle}>{user.email}</td>
                            <td style={center}>{user.vip ? <FaCheck/> : <IoClose/>}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default User;
