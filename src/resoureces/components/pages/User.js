import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../helper/Axiosintances';
import '../css/userList.css';
import { IoClose, IoLockClosed, IoLockOpen, IoCheckmarkCircleSharp, IoCloseCircleSharp } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const MySwal = withReactContent(Swal);

const User = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [lockedUsers, setLockedUsers] = useState({});

    const fetchUsers = async () => {
        try {
            const response = await AxiosInstance().get('api/users');
            if (response && Array.isArray(response.users)) {
                const sortedUsers = response.users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setUsers(sortedUsers);
            } else {
                console.error('Error fetching users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
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

    const handleLockUser = async (userId, isActivate) => {
        const action = isActivate ? 'lock' : 'unlock';
        MySwal.fire({
            title: `Are you sure?`,
            text: `Do you really want to ${action} this user?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${action} it!`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await AxiosInstance().post(`/api/lock-unlock/user/?userId=${userId}`);
                    if (response.success) {
                        fetchUsers();
                        MySwal.fire(
                            'Updated!',
                            `User has been ${action}ed successfully.`,
                            'success'
                        );
                    } else {
                        MySwal.fire(
                            'Failed!',
                            `Failed to ${action} user: ${response.message}`,
                            'error'
                        );
                    }
                    fetchUsers();
                } catch (error) {
                    MySwal.fire(
                        'Error!',
                        `Error ${action}ing user: ${error.message}`,
                        'error'
                    );
                }
            }
        });
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
                        {/* <p><strong>Activate:</strong> {selectedUser.isActivate ? " Activated" : "Not Activated"}</p> */}
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
                        <th style={center}>Activate</th>
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
                            <td style={center} >
                                {user.isActivate ? (
                                    <IoCheckmarkCircleSharp style={{ color: 'green' }} />
                                ) : (
                                    <IoCloseCircleSharp style={{ color: 'red' }} />
                                )}
                            </td>
                            <td style={center}>
                                <Button onClick={() => handleShowModal(user)}>Details</Button>
                                &nbsp;
                                {user.isActivate ? (
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
