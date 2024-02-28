import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap'; // Import Modal and Button from react-bootstrap
import { deletePostnews, postNewsData } from '../../Service/PostNewServices';

const PostPage = () => {
    const [postData, setPostData] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [selectedPost, setSelectedPost] = useState(null); // State to hold selected post data

    // Function to handle opening modal and setting selected post data
    const handleShowModal = (post) => {
        setSelectedPost(post);
        setShowModal(true);
    };

    // Function to close modal
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

    // Function to handle status display
    const handleStatus = (status) => (status ? 'Còn hàng' : 'Không còn hàng');

    // Function to handle search
    const handleSearch = () => {
        const keyword = searchKeyword.toLowerCase().trim();

        // If searchKeyword is empty, reset the postData to original data
        if (!keyword) {
            fetchData(); // Fetch original data
            return;
        }

        // Filter postData based on title containing the keyword
        const filteredData = postData.filter(item =>
            item.title.toLowerCase().includes(keyword)
        );
        setPostData(filteredData);
    };

    // Function to handle sorting by date
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
        <div className="post-page">
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
            <table className="post-table" style={tableStyle}>
                <thead>
                    <tr>
                        <th style={cellStyle}>#</th>
                        <th style={cellStyle}>Title</th>
                        <th style={cellStyle}>Status</th>
                        <th style={cellStyle}>Price</th>
                        <th style={cellStyle}>Created_AT</th>
                        <th style={cellStyle}>Files</th>
                        <th style={cellStyle}>Email</th>
                        <th style={cellStyle}>Work</th>
                        <th style={cellStyle}>DetailedPost</th>
                    </tr>
                </thead>
                <tbody>
                    {postData.map((item, index) => (
                        <tr key={item._id}>
                            <td style={cellStyle}>{index + 1}</td>
                            <td style={cellStyle}>{item.title}</td>
                            <td style={cellStyle}>{handleStatus(item.status)}</td>
                            {/* <td style={cellStyle}>{item.detail}</td> */}
                            {/* <td style={cellStyle}>{item.location}</td> */}
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
                            <td style={cellStyle}>{item.work}</td>
                            <td style={cellStyle}>{item.detailedPost}</td>
                            <td style={cellStyle}>
                                <button onClick={() => handleShowModal(item)}>Detailed Post</button>
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
                            <p><strong>File:</strong> {selectedPost.files}</p>
                            <p><strong>Email:</strong> {selectedPost.email}</p>
                            <p><strong>Work:</strong> {selectedPost.work}</p>

                            {/* Add more details as needed */}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    {/* You can add more buttons for additional actions */}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PostPage;
