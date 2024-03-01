import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../helper/Axiosintances';
import { toast } from 'react-toastify';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { IoLockClosed, IoLockOpen } from "react-icons/io5";
import { postNewsData } from '../../Service/PostNewServices';
import '../css/userList.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const PostPage = () => {
    const [postData, setPostData] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await postNewsData();
            setPostData(res); // Giả sử response trả về dữ liệu ở trong 'data'
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Lỗi khi tải dữ liệu bản tin!');
            setLoading(false);
        }
    };

    const toggleActivation = async (postId, activable) => {
        const action = activable ? 'ẩn' : 'hiện'; // Hiện hoặc ẩn bài viết tùy thuộc vào trạng thái hiện tại
        MySwal.fire({
            title: `Bạn có chắc chắn muốn ${action} bài viết này không?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Đúng, ${action} bài viết!`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await AxiosInstance().post(`/api/postnews/activable/${postId}`);
                    if (response.success) {
                        toast.success(`Bài viết đã được ${action} thành công.`);
                        fetchData();
                    } else {
                        toast.error(`Có lỗi xảy ra khi ${action} bài viết: ${response.message}`);
                    }
                } catch (error) {
                    console.error(`Error ${action}ing post:`, error);
                    toast.error(`Lỗi khi ${action} bài viết.`);
                }
            }
        });
    };


    const handleShowModal = (post) => {
        setSelectedPost(post);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const filteredPostData = postData.filter(post =>
        post.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" role="status" />
                <p className="mt-3">Loading post page...</p>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <h1 className="post-page-title">PostNews</h1>
            <div>
                <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Nhập từ muốn tìm kiếm"
                />
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPostData.map((post, index) => (
                        <tr key={post._id}>
                            <td>{index + 1}</td>
                            <td>{post.title}</td>
                            <td>
                                {post.files && post.files.length > 0 && (
                                    <img src={`https://datnapi.vercel.app/${post.files[0]}`} alt="post" style={{ width: '100px', height: 'auto' }} />
                                )}
                            </td>
                            <td>{post.activable ? 'Active' : 'Inactive'}</td>
                            <td>
                                <Button variant="info" onClick={() => handleShowModal(post)}>
                                    Details
                                </Button>
                                <Button
                                    variant={post.activable ? 'success' : 'secondary'}
                                    onClick={() => toggleActivation(post._id, post.activable)}
                                >
                                    {post.activable ? <IoLockOpen /> : <IoLockClosed />}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Post Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedPost && (
                        <div>
                            <p><strong>Title:</strong> {selectedPost.title}</p>
                            <p><strong>Status:</strong> {selectedPost.status}</p>
                            <p><strong>Detail:</strong> {selectedPost.detail}</p>
                            <p><strong>Location:</strong> {selectedPost.location}</p>
                            <p><strong>Price:</strong> {selectedPost.price} VND</p>
                            <p><strong>Created_AT:</strong> {selectedPost.created_AT}</p>
                            <p><strong>Role:</strong> {selectedPost.role}</p>
                            <p><strong>Brandid:</strong> {selectedPost.brandid}</p>
                            <p><strong>IdCategory:</strong> {selectedPost.idCategory}</p>
                            <p><strong>Userid:</strong> {selectedPost.userid}</p>
                            <p><strong>Status:</strong> {selectedPost.activable ? 'Active' : 'Inactive'}</p>
                            <p><strong>Description:</strong> {selectedPost.description}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PostPage;
