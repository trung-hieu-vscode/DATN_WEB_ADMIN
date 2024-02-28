import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import { deletePostnews, postNewsData } from '../../Service/PostNewServices';
import '../css/userList.css';

const PostPage = () => {
    const [postData, setPostData] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null); 

    const handleShowModal = (post) => {
        setSelectedPost(post);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

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

    const handleStatus = (status) => (status ? 'Còn hàng' : 'Không còn hàng');

    const handleSearch = () => {
        const keyword = searchKeyword.toLowerCase().trim();

        if (!keyword) {
            fetchData();
            return;
        }

        const filteredData = postData.filter(item =>
            item.title.toLowerCase().includes(keyword)
        );
        setPostData(filteredData);
    };

    const handleSortByDate = () => {
        const sortedData = [...postData].sort((a, b) => new Date(b.created_AT) - new Date(a.created_AT));
        setPostData(sortedData);
    };

    const cellStyle = {
        border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'left',
    };
    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
    };

    return (
        <div className="container-fluid">
            <h1 className="post-page-title">PostNews</h1>
            <hr />
            <div>
                <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Nhập từ muốn tìm kiếm"
                />
                <button onClick={handleSearch}>Tìm kiếm</button>
                <button onClick={handleSortByDate}>Sắp xếp theo ngày đăng</button>
            </div>
            <hr />
            <table className="table" style={tableStyle}>
                <thead>
                    <tr>
                        <th style={cellStyle}>#</th>
                        <th style={cellStyle}>Title</th>
                        <th style={cellStyle}>Status</th>
                        <th style={cellStyle}>Price</th>
                        <th style={cellStyle}>Created AT</th>
                        <th style={cellStyle}>Image</th>
                        <th style={cellStyle}>DetailedPost</th>
                    </tr>
                </thead>
                <tbody>
                    {postData.map((item, index) => (
                        <tr key={item._id}>
                            <td style={cellStyle}>{index + 1}</td>
                            <td style={cellStyle}>{item.title}</td>
                            <td style={cellStyle}>{handleStatus(item.status)}</td>
                            <td style={cellStyle}>{item.price}</td>
                            <td style={cellStyle}>{item.created_AT}</td>
                            <td style={cellStyle}>
                                <img
                                    src={`https://datnapi.vercel.app/${item.files[0]}`}
                                    alt="postnews"
                                    className="post-image"
                                    width={'50%'}
                                    height={'50%'}
                                />
                            </td>
                            <td style={cellStyle}>
                                <Button onClick={() => handleShowModal(item)}>Detailed Post</Button>
                            </td>
                        </tr>

                    ))}
                </tbody>
            </table>
            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Post Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedPost && (
                        <div>
                            <p><strong>Title:</strong> {selectedPost.title}</p>
                            <p><strong>Status:</strong> {handleStatus(selectedPost.status)}</p>
                            <p><strong>Detail:</strong> {handleStatus(selectedPost.detail)}</p>
                            <p><strong>Location:</strong> {selectedPost.location}</p>
                            <p><strong>Price:</strong> {selectedPost.price}</p>
                            <p><strong>Created At:</strong> {selectedPost.created_AT}</p>
                            {/* <p><strong>File:</strong> {selectedPost.files}</p> */}
                            <p><strong>Email:</strong> {selectedPost.email}</p>
                            <p><strong>Work:</strong> {selectedPost.work}</p>
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
