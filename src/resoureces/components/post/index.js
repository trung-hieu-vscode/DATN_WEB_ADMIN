import React, { useState, useEffect } from 'react'
import AxiosInstance from '../../helper/Axiosintances';
import "./index.css"
import AddModel from './add';
import UpdateModel from './update';
import { deletePostnews, postNewsData } from '../../Services/PostNewServices';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";

const PostPage = () => {
    const [postData, setPostData] = useState([]);
    const [onOpenModal, setOnOpenModal] = useState(false);
    const [onUpdateModal, setOnUpdateModal] = useState(false);

    const handleStatus = (status) => {
        if (status === true) {
            return "Còn hàng"
        } else {
            return "Không còn hàng"
        }
    }

    const openModal = () => {
        setOnOpenModal(true);
    }
    const closeModal = () => {
        setOnOpenModal(false);
    }
    const openUpdateModal = () => {
        setOnUpdateModal(true);
    }

    const fetchData = async () => {
        const res = await postNewsData();
        console.log("check products data : ", res);
        setPostData(res);

    }

    const handleDelete = async (id) => {
        try {
            swal({
                title: "Bạn muốn xóa bản tin này?",
                text: "Sau khi xóa, bạn sẽ không thể khôi phục bản tin này!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    deletePostnews(id);
                    const deletez = postData.filter((item) => item.id !== id);
                    setPostData(deletez);
                    toast.success("Xóa bản tin thành công!");
                } else {
                    toast.error("Bạn đã hủy xóa!");
                }
            });
        } catch (e) {
            console.log(e);

            // Hiển thị thông báo lỗi
            toast.error("Xóa bản tin thất bại!");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='frame-post'>
            <h1>PostNews</h1>
            <hr />
            <>
                <button onClick={openModal}>Thêm</button>
                <AddModel
                    isOpen={onOpenModal}
                    onRequestClose={closeModal}
                    loadData={postData}
                />
            </>
            <table className="item-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Detail</th>
                        <th>Location</th>
                        <th>Price</th>
                        <th>Created_AT</th>
                        <th>Files</th>
                        <th>Role</th>
                        <th>Activate</th>
                        <th>Userid</th>
                        <th>Brandld</th>
                    </tr>
                </thead>
                <tbody>
                    {postData &&
                        postData.map((item, index) => (
                            <tr className='product-row' key={index}>
                                <td>{item.title}</td>
                                <td>
                                    {handleStatus(item.status)}
                                </td>
                                <td>{item.detail}</td>
                                <td>{item.location}</td>
                                <td>{item.price}</td>
                                <td>{item.created_AT}</td>
                                <td>
                                    <img src={item.files} alt="postnews" style={{
                                        width: "100px",
                                        height: "100px",
                                        objectFit: "cover",
                                    }} />
                                </td>
                                <td>{item.role}</td>
                                <td>
                                    {item.activable ? "Đã kích hoạt" : "Chưa kích hoạt"}
                                </td>
                                <td>{item.userid}</td>
                                <td>{item.brandld}</td>
                                <td>

                                    <button
                                        onClick={openUpdateModal}
                                    >Sửa</button>
                                    <UpdateModel
                                        isOpen={onUpdateModal}
                                        onRequestClose={closeModal}
                                    />
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        Xóa</button>

                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}

export default PostPage
