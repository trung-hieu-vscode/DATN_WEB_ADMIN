import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../helper/Axiosintances';
import { deletePostnews, postNewsData } from '../../Service/PostNewServices';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
// import './postPage.css'; // Import CSS file for styling

const PostPage = () => {
    const [postData, setPostData] = useState([]);

    const handleStatus = status => (status ? 'Còn hàng' : 'Không còn hàng');

    const fetchData = async () => {
        try {
            const res = await postNewsData();
            setPostData(res);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Lỗi khi tải dữ liệu bản tin!');
        }
    };

    const handleDelete = async id => {
        try {
            swal({
                title: 'Bạn muốn xóa bản tin này?',
                text: 'Sau khi xóa, bạn sẽ không thể khôi phục bản tin này!',
                icon: 'warning',
                buttons: true,
                dangerMode: true,
            }).then(willDelete => {
                if (willDelete) {
                    deletePostnews(id);
                    const updatedData = postData.filter(item => item._id !== id);
                    setPostData(updatedData);
                    toast.success('Xóa bản tin thành công!');
                } else {
                    toast.error('Bạn đã hủy xóa!');
                }
            });
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error('Xóa bản tin thất bại!');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
    };

    const cellStyle = {
        border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'left',
    };

    return (
        <div className="post-page">
            <h1 className="post-page-title">PostNews</h1>
            <hr />
            <div className="button-container">
                <button className="add-button">Thêm</button>
                {/* Add/Edit buttons go here */}
            </div>
            <table className="post-table" style={tableStyle}>
                <thead>
                    <tr>
                        <th style={cellStyle}>#</th>
                        <th style={cellStyle}>Title</th>
                        <th style={cellStyle}>Status</th>
                        <th style={cellStyle}>Detail</th>
                        <th style={cellStyle}>Location</th>
                        <th style={cellStyle}>Price</th>
                        <th style={cellStyle}>Created_AT</th>
                        <th style={cellStyle}>Files</th>
                        <th style={cellStyle}>Role</th>
                        <th style={cellStyle}>Activate</th>
                        <th style={cellStyle}>Userid</th>
                        <th style={cellStyle}>BrandId</th>
                        <th style={cellStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {postData.map((item, index) => (
                        <tr key={item._id}>
                            <td style={cellStyle}>{index + 1}</td>
                            <td style={cellStyle}>{item.title}</td>
                            <td style={cellStyle}>{handleStatus(item.status)}</td>
                            <td style={cellStyle}>{item.detail}</td>
                            <td style={cellStyle}>{item.location}</td>
                            <td style={cellStyle}>{item.price}</td>
                            <td style={cellStyle}>{item.created_AT}</td>
                            <td style={cellStyle}>
                                <img
                                    src={`https://datnapi.vercel.app/${item.files[0]}`}
                                    alt="postnews"
                                    className="post-image"
                                    width={'90%'}
                                    height={'90%'}
                                />
                            </td>
                            <td style={cellStyle}>{item.role}</td>
                            <td style={cellStyle}>{item.activable ? 'Đã kích hoạt' : 'Chưa kích hoạt'}</td>
                            <td style={cellStyle}>{item.userid}</td>
                            <td style={cellStyle}>{item.brandId}</td>
                            <td style={cellStyle}>
                                <button className="edit-button">Sửa</button>
                                <button className="delete-button" onClick={() => handleDelete(item._id)}>
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PostPage;
