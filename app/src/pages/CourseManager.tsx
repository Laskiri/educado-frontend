import Checklist from "../components/Checklist"
import Layout from "../components/Layout"
import { CourseCreationCom } from "../components/Courses/CourseCreationCom"


const token = "dummyToken";
const id = "0";


const CourseManager = () => {
  return (
    <Layout meta="Course Manager">

        <div className="flex flex-row">
            <Checklist />
            {/* Component renderer */}
            <div className='flex-none w-2/3  mr-20'>
                    {/*{tickChange === 0 ? <CourseCreationCom token={token} id={id}/> :  <p>An error has occured</p>} */}
                    <CourseCreationCom token={token} id={id}/>
            </div>
        </div>


    </Layout>
  )
}


export default CourseManager