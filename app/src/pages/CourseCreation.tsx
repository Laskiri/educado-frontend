import { useState, useEffect } from 'react'
import { Link, useParams} from 'react-router-dom'
import { useForm, SubmitHandler, set } from 'react-hook-form'
import { toast } from 'react-toastify'
import useSWR from 'swr'
import { Dropzone } from '../components/Dropzone/Dropzone';


// Hooks
import useToken from '../hooks/useToken'

// Interfaces
import { StorageFile } from '../interfaces/File'

// Services
import CourseServices from '../services/course.services'
import StorageServices from '../services/storage.services'

// Pages
import NotFound from './NotFound'

// components
import Loading from './Loading'
import Layout from '../components/Layout'
import { SectionList } from '../components/dnd/SectionList'
import { SectionForm } from '../components/dnd/SectionForm'

// Icons
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { boolean } from 'yup';
import { getUserInfo } from '../helpers/userInfo';
import { Navigate, useNavigate } from 'react-router-dom';


import { BACKEND_URL } from "../helpers/environment";

// Helpers
import categories from "../helpers/courseCategories";
import statuses from "../helpers/courseStatuses";



interface Inputs {
  coverImg?: FileList
  title: string
  description: string
  category: string
  difficulty: number
  status: string
  estimatedHours: number
}

/**
 * This page is responsible for showing and editing courses to the creator.
 *
 * @returns HTML Element
 */
const CourseCreation = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [coverImage, setCoverImage] = useState(null);
    const navigate = useNavigate();

  const token = 'dummyToken'
  // const token = useToken();
  const { id } = useParams() // Get path params

  /**
     * FIX LATER: removed cover image since it has not been implemented to work yet
     */
  const [coverImg, setCoverImg] = useState<File | null>()
  const [coverImgPreview, setCoverImgPreview] = useState<string>('')
  const [categoriesOptions, setCategoriesOptions] = useState<JSX.Element[]>([]);
  const [statusSTR, setStatusSTR] = useState<string>("");
  const [statusChange, setStatusChange] = useState<boolean>(false);
  
  
  useEffect(() => {
      // get categories from db
      let inputArray = ["personal finance","health and workplace safety","sewing","electronics"];
      setCategoriesOptions(inputArray.map((categoryENG: string, key: number) => (
          <option value={categoryENG} key={key} >{categories[inputArray[key]]?.br}</option>
          )));
    }, []);
        
    
    

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

// success on submit handler
const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { id } = getUserInfo();
    setIsLoading(true);
    CourseServices.createCourse({
      title: data.title,
      description: data.description,
      category: data.category,
      difficulty: data.difficulty,
      estimatedHours: data.estimatedHours,
      creator: id,
        }, token)
      .then(res => {
        console.log(res);
        StorageServices.uploadFile({ id: res.data._id + "/0", filePath: coverImage });
        //CourseServices.updateCoverImage(res.data._id, token); // pass the required arguments
        navigate(`/courses/edit/${res.data._id}`);
      })
      .catch(err => console.log(err))
      .finally();
  };
  
    /** TODO: Reimplement when buckets have been implemented */
    /* if (coverImg) {
        changes.coverImg = {
            path: `${id}/coverImg`,
            filename: coverImg.name,
            size: coverImg.size,
            type: coverImg.type
        }
        } */

    /**
     * Delete courses and redirect to courses page
     * Uses window.location.href to redirect instead of navigate, as navigate doesn't update the page
     * 
     * @param id The course id
     * @param token The user token
     */
    const deleteCourse = async () => {
        if (confirm("Você tem certeza?") == true) {
            const response = await CourseServices.deleteCourse(id, token);
            const statusDelete = response.status

            if (statusDelete >= 200 && statusDelete <= 299) {
                toast.success("Curso excluído"); {/* Course deleted */}
                window.location.href = "/courses";
            } else if (statusDelete >= 400 && statusDelete <= 599) {
                toast.error(`(${statusDelete}, ${response.statusText}) while attempting to delete course`)
            }
        }
    }

    function returnFunction(coverImage: any) {
        setCoverImage(coverImage);
      }


    
  // TODO: update cover image function
  /**
   * Sets the cover image preview and the cover image file
   * Though bucket is not implemented yet, so most of this is commented out
   */
  const onCoverImgChange = async (e: any) => {
    const image = 'https://www.shutterstock.com/image-illustration/red-stamp-on-white-background-260nw-1165179109.jpg'
    // const image = e.target.files[0];

    // Enables us to preview the image file before storing it
    setCoverImgPreview(image)
    // setCoverImgPreview(URL.createObjectURL(image));
    /* setCoverImg(image);

        try {
            await StorageService.uploadFile({ file: image, key: `${data.id}/coverImg` })
            toast.success('Image uploaded successfully');
        } catch (error) {
            toast.error('Image could not be uploaded, try again.');
        } */
  }


  return (
        <Layout meta={`Course: ${id}`}>
            <div className="m-8"> 
              <div className="w-2/5 float-left">
              </div>



            {/*Work in progress.....*/}
              <div className="m-10">
           {/*Field to input the title of the new course*/}
            <div className="w-3/5 float-right bg-white rounded justify-between space-y-4">
              <h1 className="text-2xl font-bold justify-between space-y-4"> Informações gerais </h1>
              <form className="flex h-full flex-col justify-between space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col space-y-2 text-left">
                  <label htmlFor='title'>Nome do curso</label> {/*Title*/}
                  <input type="text" defaultValue={""}
                    className="form-field  bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    {...register("title", { required: true })}
                  />
                  {errors.title && <span className='text-warning'>Este campo é obrigatório</span>} {/** This field is required */}
                </div>

                

                <div className="flex items-center gap-8 w-full mt-8">

                  {/*Field to select a level from a list of options*/}
                  <div className="flex flex-col space-y-2 text-left  ">
                    <label htmlFor='level'>Nível</label> {/** Level */}
                    <select
                      className="form-field bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      {...register("difficulty", { required: true })}
                    >
                      {/*Hard coded options by PO, should be changed to get from db*/}
                      <option value={1}>Iniciante </option> {/** Beginner */}
                      <option value={2}>Intermediário</option> {/** Intermediate */}
                      <option value={3}>Avançado </option> {/** Advanced */}

                    </select>
                    {errors.difficulty && <span className='text-warning'>Este campo é obrigatório</span>} {/** This field is required */}
                  </div>

                    {/*Field to choose a category from a list of options*/}
                    <div className="flex flex-col space-y-2 text-left  ">
                    <label htmlFor='category'>Categoria</label> {/** Category */}
                    <select
                        defaultValue={"personal finance"}
                        className="form-field bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        {...register("category", { required: true })}
                    >
                        {/*Hard coded options by PO, should be changed to get from db*/}
                        {categoriesOptions}

                    </select>
                    {errors.description && <span className='text-warning'>Este campo é obrigatório</span>} {/** This field is required */}
                    </div>

                </div>

                {/*Field to input the description of the course*/}
                <div className="flex flex-col space-y-2 text-left ">
                  <label htmlFor='description'>Descrição</label> {/** Description */}
                  <textarea rows={4} defaultValue={""}
                    className="resize-none form-field focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-secondary"
                    {...register("description", { required: true })}
                  />
                  {errors.description && <span className='text-warning'>Este campo é obrigatório</span>} {/** This field is required */}
                </div> 

                {/**  {/*This should be commented out, but maybe it can be used later when we have to use estimated time*/}
                  {/**  {/*Field to input the estimated time*/}
                 
                  <div className="flex flex-col space-y-2 text-left">
                    <label htmlFor='title'>Tempo estimado</label> 
                    <input type="number" defaultValue={""} min={0} step={1}
                    className="form-field focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-secondary"
                    {...register("estimatedHours", { required: true })}
                    />
                    {errors.title && <span className='text-warning'>Este campo é obrigatório</span>} {/** This field is required*/}
                </div>
                
                <div>
                  {/*Cover image field is made but does not interact with the db*/}
                  <div className="flex flex-col space-y-2 text-left">
                    <label htmlFor='cover-image'>Imagem de capa</label> {/** Cover image */}
                    <Dropzone callBack={returnFunction}></Dropzone> {/** FIX: Doesn't have the functionality to upload coverimage to Buckets yet!*/}
                    {errors.description && <span className='text-warning'>Este campo é obrigatório</span>} {/** This field is required */}
                  </div>
                </div>

                {/*Create and cancel buttons*/}
                <div className='modal-action'>
                  <div className="flex items-center justify-between gap-4 w-full mt-8">
                    <label htmlFor='course-create' className=" bg-primary hover:bg-primary focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded">
                      <button type="submit" className='py-2 px-4 h-full w-full'>
                       Adicionar seções {/** Add sections */}
                      </button>
                    </label>
                    <label htmlFor='course-create' className="underline py-2 px-4 bg-transparent hover:bg-warning-100    text-warning w-full transition ease-in duration-200 text-center text-base font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2  rounded">
                      Cancelar e Voltar {/** Cancel */}
                    </label>
                  </div>
                </div>
              </form>
            </div>
          </div> 
          </div>
        </Layout>
  )
}

export default CourseCreation
