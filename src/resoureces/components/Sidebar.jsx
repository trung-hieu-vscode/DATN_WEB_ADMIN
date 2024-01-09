import React, { } from 'react';
import { FaTh, FaUserAlt, FaRegChartBar, FaShoppingBag, FaThList, FaCommentAlt, FaBars} from "react-icons/fa";
import './Sidebar.css'

const Sidebar = () => {
    const menuItem = [
        {
            path: "/",
            name: "dashboard",
            icon: <FaTh />
        },
        {
            path: "/analytics",
            name: "/Analytics",
            icon: <FaRegChartBar />
        },
        {
            path: "/comment",
            name: "Comment",
            icon: <FaCommentAlt />
        },
        {
            path: "/product",
            name: "Product",
            icon: <FaShoppingBag />
        },
        {
            path: "/productList",
            name: "Product List",
            icon: <FaThList />
        },
        {
            path: "/about",
            name: "About",
            icon: <FaUserAlt />
        },
    ]
    return (
        <div className='container'>
            <div className='sidebar'>
                <div className='top_section'>
                    <h1 className='logo'>Logo</h1>
                    <div className='bars'>
                        <FaBars/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;