    import React, { useState } from 'react';
    import swal from 'sweetalert';
    import { Dialog, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
    import AxiosInstance from '../helper/Axiosintances';
const bcrypt = require('bcryptjs');

    const AddUserDialog = ({ onClose }) => {
        const [newUser, setNewUser] = useState({
            name: '',
            email: '',
            password: '',
            phone: ''
        });

        const handleChange = (e) => {
            setNewUser({ ...newUser, [e.target.name]: e.target.value });
        };

        const handleAddUser = async () => {
            swal({
                title: "Xác nhận thêm người dùng mới?",
                // ... các tùy chọn khác của swal
            }).then(async (willAdd) => {
                if (willAdd) {
                    try {
                        const encryptedPassword = await bcrypt.hash(newUser.password, 12);
                        const userWithEncryptedPassword = {
                            ...newUser,
                            password: encryptedPassword
                        };

                        const result = await AxiosInstance().post("api/add-user", newUser);
                        console.log("Server response:", result);
        
                        if (result && result.success) {
                            swal("Thêm người dùng thành công", { icon: "success" });
                            window.location.href = '/user';
                        } else {
                            console.log("Adding user failed:", result);
                            window.location.href = '/user';
                            swal("Đang thêm người dùng", { icon: "lodaing" });
                            // swal("Không thể thêm người dùng", { icon: "error" });
                        }
                    } catch (error) {
                        console.error("Error when adding user:", error);
                        swal("Có lỗi xảy ra khi thêm người dùng.", { icon: "error" });
                    }
                }
            });
        };
        
        

        return (
            <Dialog open onClose={onClose}>
                <DialogTitle>Thêm Người Dùng</DialogTitle>
                <DialogContent>
                    <TextField label="Tên" name="name" value={newUser.name} onChange={handleChange} fullWidth />
                    <TextField label="Email" name="email" value={newUser.email} onChange={handleChange} fullWidth />
                    <TextField label="Mật khẩu" name="password" type="password" value={newUser.password} onChange={handleChange} fullWidth />
                    <TextField label="Điện thoại" name="phone" value={newUser.phone} onChange={handleChange} fullWidth />
                    <Button onClick={handleAddUser} color="primary" variant="contained">Thêm Người Dùng</Button>
                </DialogContent>
            </Dialog>
        );
    };

    export default AddUserDialog;
