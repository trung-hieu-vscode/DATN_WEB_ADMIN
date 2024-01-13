import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../helper/Axiosintances';
import AddUserDailog from '../AddUserDailog';
import swal from 'sweetalert';

const User = () => {
    const [users, setUsers] = useState([]);
    const [showAddUserDialog, setShowAddUserDialog] = useState(false);

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
                    // Check if the URL is correctly formatted
                    const url = `https://datnapi.vercel.app/api/delete-user?id=${_id}`;
                    const result = await AxiosInstance().delete(url);
    
                    if (result.status === 200) {
                        swal('Xóa thành công', { icon: 'success' });
                        setUsers(users.filter(user => user._id !== _id));
                    } else {    
                        swal('Xóa thất bại', { icon: 'error' });
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                    // Provide a more detailed error message
                    swal('Có lỗi xảy ra khi xóa người dùng. Kiểm tra console để biết chi tiết.', { icon: 'error' });
                }
            }
        });
    }
    
    

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
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Reputation</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.uytin}%</td>
                            <td>
                                <button onClick={() => handleDeleteUser(user._id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default User;
