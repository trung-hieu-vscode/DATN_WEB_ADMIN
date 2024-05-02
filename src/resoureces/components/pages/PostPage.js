import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../helper/Axiosintances';
import { toast } from 'react-toastify';
import { Modal, Button, Spinner, Navbar, FormControl, Form } from 'react-bootstrap';
import { IoLockClosed, IoLockOpen } from "react-icons/io5";
import { postNewsData } from '../../Service/PostNewServices';
import '../css/userList.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// image 
import logoImg from "../../../Assets/Logoapp.png";
const MySwal = withReactContent(Swal);

const PostPage = () => {
    const [postData, setPostData] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState({});

    useEffect(() => {
        if (postData.length == 0) {
            fetchData();
        }
    }, [postData]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await postNewsData();
            setPostData(res);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Lỗi khi tải dữ liệu bản tin!');
            setLoading(false);
        }
    };

    const toggleActivation = async (postId, activable) => {
        setLoadingDetails(prevState => ({
            ...prevState,
            [postId]: true // Đặt trạng thái loading của postId thành true khi bắt đầu xử lý
        }));
        const action = activable ? 'hiện' : 'ẩn';
        MySwal.fire({
            title: `Bạn có chắc chắn muốn ${action} bài viết này không?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#f9862e',
            confirmButtonText: `Đúng, ${action} bài viết!`,
            cancelButtonText: 'Hủy',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await AxiosInstance().post(`/api/postnews/activable/${postId}`);
                    if (response && response.data.success) {
                        fetchData();
                    } else {
                        toast.error('Có lỗi xảy ra!');
                    }
                    fetchData();
                } catch (error) {
                    MySwal.fire(
                        'Error!',
                        `Error ${action}ing bài viết: ${error.message}`,
                        'error'
                    );
                }
            }
        }).finally(() => {
            setLoading(false);
            setLoadingDetails(prevState => ({
                ...prevState,
                [postId]: false 
            }));
        });
    };

    const hideAllPosts = async () => {
        const unhiddenPosts = postData.filter(post => post.activable);
        if (unhiddenPosts.length === 0) {
            toast.warning('Tất cả các bài viết đã được khoá.');
            setLoading(false);
            return;
        }

        MySwal.fire({
            title: 'Bạn muốn ẩn tất cả bài viết?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#f9862e',
            confirmButtonText: 'Đúng, ẩn tất cả bài viết!',
            cancelButtonText: 'Hủy',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const hidePromises = unhiddenPosts.map(post =>
                    AxiosInstance().post(`/api/postnews/activable/${post._id}`, { activable: false })
                );
                try {
                    const results = await Promise.allSettled(hidePromises);
                    const hiddenPosts = results.filter(result => result.status === 'fulfilled');
                    toast.success(`${hiddenPosts.length} bài viết đã được ẩn.`);
                } catch (error) {
                    console.error('Error hiding posts:', error);
                    toast.error(`Đã xảy ra lỗi khi ẩn các bài viết: ${error.message}`);
                } finally {
                    fetchData();
                    setLoading(false);
                }
            }
        });
    };

    const showAllPosts = async () => {
        setLoading(true);
        const hiddenPosts = postData.filter(post => !post.activable);
        if (hiddenPosts.length === 0) {
            toast.warning('Tất cả các bài viết đã được hiện.');
            setLoading(false);
            return;
        }

        MySwal.fire({
            title: 'Bạn muốn hiện tất cả bài viết?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#f9862e',
            confirmButtonText: 'Đúng, hiện tất cả bài viết!',
            cancelButtonText: 'Hủy',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const showPromises = hiddenPosts.map(post =>
                    AxiosInstance().post(`/api/postnews/activable/${post._id}`, { activable: true })
                );
                try {
                    const results = await Promise.allSettled(showPromises);
                    const shownPosts = results.filter(result => result.status === 'fulfilled');
                    toast.success(`${shownPosts.length} bài viết đã được hiện.`);
                } catch (error) {
                    console.error('Error showing posts:', error);
                    toast.error(`Đã xảy ra lỗi khi hiện các bài viết: ${error.message}`);
                } finally {
                    fetchData();
                    setLoading(false);
                }
            }
        });
    };

    const formatDate = (datetime) => {
        const date = new Date(datetime);
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const day = date.toLocaleDateString('en-GB');
        return { time, day };
    };

    const handleShowModal = async (post) => {
        if (!loadingDetails[post._id]) {
            setLoadingDetails(prev => ({ ...prev, [post._id]: true }));
            setSelectedPost(post);
            setShowModal(true);
            setLoadingDetails(prev => ({ ...prev, [post._id]: false }));
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const renderPostModal = () => {
        return showModal && selectedPost && (
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết bài viết</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Tiêu đề:</strong> {selectedPost.title}</p>
                    <p><strong>Trạng thái:</strong> {selectedPost.activable ? "đang hiện" : "đang ẩn"}</p>
                    <p><strong>Chi tiết:</strong> {selectedPost.detail}</p>
                    <p><strong>Vị trí:</strong> {selectedPost.location}</p>
                    <p><strong>Giá:</strong> {selectedPost.price} VND</p>
                    <p><strong>Ngày đăng:</strong> {selectedPost.created_AT}</p>
                    <p><strong>Vai trò:</strong> {selectedPost.role}</p>
                    {selectedPost.brandid && (<p><strong>Nhãn hiệu:</strong> {selectedPost.brandid.nameBrand}</p>)}
                    {selectedPost.idCategory && (<p><strong>Danh mục:</strong> {selectedPost.idCategory.name}</p>)}
                    {selectedPost.userid && (<p><strong>Email:</strong> {selectedPost.userid.email}</p>)}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    const filteredPostData = postData
        .filter(post => post.title.toLowerCase().includes(searchKeyword.toLowerCase()))
        .sort((a, b) => b.activable - a.activable
        );

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" role="status" />
                <p className="mt-3">Đang tải danh sách bài đăng...</p>
            </div>
        );
    }

    // Styles
    const borderLeftRight = {
        border: "none",
        borderBottom: "1px solid",

    }

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
    };
    const cellStyle = {
        ...borderLeftRight,
        padding: '8px',
        textAlign: 'left',
    };
    const center = {
        ...borderLeftRight,
        // border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'center',
    };
    const cellFull = {
        ...borderLeftRight,
        padding: 0,
        width: "max-content",

        padding: "5px"
    }
    const cellStatus = {
        padding: "4px 8px",
        margin: 0,

        // success
        color: "rgb(50, 128, 72)",
        background: "rgb(234, 251, 231)",
        // fail
        colorRed: "rgb(183, 43, 26)",
        borderRed: "1px solid rgb(245, 192, 184)",
        backgroundRed: "rgb(252, 236, 234)",

        border: "1px solid rgb(198, 240, 194)",
        borderRadius: "4px",

        textAlign: "center",
        fontSize: "12px",
        fontWeight: "bold",

    }

    return (
        <div className="container-fluid">
            <h1 className="display-4 post-page-title">Danh sách bài đăng</h1>
            <Navbar bg="light" expand="lg" className="mb-3">
                <Navbar.Brand href="#home">Tìm Kiếm</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Form inline>
                        <FormControl
                            type="text"
                            placeholder="Nhập từ muốn tìm kiếm"
                            className="mr-sm-2"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </Form>
                </Navbar.Collapse>
            </Navbar>
            <Button style={{ fontSize: 16 }} variant="primary" onClick={() => {
                const url = new URL(window.location.origin + `/listpostvip`);
                window.location.href = url;
            }}>
                Danh sách bài viết mua vip
            </Button>
            <table className="table" style={tableStyle}>
                <thead>
                    <tr>
                        <th style={center}>STT</th>
                        <th style={center}>Hình ảnh</th>
                        <th style={center}>Tiều đề</th>
                        <th style={center}>Ngày tạo</th>
                        <th style={center}>Trạng thái</th>
                        <th style={center}>
                            <Button style={{ backgroundColor: '#f9862e' }} onClick={hideAllPosts}>Ẩn bài viết</Button>
                            <Button variant="success" onClick={showAllPosts} style={{ marginLeft: '10px' }}>Hiện bài viết</Button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPostData.map((post, index) => (
                        <tr key={post._id}>
                            <td style={cellStyle}>{index + 1}</td>
                            <td style={cellFull}>
                                {post.files && post.files.length > 0 && (
                                    <ImageWithFallback src={`${post.files[0]}`} fallbackSrc={logoImg} alt="post" />
                                )}
                            </td>
                            <td style={cellStyle}>{post.title}</td>
                            <td style={center}>
                                <div>{formatDate(post.created_AT).time}<br />{formatDate(post.created_AT).day}</div>
                            </td>
                            <td style={borderLeftRight}>
                                <p style={{
                                    ...cellStatus,
                                    color: post.activable ? cellStatus.color : cellStatus.colorRed,
                                    border: post.activable ? cellStatus.border : cellStatus.borderRed,
                                    background: post.activable ? cellStatus.background : cellStatus.backgroundRed
                                }}>{post.activable ? 'Đang hiện' : 'Đang ẩn'}</p>
                            </td>
                            <td style={center}>
                                <Button
                                    style={{ fontSize: 12 }}
                                    onClick={() => handleShowModal(post)}
                                    disabled={loadingDetails[post._id]}
                                >
                                    {loadingDetails[post._id] ? (
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    ) : "Chi tiết bài viết"}
                                </Button>
                                <Button
                                    variant={post.activable ? 'success' : 'secondary'}
                                    onClick={() => toggleActivation(post._id, !post.activable)}
                                    disabled={loadingDetails[post._id]}
                                >
                                    {loadingDetails[post._id] ? (
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    ) : (post.activable ? <IoLockOpen /> : <IoLockClosed />)}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {renderPostModal()}
        </div>
    );
};


// util hook 
// Img tag with fallback 
function ImageWithFallback({ src, fallbackSrc, alt }) {
    const handleError = (e) => {
        // Set the fallback source if there's an error loading the original src
        e.target.src = fallbackSrc;
    };

    return (
        <img src={src} alt={alt} onError={handleError} style={{ width: '80px', height: '80px', objectFit: "cover", objectPosition: "center", borderRadius: "50px" }} />
    );
}
export default PostPage;
