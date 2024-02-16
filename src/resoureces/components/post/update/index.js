import Modal from 'react-modal'
import React, { useState } from 'react'

Modal.setAppElement("#root");

const UpdateModel = ({ isOpen, onRequestClose }) => {
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

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Example Modal"
        >
            <h2>Update PostNews</h2>
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
                    <label htmlFor="exampleInputPassword1">Status</label>

                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Detail</label>
                    <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Location</label>
                    <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Price</label>
                    <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">created_AT</label>
                    <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">files</label>
                    <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">role</label>
                    <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">activable</label>
                    <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">userid</label>
                    <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">brandld</label>
                    <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                </div>



                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </Modal>
    )
}

export default UpdateModel
