import Checklist from "../components/Checklist"
import Layout from "../components/Layout"
import { CourseCreationCom } from "../components/Courses/CourseCreationCom"
import { SectionCreation } from "../components/SectionCreation"
import { useState } from "react"
import { useParams } from "react-router"

import { getUserToken } from '../helpers/userInfo';




const CourseManager = () => {

  const token = getUserToken();
  let { id } = useParams();


  const [tickChange, setTickChange] = useState<number>(0)
  const [formComponents, setFormComponents] = useState<JSX.Element[]>
  ([
  <CourseCreationCom token={token} id={id} tickChangeHandler={tickChangeHandler} setId={setId}/>
  ,<SectionCreation id={id ?? ""} token={token} tickChangeHandler={tickChangeHandler}/>
])
      
  function tickChangeHandler() {
      if (tickChange < formComponents.length-1){
          setTickChange(tickChange+1);
      } 
      else {setTickChange(0)}
  }

  function setId(idInput: string){
    id = idInput;
  }

  return (
    <Layout meta="Course Manager">

        <div className="flex flex-row">

         
            <Checklist tickChange = {tickChange}/>
          
            {/* Component renderer */}
            <div className='flex-none w-2/3  mr-20'>
                    {/*{tickChange === 0 ? <CourseCreationCom token={token} id={id}/> :  <p>An error has occured</p>} */}
                    {formComponents[tickChange]}
            </div>
        </div>


    </Layout>
  )
}


export default CourseManager