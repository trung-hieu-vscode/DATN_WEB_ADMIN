import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../helper/Axiosintances';
import '../css/userList.css';
import { IoClose, IoLockClosed, IoLockOpen } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const User = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [lockedUsers, setLockedUsers] = useState({});

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

    const handleShowModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleLockUser = async (userId) => {
        const userToLock = users.find(user => user._id === userId);
        if (!userToLock) return;
    
        try {

            const response = await AxiosInstance().post('/lock', null, {
                query: {
                    id: userId
                }
            });
            
    
            if (response.success) {
                setUsers(currentUsers =>
                    currentUsers.map(user => {
                        if (user._id === userId) {

                            return { ...user, isActivate: !user.isActivate };
                        }
                        return user;
                    })
                );
                setLockedUsers(prev => ({ ...prev, [userId]: !userToLock.isActivate }));
            } else {
                console.error('Failed to update user status:', response.message);
            }
        } catch (error) {
            console.error('Error locking/unlocking user:', error);
        }
    };    
    

    const renderUserModal = () => (
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>User Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedUser && (
                    <div>
                        <p><strong>Name:</strong> {selectedUser.name}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>VIP:</strong> {selectedUser.vip ? "Yes" : "No"}</p>
                        <p><strong>Phone:</strong> {selectedUser.phone}</p>
                        <p><strong>Activate:</strong> {selectedUser.isActivate ? " Activated" : "Not Activated"}</p>
                        <p><strong>Balance:</strong> {selectedUser.balance} vnd</p>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
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
    const lockedStyle = {
        backgroundColor: '#f8d7da',
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
                        <th style={center}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user, index) => (
                        <tr key={user._id} style={lockedUsers[user._id] ? lockedStyle : {}}>
                            <td style={cellStyle}>{index + 1}</td>
                            <td style={cellStyle}>{user.name}</td>
                            <td style={cellStyle}>{user.email}</td>
                            <td style={center}>{user.vip ? <FaCheck /> : <IoClose />}</td>
                            <td style={center}>
                                <Button variant="container-fluid" onClick={() => handleShowModal(user)}>Details</Button>
                                &nbsp;
                                {lockedUsers[user._id] ? (
                                    <Button variant="success" onClick={() => handleLockUser(user._id)}><IoLockOpen /></Button>
                                ) : (
                                    <Button variant="danger" onClick={() => handleLockUser(user._id)}><IoLockClosed /></Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {renderUserModal()}
        </div>
    );
};

export default User;
