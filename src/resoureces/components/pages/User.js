import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../helper/Axiosintances';
import AddUserDailog from '../AddUserDailog';
import EditUserDialog from '../EditUserDailog';
import swal from 'sweetalert';
import userList from '../css/userList.css'

const User = () => {
    const [users, setUsers] = useState([]);
    const [showAddUserDialog, setShowAddUserDialog] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showEditUserDialog, setShowEditUserDialog] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await AxiosInstance().get('api/user');
                if (response && Array.isArray(response.users)) {
                    setUsers(response.users);
                } else {
                    console.error('Error');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleOpenAddUserDialog = () => {
        setShowAddUserDialog(true);
    };
    const handleDeleteUser = async (_id) => {
        swal({
            title: "Xác nhận xóa người dùng?",
            text: "Bạn có chắc chắn muốn xóa người dùng này?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                try {
                    const result = await AxiosInstance().delete(`/api/delete-user?${_id}`);

                    if (result.status === 200) {
                        swal('Xóa thành công', { icon: 'success' });
                        setUsers(users.filter(user => user._id !== _id));
                    } else {
                        swal('Xóa thất bại', { icon: 'error' });
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                    swal('Có lỗi xảy ra khi xóa người dùng. Kiểm tra console để biết chi tiết.', { icon: 'error' });
                }
            }
        });
    }

    const handleEditUser = (_id) => {

        const userToEdit = users.find(user => user._id === _id);
        if (!userToEdit) {
            swal("Người dùng không tồn tại!", { icon: "error" });
            return;
        }

        setEditingUser(userToEdit);

        setShowEditUserDialog(true);
    };

        // Style cho bảng
        const tableStyle = {
            width: '100%',
            borderCollapse: 'collapse',
        };
    
        // Style cho header và cell
        const cellStyle = {
            border: '1px solid #ddd',
            padding: '8px',
            textAlign: 'left',
        };

    return (
        <div className="container">
            <h1>User List</h1>
            <button onClick={handleOpenAddUserDialog}>Create</button>
            {showAddUserDialog && (
                <AddUserDailog
                    onClose={() => setShowAddUserDialog(false)}
                    onAddUser={(newUser) => {
                        setUsers([...users, newUser]);
                        setShowAddUserDialog(false);
                    }}
                />
            )}
            <table className="table" style={tableStyle}>
                <thead>
                    <tr>
                        <th style={cellStyle}>#</th>
                        <th style={cellStyle}>Name</th>
                        <th style={cellStyle}>Email</th>
                        <th style={cellStyle}>Phone</th>
                        <th style={cellStyle}>Reputation</th>
                        <th style={cellStyle}>VIP</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td style={cellStyle}>{index + 1}</td>
                            <td style={cellStyle}>{user.name}</td>
                            <td style={cellStyle}>{user.email}</td>
                            <td style={cellStyle}>{user.phone}</td>
                            <td style={cellStyle}>{user.uytin}%</td>
                            <td style={cellStyle}>{user.vip}False</td>
                            <tr />
                            <td style={cellStyle}>
                                <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                            </td>
                            <td style={cellStyle}>
                                <button onClick={() => handleEditUser(user._id)}>Edit</button>
                            </td>
                            {showEditUserDialog && editingUser && (
                                <EditUserDialog
                                    user={editingUser}
                                    onClose={() => {
                                        setShowEditUserDialog(false);
                                        setEditingUser(null);
                                    }}
                                    onSave={async (updatedUser) => {
                                        try {
                                            // Gọi API để cập nhật thông tin người dùng
                                            const response = await AxiosInstance().post(`/api/update-user/${updatedUser._id}`, updatedUser);
                                            if (response.status === 200) {
                                                // Cập nhật danh sách người dùng
                                                setUsers(users.map(user => user._id === updatedUser._id ? { ...user, ...updatedUser } : user));
                                                // Đóng dialog chỉnh sửa
                                                setShowEditUserDialog(false);
                                                swal("Người dùng đã được cập nhật thành công!", { icon: "success" });
                                            } else {
                                                throw new Error('Cập nhật không thành công');
                                            }
                                        } catch (error) {
                                            console.error('Lỗi khi cập nhật người dùng:', error);
                                            swal("Lỗi khi cập nhật thông tin người dùng.", { icon: "error" });
                                        }
                                    }}
                                />
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default User;
