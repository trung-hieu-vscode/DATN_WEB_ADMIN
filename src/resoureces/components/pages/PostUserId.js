import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import AxiosInstance from '../../helper/Axiosintances';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const PostUserId = () => {
    const { idUser } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const getUserName = () => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get("name");
    };

    const userName = getUserName();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await AxiosInstance().get(`/api/postnews/user/${idUser}`);
                if (response.data && Array.isArray(response.data.posts)) {
                    setPosts(response.data.posts);
                } else {
                    setPosts([]);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [idUser]);

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

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

    return (
        <div className="container-fluid">
            {loading ? (
                <Spinner animation="border" role="status" />
            ) : (
                <div>
                    <h2>Bài viết của <span style={{ fontWeight: 'bold', color: 'blue' }}>{userName}</span></h2>
                    <div style={{height:'50px', backgroundColor:'rgb(248, 249, 250)'}}></div>
                    {posts.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover" style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={center}>Tên sản phẩm</th>
                                        <th style={center}>Chi tiết</th>
                                        <th style={center}>Địa điểm</th>
                                        <th style={center}>Giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.map((post) => (
                                        <tr key={post._id}>
                                            <td style={cellStyle}>{post.title}</td>
                                            <td style={cellStyle}>{post.detail}</td>
                                            <td style={cellStyle}>{post.location}</td>
                                            <td style={cellStyle}>{formatPrice(post.price)}VNĐ</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>Không có bài viết nào.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostUserId;
