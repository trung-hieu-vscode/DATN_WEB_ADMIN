import React, { useState, useEffect } from 'react';
import AxiosInstance from "../../helper/Axiosintances";
import 'bootstrap/dist/css/bootstrap.min.css';

function ListPostVip() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await AxiosInstance().get('/api/postnews');
                // Filter to only include posts where isVip is true
                const vipPosts = response.data.filter(post => post.isVip);
                if (vipPosts && Array.isArray(vipPosts)) {
                    setPosts(vipPosts);
                } else {
                    console.error('Filtered data is not an array:', vipPosts);
                }
            } catch (error) {
                console.error('Failed to fetch posts', error);
            }
        };

        fetchPosts();
    }, []);

    const formatDate = (datetime) => {
        const date = new Date(datetime);
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const day = date.toLocaleDateString('en-GB');
        return { time, day };
    };

    return (
        <div className="container-fluid">
            <h1 className='display-4 post-page-title'>Danh sách bài mua vip</h1>
            <div style={{height:'50px', backgroundColor:'rgb(248, 249, 250)'}}></div>
            <table className="table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên người dùng</th>
                        <th>Tiêu đề</th>
                        <th>Mô tả</th>
                        <th>Ngày mua vip</th>
                        <th>Ngày hết vip</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post, index) => (
                        <tr key={post.id}>
                            <td>{index + 1}</td>
                            <td>{post.userid ? post.userid.name : 'No user'}</td>
                            <td>{post.title}</td>
                            {/* <td>{truncateText(post.detail, 50)}</td> */}
                            <td style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{post.detail}</td>
                            <td>{formatDate(post.startVip).time}<br />{formatDate(post.startVip).day}</td>
                            <td>{formatDate(post.endVip).time}<br />{formatDate(post.endVip).day}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListPostVip;
