import { useState, useEffect } from 'react'
import { Link, useParams} from 'react-router-dom'
import { useForm, SubmitHandler, set } from 'react-hook-form'
import { toast } from 'react-toastify'
import useSWR from 'swr'


// Hooks
import useToken from '../hooks/useToken'

// Interfaces
import { StorageFile } from '../interfaces/File'
import { Section } from '../interfaces/CourseDetail';

// Services
import CourseServices from '../services/course.services'
import StorageService from '../services/storage.services'

// Pages
import NotFound from './NotFound'

// components
import Loading from './Loading'
import Layout from '../components/Layout'
import { SectionList } from '../components/dnd/SectionList'
import { SectionForm } from '../components/dnd/SectionForm'
import { ToolTip } from '../components/Courses/ToolTip'
import { DeleteButton, DeleteType } from '../components/Courses/DeleteButton'
import { CourseCreationCom } from '../components/Courses/CourseCreationCom'

// Icons
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { boolean } from 'yup';

import { BACKEND_URL } from "../helpers/environment";

// Helpers
import categories from "../helpers/courseCategories";
import statuses from "../helpers/courseStatuses";
import { getUserToken } from '../helpers/userInfo';

// Icons
import Icon from '@mdi/react';
import { mdiInformationSlabCircleOutline } from '@mdi/js';


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
     * FIX LATER: removed cover image since it has not been implemented to work yet
     */
  const [coverImg, setCoverImg] = useState<File | null>()
  const [coverImgPreview, setCoverImgPreview] = useState<string>('')
  const [categoriesOptions, setCategoriesOptions] = useState<JSX.Element[]>([]);
  const [statusSTR, setStatusSTR] = useState<string>("draft");
  const [statusChange, setStatusChange] = useState<boolean>(false);
  const [toolTipIndex, setToolTipIndex] = useState<number>(4);
  
  const [toolTip, setToolTip] = useState<JSX.Element[]>
  ([
    <ToolTip callBack={setToolTipIndex} textContent='🔈 Nesse ambiente você insere as informações gerais do curso que serão apresentadas aos alunos para se inscreverem! ' myIndex={0} maxIndex={2}></ToolTip>,
    <ToolTip callBack={setToolTipIndex} textContent='😉 Dica: insira uma descrição que desperte a curiosidade e o interesse dos alunos' myIndex={1} maxIndex={2}></ToolTip>,
  ]);

  
  useEffect(() => {
      // get categories from db
      let inputArray = ["personal finance","health and workplace safety","sewing","electronics"];
      setCategoriesOptions(inputArray.map((categoryENG: string, key: number) => (
          <option value={categoryENG} key={key} >{categories[inputArray[key]]?.br}</option>
          )));
    }, []);
        
    
    /**
     * Extra function to handle the response from the course service before it is passed to the useSWR hook
     * 
     * @param url The url to fetch the course details from backend
     * @param token The user token
     * @returns The course details
     */
    const getData = async (url: string/*, token: string*/) => {
        const res:any = await CourseServices.getCourseDetail(url/*, token*/)

        setStatusSTR(res.status);
        return res;
    }

    // Fetch Course Details
    if(id != "0"){
        var { data, error } = useSWR(
            token ? [`${BACKEND_URL}/api/courses/${id}`, token] : null,
            getData
        )

        // Fetch Bucket Details
        var { data: bucketData, error: bucketError } = useSWR(
            token ? [`${BACKEND_URL}/api/bucket/${data?.coverImg}`, token] : null,
            StorageService.getFile
        )
    }

//  // Fetch Categories
//   const { data: categoriesData, error: categoriesError } = useSWR(
//     token ? [`${BACKEND_URL}/api/categories`, token] : null,
//     CourseServices.getCourseCategories
//   )

// React useForm setup
const { register, handleSubmit, formState: { errors } } = useForm<Inputs>()

/**
 * Handles the form submission for updating a course's details.
 * @param {Inputs} data - The form data containing the updated course details.
*/
const onSubmit: SubmitHandler<Inputs> = (data) => {
    
    let newStatus = statusSTR;

    if(statusChange){
        if(statusSTR === "draft"){
            newStatus = "published";
        }else{
            newStatus = "draft";
        }
        setStatusChange(false);
    }

    if (confirm("Você tem certeza?") == true) {
        StorageService.uploadFile({ id: id, file: coverImg, parentType: "c" });

        const changes: Inputs = {
            title: data.title,
            description: data.description,
            category: data.category,
            difficulty: data.difficulty,
            status: newStatus,
            estimatedHours: data.estimatedHours,
            coverImg: id+"_"+"c"
        }
        //StorageService.deleteFile(id, token);

        // Update course details
        CourseServices.updateCourseDetail(changes, id/*, token */)
        .then(res => {toast.success('Curso atualizado'); setStatusSTR(changes.status);}) // Course updated
        .catch(err => toast.error(err)) // Error updating course
    }
}
  
    /** TODO: Reimplement when buckets have been implemented */
    /* if (coverImg) {
        changes.coverImg = {
            path: `${id}/coverImg`,
            filename: coverImg.name,
            size: coverImg.size,
            type: coverImg.type
        }
        } */


  // TODO: update cover image function
  /**
   * Sets the cover image preview and the cover image file
   * Though bucket is not implemented yet, so most of this is commented out
   */
  const onCoverImgChange = async (e: any) => {
    const image = e.target.files?.item(0)

    // Enables us to preview the image file before storing it
    setCoverImgPreview(URL.createObjectURL(image));
    setCoverImg(image);

    /*
        try {
            await StorageService.uploadFile({ file: image, key: `${data.id}/coverImg` })
            toast.success('Image uploaded successfully');
        } catch (error) { 
            toast.error('Image could not be uploaded, try again.');
        } 
    */
  }
    
  if(error) return <NotFound/> // Course not found

  console.log("data is: ")
  console.log(data)

    
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
		</Layout>
		
  )
  
}

export default CourseEdit
