import Modal from 'react-modal'
import React from 'react'
import { useState } from 'react';
import { addPostnews } from '../../../Services/PostNewServices';
import AxiosInstance from '../../../helper/Axiosintances';

Modal.setAppElement("#root");

const AddModel = ({ isOpen, onRequestClose, loadData }) => {
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState(false);
    const [detail, setDetail] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [created_AT, setCreated_AT] = useState('');
    const [files, setFiles] = useState('');
    const [role, setRole] = useState('');
    const [activable, setActivable] = useState(false);
    const [userid, setUserid] = useState('');
    const [brandld, setBrandld] = useState('');



    const handleAdd = async (req) => {
        try {
            const body = { title, status, detail, location, price, created_AT, files, role, activable, userid, brandld };
            const res = await AxiosInstance().post('/api/postnews/add', body);
            console.log("check kkkkkkkkkkkkk: ", res);

        } catch (err) {
            console.log(err);
        }
        console.log("check add 30000000: ", title, status, detail, location, price, created_AT, files, role, activable, userid, brandld);
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Example Modal"
            loadData={loadData}
        >
            <h2>Add PostNews</h2>
            <form>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Title</label>
                    <input type="text" className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">status</label>
                    <select className="form-control"
                        onChange={(e) => setStatus(e.target.value)}
                        value={status}
                    >
                        <option value={true}>Đã mua</option>
                        <option value={false}>Chưa mua</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">detail</label>
                    <input type="text" className="form-control"
                        onChange={(e) => setDetail(e.target.value)}
                        value={detail}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">location</label>
                    <input type="text" className="form-control"
                        onChange={(e) => setLocation(e.target.value)}
                        value={location}
                    />

                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">price</label>
                    <input type="text" className="form-control"
                        onChange={(e) => setPrice(e.target.value)}
                        value={price}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">created_AT</label>
                    <input type="text" className="form-control"
                        onChange={(e) => setCreated_AT(e.target.value)}
                        value={created_AT}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">files</label>
                    <input type="text" className="form-control"
                        onChange={(e) => setFiles(e.target.value)}
                        value={files}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">role</label>
                    <input type="text" className="form-control"
                        onChange={(e) => setRole(e.target.value)}
                        value={role}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">activable</label>
                    <select className="form-control"
                        onChange={(e) => setActivable(e.target.value)}
                        value={activable}
                    >
                        <option value={true}>Đã Kích hoạt</option>
                        <option value={false}>Chưa kích hoạt</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">userid</label>
                    <input type="text" className="form-control"
                        onChange={(e) => setUserid(e.target.value)}
                        value={userid}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">brandld</label>
                    <input type="text" className="form-control"
                        onChange={(e) => setBrandld(e.target.value)}
                        value={brandld}
                    />
                </div>
            </form>
            <input type="submit" className="btn btn-primary" value="Submit" onClick={handleAdd} />

        </Modal>
    )
}

export default AddModel
