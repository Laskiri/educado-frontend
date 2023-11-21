import { useParams, useNavigate } from 'react-router-dom'

// components
import Layout from '../components/Layout'
import { CourseCreationCom } from '../components/Courses/CourseCreationCom'

// Helpers
import { getUserToken } from '../helpers/userInfo';


/**
 * This page is responsible for showing and editing courses to the creator.
 *
 * @returns HTML Element
 */
const CourseCration = () => {
  
  const token = getUserToken();
  var id = useParams().id


  return (
    <Layout meta={`Course: ${id}`}>
      <div className="m-8">
        {/*Everything on the left side of the site*/}
        <div className="w-2/5 float-left">
        </div>
          
        {/*Everything on the right side of the site*/}
        
        <div className="w-3/5 float-right space-y-4  mr-32 my-4">
          <CourseCreationCom token={token} id={id}/>
        </div>
      </div>
    </Layout>

  )
  
}

export default CourseCration
