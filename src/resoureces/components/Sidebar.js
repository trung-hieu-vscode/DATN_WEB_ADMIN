import React, { useState } from 'react';

import { FaTh, FaUserAlt, FaRegChartBar, FaShoppingBag, FaThList, FaList, FaBars, FaUsers, FaChartBar } from "react-icons/fa";

import { FaTh, FaUserAlt, FaRegChartBar, FaShoppingBag, FaThList, FaCommentAlt, FaBars, FaUsers } from "react-icons/fa";
master
import './css/Sidebar.css'
import { NavLink } from 'react-router-dom';

const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const menuItem = [
        {
            path: "/",
            name: "Dashboard",
            icon: <FaTh />
        },
        {
            path: "/user",
            name: "List Users",
            icon: <FaUsers />
        },
        {
            path: "/postpage",
            name: "PostNews",
            icon: <FaList />
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

        // {
        //     path: "/chart",
        //     name: "Chart",
        //     icon: <FaChartBar />
        // },
        // {
        //     path: "/product",
        //     name: "Product",
        //     icon: <FaShoppingBag />
        // },
        // {
        //     path: "/productList",
        //     name: "Product List",
        //     icon: <FaThList />
        // },
        // {
        //     path: "/about",
        //     name: "About",
        //     icon: <FaUserAlt />
        // },
    ]
    return (
        <div className={`layout ${isOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
            <div className='sidebar fixed-top' style={{ width: isOpen ? "250px" : "50px" }}>
                <div className='top_section'>
                    <h1 style={{ display: isOpen ? "block" : "none" }} className='logo'>Logo</h1>
                    <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className='bars'>
                        <FaBars onClick={toggle} />
                    </div>
                </div>

                {
                    menuItem.map((item, index) => (
                        <NavLink to={item.path} key={index} className="link" activeclassName="active">
                            <div className="icon">{item.icon}</div>
                            <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
                        </NavLink>
                    ))
                }
                {menuItem.map((item, index) => (
                    <NavLink to={item.path} key={index} className="link" activeClassName="active">
                        <div className="icon">{item.icon}</div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
                    </NavLink>
                ))}
            </div>
            <div className="main-content">
                {children}
            </div >
        </div >
    );
};

export default Sidebar;