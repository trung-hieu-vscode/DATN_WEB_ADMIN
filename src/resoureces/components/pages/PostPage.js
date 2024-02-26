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
                        <th style={cellStyle}>Userid</th>
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
                            <td style={cellStyle}>{item.userid}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PostPage;
