import { Button, Form, Input, message, Modal } from "antd"
import React, { useState } from "react"
import { createUnit } from "../../../Utils/requests"
import "./UnitCreator.less"

export default function UnitCreator({ gradeList }) {
  const [visible, setVisible] = useState(false)
  const [grade, setGrade] = useState("")
  const [name, setName] = useState("")
  const [number, setNumber] = useState("")
  const [description, setDescription] = useState("")
  const [standard, setStandard] = useState("")
  const [duration, setDuration] = useState("")
  const [onlineResources, setOnlineResources] = useState("")
  const [linkError, setLinkError] = useState(false)

  const showModal = () => {
    setNumber("")
    setName("")
    setDescription("")
    setStandard("")
    setVisible(true)
    setDuration("")
    setOnlineResources("")
    setLinkError(false)
  }

  const handleCancel = () => {
    setVisible(false)
    window.location.reload();
  }

  const handleSubmit = async e => {
    const res = await createUnit(number, name, standard, description, grade)
    if (res.err) {
      message.error("Fail to create a new unit")
    } else {
      message.success("Successfully created unit")
      setVisible(false)
      window.location.reload();
    }
  }

  return (
    <div>
      <div id="page-header">
        <h2 className="helper">Add a New Unit</h2>
      </div>
    <div id="div-style">
        <Form
          id="add-units"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 14,
          }}
          onFinish={handleSubmit}
          layout="horizontal"
          size="default"
        >
          <Form.Item id="form-label" label="Grade">
            <select
              id="grade-dropdown"
              name="grade"
              defaultValue={grade}
              required
              onChange={e => setGrade(e.target.value)}
            >
              <option key={0} value={grade} disabled id="disabled-option">
                Grade
              </option>
              {gradeList.map(grade_ => (
                <option key={grade_.id} value={grade_.id}>
                  {grade_.name}
                </option>
              ))}
            </select>
          </Form.Item>
          <Form.Item id="form-label" label="Unit Name">
            <Input
              onChange={e => setName(e.target.value)}
              value={name}
              placeholder="Enter unit name"
              required
            />
          </Form.Item>
          <Form.Item id="form-label" label="Unit Number">
            <Input
              onChange={e => setNumber(e.target.value)}
              type="number"
              value={number}
              placeholder="Enter unit number"
              min={1}
              max={15}
              required
            />
          </Form.Item>
          <Form.Item id="form-label" label="Description">
            <Input.TextArea
              rows={3}
              onChange={e => setDescription(e.target.value)}
              value={description}
              placeholder="Enter unit description (optional)"
            />
          </Form.Item>
          <Form.Item id="form-label" label="Duration">
            <Input
              onChange={e => setDuration(e.target.value)}
              value={duration}
              placeholder="Enter duration of unit (optional)"
            />
          </Form.Item>
          <Form.Item label="Additional Resources">
            <Input
              onChange={e => {
                setOnlineResources(e.target.value)
                setLinkError(false)
              }}
              style={linkError ? { backgroundColor: "#FFCCCC" } : {}}
              value={onlineResources}
              placeholder="Enter a link (optional)"
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
            style={{ marginBottom: "0px" }}
          >
            <Button
              htmlType="submit"
              size="large"
              id="content-creator-button"
            >
              Submit
            </Button>
            <Button
              onClick={handleCancel}
              size="large"
              id="content-creator-button"
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
        </div> 
    </div>
  )
}
