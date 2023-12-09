// Modal to add a student to another classroom
// Duplicates student into the other classroom

import { Modal, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { getMentor, getClassrooms, addStudent } from '../../../../Utils/requests';
import { useGlobalState } from '../../../../Utils/userState';

export default function AddClassroomModal({ linkBtn, student }) {
  const [visible, setVisible] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
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

  const handleOk = async e => {
    const res = await addStudent(student.name, student.character, selectedClassroom)
    if (res.err) {
      message.error(`Fail to add ${student.name} to classroom`)
    } else {
      message.success(`Successfully added ${student.name} to classroom`)
      setVisible(false)
    }
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

        {/* Dropdown selection */}
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