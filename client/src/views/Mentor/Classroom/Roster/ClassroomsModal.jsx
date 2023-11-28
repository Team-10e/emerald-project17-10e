import { Modal, Button, Checkbox } from 'antd';
import React, { useState } from 'react';

export default function ClassroomsModal({ linkBtn, student }) {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = () => {
    setVisible(false);
  };

  return (
    <div>
      <button id={linkBtn ? 'link-btn' : null} onClick={showModal}>
        Classrooms
      </button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button key='ok' type='primary' onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        <div id='modal-student-card-header'>
          <p id='animal'>{student.character}</p>
          <h1 id='student-card-title'>{student.name}</h1>
        </div>
        <div id='modal-card-content-container'>
          <div id='description-container'>
            <p id='label'>Classrooms</p>
            <p id='label-info'>
              {student.enrolled.enrolled ? 'Enrolled' : 'Unenrolled'}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}