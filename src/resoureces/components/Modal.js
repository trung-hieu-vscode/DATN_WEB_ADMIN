import React from 'react';
import './Modal.css'; 

const Modal = ({ title, onClose, content }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
          <button type="button" className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">{content}</div>
      </div>
    </div>
  );
};

export default Modal;
