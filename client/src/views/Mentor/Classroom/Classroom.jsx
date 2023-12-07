import {React, useEffect, useState} from 'react';
import { Dropdown, Table, Tabs } from 'antd';
import './Classroom.less';
import { Button, Form, Input, message, Modal } from "antd";
import { getGrades, getLessonModuleAll, updateActivityDetails } from '../../../Utils/requests';
import NavBar from '../../../components/NavBar/NavBar';
import Roster from './Roster/Roster';
import Home from './Home/Home';
import SavedWorkSpaceTab from '../../../components/Tabs/SavedWorkspaceTab';
import { useSearchParams, useParams } from 'react-router-dom';
import LessonModuleCreator from '../../ContentCreator/LessonModuleCreator/LessonModuleCreator';
import UnitCreator from '../../ContentCreator/UnitCreator/UnitCreator';
import UnitEditor from '../../ContentCreator/UnitEditor/UnitEditor';
import Column from 'antd/lib/table/Column';
import LessonEditor from '../../ContentCreator/LessonEditor/LessonEditor';
import { createLessonModule, getAllUnits, createActivity} from '../../../Utils/requests';
import FormItem from 'antd/es/form/FormItem';


const { TabPane } = Tabs;

export default function Classroom({
  handleLogout,
  selectedActivity,
  setSelectedActivity,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [gradeList, setGradeList] = useState([]);
  const [learningStandardList, setLessonModuleList] = useState([]);
  const [lesson, setLesson] = useState([]);
  const [unit, setUnit] = useState("")
  const [unitList, setUnitList] = useState([])

  //gets grade list to display the grades when creating new units
  useEffect(() => {
    const fetchData = async () => {
      const [lsResponse, gradeResponse] = await Promise.all([
        getLessonModuleAll(),
        getGrades(),
      ]);
      setLessonModuleList(lsResponse.data);

      const grades = gradeResponse.data;
      grades.sort((a, b) => (a.id > b.id ? 1 : -1));
      setGradeList(grades);

    };
    fetchData();
  }, []);

  const handleCopy = async (lesson, unit) => {
    
    console.log(unit);
    console.log(lesson.expectations);
    console.log(lesson.name);
    console.log(lesson.standards);
    console.log(lesson.number);
    console.log(lesson.link);
    console.log(lesson.activities.length);
    const res = await createLessonModule(
      lesson.expectations,
      "Copy of " + lesson.name,
      0,
      unit,
    )
    if (res.err) {
      message.error("Fail to create new learning standard")
    } else {
      const numOfActivityLevels = lesson.activities.length;
      for (let i = 1; i <= numOfActivityLevels; i++) {
        const activityRes = await createActivity(i, res.data)
        if (activityRes.err) {
          message.error("Fail to create activities")
        }
      }
      for(let i = 0; i < numOfActivityLevels; i++) {
        const activityRes = await updateActivityDetails(
          lesson.activities[i].id, 
          lesson.activities[i].description,
          lesson.activities[i].StandardS,
        )
        updateActivityDetails()
      }
      message.success("Successfully created lesson")
      const lsRes = await getLessonModuleAll()
      setLessonModuleList(lsRes.data)

      // find the position of the newly created ls
      found = lsRes.data.findIndex(ls => ls.id === res.data.id)
      found = Math.ceil(found / 10)
      // set the history so that modal will reopen when
      // user comes back from workspace
      setSearchParams({ tab: "home", activity: res.data.id })
    }
    
  }

  useEffect(() => {
    const getUnits = async () => {
      const res = await getAllUnits()
      setUnitList(res.data)
    }
    getUnits()
  }, [])



  const { id } = useParams();
  const tab = searchParams.get('tab');
  const viewing = searchParams.get('viewing');

  useEffect(() => {
    sessionStorage.setItem('classroomId', id);

  }, [id]);

  return (
    <div className='container nav-padding'>
      <NavBar isMentor={true} />
      <Tabs
        defaultActiveKey={tab ? tab : 'home'}
        onChange={(key) => setSearchParams({ tab: key })}
      >
        <TabPane tab='Home' key='home'>
          <Home
            classroomId={parseInt(id)}
            selectedActivity={selectedActivity}
            setSelectedActivity={setSelectedActivity}
            viewing={viewing}
          />
        </TabPane>
        <TabPane tab='Roster' key='roster'>
          <Roster handleLogout={handleLogout} classroomId={id} />
        </TabPane>
        <TabPane tab='Saved Workspaces' key='workspace'>
          <SavedWorkSpaceTab
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            classroomId={id}
          />
        </TabPane>

        <TabPane tab="Create Unit" key="create-unit">
          <UnitCreator gradeList={gradeList}></UnitCreator>
        </TabPane> 
        <TabPane tab="Create Lesson" key="create-lesson">
            <LessonModuleCreator setLessonModuleList={learningStandardList} viewing={viewing} setViewing={viewing}></LessonModuleCreator>
        </TabPane>
        <TabPane tab="Public Lesson" key='public-lesson'>
        <div id="page-header">
          <h2 className="helper">Public Lessons</h2>
        </div>
         <div id="div-style">
          <Form id="add-lesson-module">
         <Form.Item label="Unit Name">
          <div style={{
            paddingBottom: '50px',
          }}>
        
                 <select id="unit-name-dropdown-2" onChange={e => setUnit(e.target.value)}>
              <option key={0} value={unit} id="disabled-option" disabled>
                Unit
              </option>
              {unitList.map(unit_ => (
                <option key={unit_.id} value={unit_.id}>
                  {unit_.name}
                </option>
              ))}
              </select>
              </div>
              </Form.Item>
              </Form>
            
            {learningStandardList.map(item => {
              if(item.share) {
                return(
                 <div id="div-sub-style">
                  <p id="p-learning-standard">Learning Standard: {item.name}</p>
                <Button id="copy-button" onClick={()=> handleCopy(item, unit)}>Copy {item.name}</Button>
                </div> 
                );
              }
            })}
            </div>
          
        </TabPane>
      </Tabs>
    </div>
  );
}
