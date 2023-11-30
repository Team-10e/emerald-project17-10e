import { Modal, Button, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { getMentor, getClassrooms } from '../../../../Utils/requests';
import { message } from 'antd';
import { useGlobalState } from '../../../../Utils/userState';

export default function AddClassroomModal({ linkBtn, student }) {
  const [visible, setVisible] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [value] = useGlobalState('currUser');
  const navigate = useNavigate();

  useEffect(() => {
    let classroomIds = [];
    getMentor().then((res) => {
      if (res.data) {
        res.data.classrooms.forEach((classroom) => {
          classroomIds.push(classroom.id);
        });
        getClassrooms(classroomIds).then((classrooms) => {
          setClassrooms(classrooms);
        });
      } else {
        message.error(res.err);
        navigate('/teacherlogin');
      }
    });
  }, []);

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
        Add to Classroom
      </button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button key='ok' type='primary' onClick={handleOk}>
            Add to classroom
          </Button>,
        ]}
      >
        <div id='modal-student-card-header'>
          <p id='animal'>{student.character}</p>
          <h1 id='student-card-title'>Add {student.name} to another Classroom</h1>
        </div>
        <div id='modal-card-content-container'>
          <div id='description-container'>
            <select
              id="classroom-dropdown"
              value={selectedClassroom}
              onChange={e => setSelectedClassroom(e.target.value)}
              required
            >
             {/* <option key={0} value={classroom} id="disabled-option" disabled> */}
             <option value="" disabled>
                Select a Classroom
              </option>
              {classrooms.map(classroom => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}