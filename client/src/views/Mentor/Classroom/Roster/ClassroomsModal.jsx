import { Modal, Button, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { getMentor, getClassrooms } from '../../../../Utils/requests';
import { message } from 'antd';
import { useGlobalState } from '../../../../Utils/userState';

export default function ClassroomsModal({ linkBtn, student }) {
  const [visible, setVisible] = useState(false);
  const [selectedClassrooms, setSelectedClassrooms] = useState([]);
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
            {classrooms.map((classroom) => (
              <Checkbox
                key={classroom.id}
                style={{ display: 'block' }}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedClassrooms([
                      ...selectedClassrooms,
                      classroom.id,
                    ]);
                  } else {
                    setSelectedClassrooms(
                      selectedClassrooms.filter(
                        (id) => id !== classroom.id
                      )
                    );
                  }
                }}
              >
                {classroom.name}
              </Checkbox>
            ))}
            {/* <p id='label-info'>
              {student.enrolled.enrolled ? 'Enrolled' : 'Unenrolled'}
            </p> */}
          </div>
        </div>
      </Modal>
    </div>
  );
}