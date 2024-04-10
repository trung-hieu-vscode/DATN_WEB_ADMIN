import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaTh, FaUsers, FaList, FaBars, FaSignOutAlt } from "react-icons/fa";
import './css/Sidebar.css';
import Swal from 'sweetalert2';
import logo from '../../Assets/Logoapp.png';

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
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        Swal.fire({
            icon: 'success',
            title: 'Đăng xuất thành công.',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            window.location.reload();
        });
    };

    return (
        <div className={`layout ${isOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
            <div className='sidebar fixed-top' style={{ width: isOpen ? "250px" : "50px" }}>
                <div className='top_section'>
                    <img
                        src={logo}
                        style={{ display: isOpen ? "block" : "none", height:100, width:100 }}
                        className='logo'
                        alt="Logo"
                    />
                    <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className='bars'>
                        <FaBars onClick={toggle} />
                    </div>
                </div>
                <div className="menu-items">
                    {menuItem.map((item, index) => (
                        <NavLink to={item.path} key={index} className="link" activeClassName="active">
                            <div className="icon">{item.icon}</div>
                            <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
                        </NavLink>
                    ))}
                </div>
                <div className="sidebar-footer">
                    <div style={{ height: 1, backgroundColor: 'white' }} ></div>
                    <div className="logout-section" onClick={handleLogout} style={{ cursor: 'pointer', textAlign: 'center' }}>
                        <div style={{ marginRight: '20px', marginBottom: '3px' }}><FaSignOutAlt /></div>
                        {isOpen && <div className="link_text">Đăng xuất</div>}
                    </div>
                </div>
            </div>
            <div className="main-content">
                {children}
            </div>
        </div>
    );
};

export default Sidebar;
