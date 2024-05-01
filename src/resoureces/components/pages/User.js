import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../helper/Axiosintances';
import '../css/userList.css';
import { IoClose, IoLockClosed, IoLockOpen, IoCheckmarkCircleSharp, IoCloseCircleSharp } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Modal, Button, Spinner, Navbar, FormControl, Form, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';

const MySwal = withReactContent(Swal);

const User = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [lockedUsers, setLockedUsers] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState({});

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

    const fetchUserData = async (userId) => {
        try {
            const transactionResponse = await AxiosInstance().get(`api/transaction/get_recharge/${userId}`);
            const vipPostResponse = await AxiosInstance().get(`api/transaction/get_vip_posts/${userId}`);

            let transactions = [];
            let vipPosts = [];

            if (transactionResponse.data && transactionResponse.data.length > 0) {
                transactions = transactionResponse.data.map(transaction => ({
                    ...transaction,
                    type: 'transaction'
                }));
            }

            if (vipPostResponse.data && vipPostResponse.data.length > 0) {
                vipPosts = vipPostResponse.data.map(post => ({
                    ...post,
                    type: 'vipPost'
                }));
            }

            const mergedData = [...transactions, ...vipPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setSelectedUser(prevState => ({ ...prevState, userData: mergedData }));
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        if (users.length == 0) {
            fetchUsers();
        }
    }, [users]);

    const handleShowModal = async (user) => {
        if (!loadingDetails[user._id]) {
            setLoadingDetails(prev => ({ ...prev, [user._id]: true }));
            setSelectedUser(user);
            await fetchUserData(user._id);
            setShowModal(true);
            setLoadingDetails(prev => ({ ...prev, [user._id]: false }));
        }
    };

    //SL hiển thị
    const MAX_DISPLAY_TRANSACTIONS = 5;
    //data lịch sử giao dịch
    const renderTransactionsList = () => {
        if (selectedUser && selectedUser.userData && selectedUser.userData.length > 0) {
            const sortedData = selectedUser.userData.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));

            return (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {sortedData.map((data, index) => (
                        <div key={index} style={{ border: '2px dashed', borderRadius: 10, borderColor: data.paid ? '#c3e6cb' : '#f5c6cb', margin: '8px 4px', padding: 8 }}>
                            {data.type === 'transaction' ? (
                                <>
                                    <p style={{ color: data.paid ? '#28a745' : '#dc3545' }}>
                                        <strong>{data.paid ? 'Nạp tiền thành công' : 'Nạp tiền thất bại'}</strong>
                                    </p>
                                    <p><strong>Nội dung:</strong> {data.description.content}</p>
                                    <p><strong>Thời gian:</strong> {moment(data.createAt).format('DD/MM/YYYY HH:mm')}</p>
                                </>
                            ) : (
                                <>
                                    <p style={{ color: data.paid ? '#28a745' : '#dc3545' }}>
                                        <strong>{data.paid ? 'Mua VIP thành công' : 'Mua VIP thất bại'}</strong>
                                    </p>
                                    <p><strong>Nội dung:</strong> {data.description.content}</p>
                                    <p><strong>Thời gian:</strong> {moment(data.createAt).format('DD/MM/YYYY HH:mm')}</p>
                                </>
                            )}
                            {/* <div style={{ margin: '10px 0', borderBottom: '1px solid #ccc' }}></div> */}
                        </div>
                    ))}
                </div>
            );
        } else {
            return <p>Không có dữ liệu nào được tìm thấy cho người dùng này.</p>;
        }
    };

    const filteredUsers = searchTerm.length === 0
        ? users
        : users.filter(user =>
            (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );

    const handleCloseModal = () => setShowModal(false);

    const handleLockUser = async (userId, isActivate) => {
        const action = isActivate ? 'mở khóa' : 'khóa';
        MySwal.fire({
            title: `Bạn có chắc chắn muốn ${action} người dùng này không?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#f9862e',
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
            cancelButtonColor: '#f9862e',
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
                    fetchUsers();
                    setLoading(false);
                }
            }
        });
    };

    const renderUserModal = () => (
        showModal
            ?
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
                            <div style={{ margin: '10px 0', borderBottom: '1px solid #ccc' }}></div>
                            <h5>Lịch sử giao dịch: </h5>
                            {renderTransactionsList()}
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
            :
            <></>
    );

    // Styles
    const borderLeftRight = {
        border: "none",
        borderBottom: "1px solid",
    }
    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
    };
    const cellStyle = {
        ...borderLeftRight,
        padding: '8px',
        textAlign: 'left',
    };
    const center = {
        ...borderLeftRight,
        // border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'center',
    };
    const lockedStyle = {
        backgroundColor: '#f8d7da',
    };
    const cellFull = {
        ...borderLeftRight,
        padding: 0,
        width: "max-content",

        padding: "5px"
    }
    const cellStatus = {
        padding: "4px 8px",
        margin: 0,

        // success
        color: "rgb(50, 128, 72)",
        background: "rgb(234, 251, 231)",
        // fail
        colorRed: "rgb(183, 43, 26)",
        borderRed: "1px solid rgb(245, 192, 184)",
        backgroundRed: "rgb(252, 236, 234)",

        border: "1px solid rgb(198, 240, 194)",
        borderRadius: "4px",

        textAlign: "center",
        fontSize: "12px",
        fontWeight: "bold",

    }

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
                        <th style={center}>Hoạt động</th>
                        <th style={center}>Trạng thái</th>
                        <th style={center}>
                            <Button onClick={() => handleLockUnlockAllUsers(true)} style={{ marginRight: '10px', backgroundColor: '#f9862e', fontSize: 12 }}>
                                Khoá tất cả
                            </Button>
                            <Button style={{ fontSize: 12 }} variant="success" onClick={() => handleLockUnlockAllUsers(false)}>
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
                            <td style={borderLeftRight}>
                                <p style={{
                                    ...cellStatus,
                                    color: (user.socketId === 'off' || !user.socketId) ? cellStatus.colorRed : cellStatus.color,
                                    border: (user.socketId === 'off' || !user.socketId) ? cellStatus.borderRed : cellStatus.border,
                                    background: (user.socketId === 'off' || !user.socketId) ? cellStatus.backgroundRed : cellStatus.background
                                }}>
                                    {(user.socketId === 'off' || !user.socketId) ? 'Không hoạt động' : 'Đang hoạt động'}
                                </p>
                            </td>
                            <td style={borderLeftRight}>
                                <p style={{
                                    ...cellStatus,
                                    color: user.isActivate ? cellStatus.color : cellStatus.colorRed,
                                    border: user.isActivate ? cellStatus.border : cellStatus.borderRed,
                                    background: user.isActivate ? cellStatus.background : cellStatus.backgroundRed
                                }}>{user.isActivate ? 'Chưa khoá' : 'Đã khóa'}</p>
                            </td>
                            <td style={center}>
                                <Button
                                    style={{ fontSize: 12 }}
                                    onClick={() => handleShowModal(user)}
                                    disabled={loadingDetails[user._id]}
                                >
                                    {loadingDetails[user._id] ? (
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    ) : "Chi tiết"}
                                </Button>
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
