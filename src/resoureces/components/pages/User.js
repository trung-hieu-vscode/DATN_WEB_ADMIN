import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../helper/Axiosintances';
import '../css/userList.css';
import { IoClose, IoLockClosed, IoLockOpen, IoCheckmarkCircleSharp, IoCloseCircleSharp } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Modal, Button, Spinner, Navbar, FormControl, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const MySwal = withReactContent(Swal);

const User = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [lockedUsers, setLockedUsers] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await AxiosInstance().get('api/users');
            if (response && Array.isArray(response.users)) {
                const unlockedUsers = response.users.filter(user => user.isActivate);

                const lockedUsers = response.users.filter(user => !user.isActivate);

                const sortedUsers = [...unlockedUsers, ...lockedUsers];
                setUsers(sortedUsers);
            } else {
                console.error('Error fetching users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
        setLoading(false);
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
        const action = isActivate ? 'mở khóa' : 'khóa';
        MySwal.fire({
            title: `Bạn có chắc chắn muốn ${action} người dùng này không?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Đúng, ${action} người dùng này!`,
            cancelButtonText: 'Hủy',
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

    const handleLockUnlockAllUsers = async (lock) => {
        const action = lock ? 'khóa' : 'mở khóa';
        const actionPastTense = lock ? 'đã khóa' : 'đã mở khóa';
        MySwal.fire({
            title: `Bạn có chắc chắn muốn ${action} tất cả người dùng không?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Có, ${action} họ!`,
            cancelButtonText: 'Hủy',
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                const requests = users.map(user =>
                    AxiosInstance().post(`/api/lock-unlock/user/?userId=${user._id}&lock=${lock ? 'true' : 'false'}`)
                );
                try {
                    await Promise.allSettled(requests);
                    MySwal.fire('Hoàn tất!', `Tất cả người dùng ${actionPastTense}.`, 'success');
                } catch (error) {
                    MySwal.fire(
                        'Error!',
                        `Error ${action}ing user: ${error.message}`,
                        'error'
                    );
                } finally {
                    fetchUsers(); // Cập nhật lại danh sách người dùng để phản ánh thay đổi
                    setLoading(false);
                }
            }
        });
    };

    const renderUserModal = () => (
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Thông tin chi tiết người dùng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedUser && (
                    <div>
                        <p><strong>Tên người dùng:</strong> {selectedUser.name}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>VIP:</strong> {selectedUser.vip ? "Đã có VIP" : "Không có VIP"}</p>
                        <p><strong>Số điện thoại:</strong> {selectedUser.phone}</p>
                        {/* <p><strong>Activate:</strong> {selectedUser.isActivate ? " Activated" : "Not Activated"}</p> */}
                        <p><strong>Số tiền:</strong> {selectedUser.balance} vnd</p>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => {
                    const url = new URL(window.location.origin + `/user-posts/${selectedUser._id}`);
                    url.searchParams.append("name", selectedUser.name);
                    window.location.href = url;
                }}>
                    Bài viết đã đăng
                </Button>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Đóng
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

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" role="status" />
                <p className="mt-3">Đang tải danh sách người dùng...</p>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <h1 className="display-4 post-page-title">Danh sách người dùng</h1>
            <Navbar bg="light" expand="lg" className="mb-3">
                <Navbar.Brand href="#home">Tìm Kiếm</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Form inline>
                        <FormControl
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ marginBottom: '0px' }}
                        />
                    </Form>
                </Navbar.Collapse>
            </Navbar>
            <table className="table" style={tableStyle}>
                <thead>
                    <tr>
                        <th style={cellStyle}>STT</th>
                        <th style={cellStyle}>Tên người dùng</th>
                        <th style={cellStyle}>Email</th>
                        <th style={center}>VIP</th>
                        <th style={center}>Trạng thái</th>
                        <th style={center}>
                            <Button variant="danger" onClick={() => handleLockUnlockAllUsers(true)} style={{ marginRight: '10px' }}>
                                Khoá tất cả
                            </Button>
                            <Button variant="success" onClick={() => handleLockUnlockAllUsers(false)}>
                                Mở khóa tất cả
                            </Button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user, index) => (
                        <tr key={user._id} style={lockedUsers[user._id] ? lockedStyle : {}}>
                            <td style={cellStyle}>{index + 1}</td>
                            <td style={cellStyle}>{user.name}</td>
                            <td style={cellStyle}>{user.email}</td>
                            <td style={center}>{user.vip ? <FaCheck /> : <IoClose />}</td>
                            <td style={{
                                ...center,
                                backgroundColor: user.isActivate ? '#c3e6cb' : '#f5c6cb',
                                color: user.isActivate ? 'green' : 'red',
                            }}>
                                {user.isActivate ? 'Không khóa' : 'Đã khóa'}
                            </td>

                            <td style={center}>
                                <Button onClick={() => handleShowModal(user)}>Chi tiết</Button>
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
