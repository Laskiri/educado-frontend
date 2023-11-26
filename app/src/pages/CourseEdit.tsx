import { useParams} from 'react-router-dom'
import useSWR from 'swr'


// Pages
import NotFound from './NotFound'

// components
import Loading from '../components/general/Loading'
import Layout from '../components/Layout'
import { SectionList } from '../components/dnd/SectionList'
import { SectionForm } from '../components/dnd/SectionForm'
import { CourseComponent } from '../components/Courses/CourseComponent'

import { BACKEND_URL } from "../helpers/environment";

// Helpers
import { getUserToken } from '../helpers/userInfo';
import CourseServices from '../services/course.services';



interface Inputs {
  title: string
  description: string
  category: string
  difficulty: number
  status: string
  estimatedHours: number
  coverImg?: string
}



/**
 * This page is responsible for showing and editing courses to the creator.
 *
 * @returns HTML Element
 */
const CourseEdit = () => {
  
  const token = getUserToken();
  var id = useParams().id
    

	
	/**
	 * This function is used to get the data from the backend,
	 * is currently only used for the sections.
	 * A similar data get is in the CourseComponent.tsx
	 * This should be deleted when the sections component has been created.
	*/
	const getData = async (url: string/*, token: string*/) => {
		const res:any = await CourseServices.getCourseDetail(url/*, token*/)
		return res;
	}

	// Fetch Course Details
	if(id != "0"){
		var { data, error } = useSWR(
			token ? [`${BACKEND_URL}/api/courses/${id}`, token] : null,
			getData
		)
	}


  if(error) return <NotFound/> // Course not found
	if (!data && id != "0") return <Layout meta='course overview'><Loading /></Layout> // Loading course details
  

	return (
		<Layout meta={`Course: ${id}`}>

			<div className="m-8">
				{/*Everything on the left side of the site*/}
				<div className="w-2/5 float-left">
				</div>
					
				{/*Everything on the right side of the site*/}
				
				<div className="w-3/5 float-right space-y-4  mr-32 my-4">
					<CourseComponent token={token} id={id}/>
				</div>
			</div>

			{/* This is temporary, it's only until the new section page with the new design has been implemented */}
			{ id != "0" ?
			<div className="container mx-auto flex flex-row space-x-4 my-6">
				<div className='w-full max-w-5xl mx-auto bg-white rounded p-6'>
					{/** Course Sections area  */}
					<div className='flex flex-col space-y-2 divide'>
						<h1 className='text-xl font-medium mb-4'>Seções do curso</h1>
						<SectionForm/>
						<SectionList sections={data ? data.sections : []} />
					</div>
				</div>
			</div>
			:
			<div/>
			}
		</Layout>	
  )
}

export default CourseEdit
