import React, { useState } from 'react';
import { Form, Input, Popconfirm, Switch, Table } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import StudentModal from './StudentModal';
import AddClassroomModal from "./AddClassroomModal";
import Picker from 'emoji-picker-react';
import { updateStudent, updateStudentGroup } from '../../../../Utils/requests';
import { message } from 'antd';

export default function ListView(props) {
  const {
    studentData,
    handleDelete,
    onEnrollToggle,
    editingKey,
    isEditing,
    edit,
    cancelEdit,
    save,
    form,
    getFormattedDate,
  } = props;

  const [chosenCharacter, setChosenCharacter] = useState('');
  const [pickerVisible, setPickerVisible] = useState(false);

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={
              title === 'Name'
                ? [
                    {
                      required: true,
                      pattern: new RegExp(
                        '^([A-Za-z]+)\\s*([A-Za-z]*)\\s+([A-Za-z])\\.$'
                      ),
                      message: `Must be in format: "First L." or "First Middle L."!`,
                    },
                  ]
                : []
            }
          >
            {title === 'Name' ? (
              <Input />
            ) : (
              <div>
                <Input
                  id='editAnimal'
                  value={chosenCharacter ? chosenCharacter : record.character}
                  onClick={() => setPickerVisible(true)}
                />
                {pickerVisible && (
                  <Picker
                    onEmojiClick={(e, emoji) => {
                      setChosenCharacter(emoji.emoji);
                      triggerInput('editAnimal', emoji.emoji);
                      setPickerVisible(false);
                    }}
                    groupVisibility={{
                      flags: false,
                      smileys_people: false,
                      travel_places: false,
                      objects: false,
                      symbols: false,
                    }}
                    preload
                    native
                  />
                )}
              </div>
            )}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  // Use this function to trigger Input onChange Event.
  //Otherwise it will not update the value you pick from Picker.
  const triggerInput = (elementName, selectedValue) => {
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;

    const input = document.getElementById(elementName);

    nativeInputValueSetter.call(input, selectedValue);
    var event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
  };

  const clearState = () => {
    setChosenCharacter('');
    setPickerVisible(false);
  };
  const handleGroupAssignment = async (record) => {
    const groupNumberInput = prompt(`Enter group number for ${record.name}:`);
    const groupNumber = parseInt(groupNumberInput);
    if (!isNaN(groupNumber) && Number.isInteger(groupNumber)) {
      const updatedStudent = {
        ...record,
        groupNumber: groupNumber,
      };
      const res = await updateStudentGroup(record.key, updatedStudent);
      if (res.data) {
        message.success(`Successfully assigned ${res.data.name} to group ${groupNumber}.`);
        console.log(studentData);
      } else {
        message.error(res.err);
      }
    } else {
      alert('Please enter a valid integer for the group number.');
    }
    //alert("test");
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      width: '22.5%',
      align: 'left',
      render: (_, record) => (
        <StudentModal
          student={record}
          linkBtn={true}
          getFormattedDate={getFormattedDate}
        />
      ),
      sorter: {
        compare: (a, b) => (a.name < b.name ? -1 : 1),
      },
    },
    {
      title: 'Animal',
      dataIndex: 'character',
      key: 'character',
      editable: true,
      width: '22.5%',
      align: 'left',
    },
    {
      title: 'Last logged in',
      dataIndex: 'last_logged_in',
      key: 'last_logged_in',
      width: '15%',
      align: 'left',
      sorter: {
        compare: (a, b) => (a.last_logged_in < b.last_logged_in ? -1 : 1),
      },
      render: (_, record) => getFormattedDate(record.last_logged_in),
    },
    {
      title: 'Add to Classroom',
      dataIndex: 'classrooms',
      key: 'classrooms',
      width: '10%',
      align: 'left',
      render: (_, record) => (
        <AddClassroomModal
          student={record}
          linkBtn={true}
          getFormattedDate={getFormattedDate}
        />
      ),
    },
    {
      title: 'Edit',
      dataIndex: 'edit',
      key: 'edit',
      width: '10%',
      align: 'right',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span id='edit-options-span'>
            <button
              id='link-btn'
              onClick={() => {
                clearState();
                save(record.key);
              }}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </button>
            <Popconfirm
              title='Are you sure you want to cancel?'
              onConfirm={() => {
                clearState();
                cancelEdit();
              }}
            >
              <button id='link-btn'>Cancel</button>
            </Popconfirm>
          </span>
        ) : (
          <button
            id='link-btn'
            disabled={editingKey !== ''}
            onClick={() => edit(record)}
          >
            Edit
          </button>
        );
      },
    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      key: 'delete',
      width: '10%',
      align: 'right',
      render: (text, record) =>
        studentData.length >= 1 ? (
          <Popconfirm
            title={`Are you sure you want to delete all data for ${record.name}?`}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => handleDelete(record.key)}
          >
            <button id='link-btn'> Delete</button>
          </Popconfirm>
        ) : null,
    },
    {
      title: 'Enrolled',
      dataIndex: 'enrolled',
      key: 'enrolled',
      width: '10%',
      align: 'right',
      render: (enrolled) => (
        <Switch
          onChange={(e) => {
            onEnrollToggle(enrolled.id, e);
          }}
          defaultChecked={enrolled.enrolled}
        />
      ),
      filters: [
        {
          text: 'Enrolled',
          value: true,
        },
        {
          text: 'Unenrolled',
          value: false,
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.enrolled.enrolled === value,
    },
    {
      title: 'Group Number',
      dataIndex: 'groupNumber',
      key: 'groupNumber',
      width: '10%',
      align: 'left',
      render: (groupNumber) => (groupNumber !== undefined ? groupNumber : '-'),
    },
    {
      title: 'Assign Group',
      dataIndex: 'assignGroup',
      key: 'assignGroup',
      width: '10%',
      align: 'right',
      render: (_, record) => (
        <button
          id='link-btn'
          onClick={() => handleGroupAssignment(record)}
        >
          Assign Group
        </button>
      ),
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div id='table-container'>
      <Form form={form} component={false}>
        <Table
          columns={mergedColumns}
          dataSource={studentData}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          rowClassName='editable-row'
          pagination={{
            onChange: cancelEdit,
          }}
        />
      </Form>
    </div>
  );
}
