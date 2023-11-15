import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler, set } from 'react-hook-form'
import { toast } from 'react-toastify'
import useSWR from 'swr'
import { Dropzone } from '../components/Dropzone/Dropzone'


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
  const [charCount, setCharCount] = useState<number>(0);
  
  const [toolTip, setToolTip] = useState<JSX.Element[]>
  ([
    <ToolTip callBack={setToolTipIndex} textContent='🔈 Nesse ambiente você insere as informações gerais do curso que serão apresentadas aos alunos para se inscreverem! ' myIndex={0} maxIndex={2}></ToolTip>,
    <ToolTip callBack={setToolTipIndex} textContent='😉 Dica: insira uma descrição que desperte a curiosidade e o interesse dos alunos' myIndex={1} maxIndex={2}></ToolTip>,
  ]);

  const navigate = useNavigate();
  
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

const SectionCreation = () => {
  navigate("/sections-creation");
}

function returnFunction(coverImage: any) {
  setCoverImg(coverImage);
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

    /**
     * Delete courses and redirect to courses page
     * Uses window.location.href to redirect instead of navigate, as navigate doesn't update the page
     * 
     * @param id The course id
     * @param token The user token
     */
    const deleteCourse = async () => {
        if (confirm("Você tem certeza?") == true) {
            const responseCourse = await CourseServices.deleteCourse(id, token);
            const statusDeleteCourse = responseCourse.status
            console.log("data.coverImg is: ", data.coverImg)
            const responseFile = await StorageService.deleteFile(data.coverImg, token);


            if (statusDeleteCourse >= 200 && statusDeleteCourse <= 299) {
                toast.success("Curso excluído"); {/* Course deleted */}
                window.location.href = "/courses";
            } else if (statusDeleteCourse >= 400 && statusDeleteCourse <= 599) {
                toast.error(`(${statusDeleteCourse}, ${responseCourse.statusText}) while attempting to delete course`)
            }
        }
    }


    
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

  if (!data && id != "0") return <Loading /> // Loading course details
  if(error) return <NotFound/> // Course not found

  console.log("data is: ")
  console.log(data)

    
    return (
        <Layout meta={`Course: ${id}`}>
            {/*Everything on the left side of the site*/}
            <div className="m-8"> 
              <div className="w-1/4 float-left">
              </div>
              
            {/*Everything on the right side of the site*/}
            <div className="flex w-3/4 float-right items-center justify-left space-y-4 my-4">
              <h1 className="text-2xl text-left font-bold justify-between space-y-4"> Informações gerais </h1>
              {/** Tooltip for course header*/}
              <div className="flex-col space-y-2 text-left" onMouseOver={()=>setToolTipIndex(0)}>
                <Icon
                    path={mdiInformationSlabCircleOutline}
                    size={1}
                    className="text-primaryDarkBlue" // Add cursor-pointer for hover effect
                />
                
                {toolTipIndex ===0? toolTip[0] : <div></div> }
              </div> 
            </div>
            {/*White bagground*/}
            <div className="w-3/4 float-right bg-white rounded-lg shadow-lg justify-between space-y-4">
              <div className="m-10">
              
               {/*Field to input the title of the new course*/}
              <form className="flex h-full flex-col justify-between space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col space-y-2 text-left">
                  <label htmlFor='title'>Nome do curso</label> {/*Title*/}
                  <input type="text" defaultValue={data ? data.title : ""} placeholder={data ? data.title : ""}
                    className="form-field  bg-secondary focus:outline-none focus:ring-2 focus:ring-primaryDarkBlue focus:border-transparent"
                    {...register("title", { required: true })}
                  />
                  {errors.title && <span className='text-warning'>Este campo é obrigatório</span>} {/** This field is required */}
                </div>

                

                <div className="flex items-center gap-8 w-full mt-8">

                  {/*Field to select a level from a list of options*/}
                  <div className="flex flex-col w-1/2 space-y-2 text-left  ">
                    <label htmlFor='level'>Nível</label> {/** Level */}
                    <select
                    defaultValue={data ? data.difficulty : "Selecione o nível"}
                    className="bg-secondary focus:outline-none focus:ring-2 focus:ring-primaryDarkBlue focus:border-transparent"
                    {...register("difficulty", { required: true })}>
                      {/*Hard coded options by PO, should be changed to get from db*/}
                      <option disabled> Selecione o nível</option>
                      <option value={1}>Iniciante </option> {/** Beginner */}
                      <option value={2}>Intermediário</option> {/** Intermediate */}
                      <option value={3}>Avançado </option> {/** Advanced */}

                    </select>
                    {errors.difficulty && <span className='text-warning'>Este campo é obrigatório</span>} {/** This field is required */}
                  </div>

                    {/*Field to choose a category from a list of options*/}
                    <div className="flex flex-col w-1/2 space-y-2 text-left  ">
                    <label htmlFor='category'>Categoria</label> {/** Category */}
                    <select
                        defaultValue={data ? data.category : "Selecione a categoria"}
                        className="bg-secondary focus:outline-none focus:ring-2 focus:ring-primaryDarkBlue focus:border-transparent"
                        {...register("category", { required: true })}>
                             <option value={"Selecione a categoria"} disabled> Selecione a categoria</option>
                        {/*Hard coded options by PO, should be changed to get from db*/}
                        {categoriesOptions}

                    </select>
                    {errors.description && <span className='text-warning'>Este campo é obrigatório</span>} {/** This field is required */}
                    </div>

                </div>

                {/*Field to input the description of the course*/}
                <div className="flex flex-col space-y-2 ">
                    <div className="flex items-center space-x-2"> {/* Container for label and icon */}
                        <label className='text-left' htmlFor='description'>Descrição </label> {/** Description */} 
                        <div className="flex flex-col space-y-2 text-left" onMouseOver={()=>setToolTipIndex(1)}>
                            <Icon
                                path={mdiInformationSlabCircleOutline}
                                size={1}
                                className="text-primaryDarkBlue" // Add cursor-pointer for hover effect
                            />
                            {toolTipIndex ===1? toolTip[1] : <div></div> }
                        </div>
                    </div>
                    <textarea maxLength={400} rows={4}
                    defaultValue={data ? data.description : ""}
                    placeholder={data ? data.description : ""}
                    className="resize-none form-field focus:outline-none focus:ring-2 focus:ring-primaryDarkBlue focus:border-transparent bg-secondary"
                    {...register("description", { required: true })}
                    onChange={(e) => setCharCount(e.target.value.length)}
                    />
                    {errors.description && <span className='text-warning'>Este campo é obrigatório</span>} {/** This field is required */}
                
                    <div className='text-right' >
                    <label htmlFor="">{charCount}/400</label>
                    </div>
                
                </div> 
                
                <div>
                  {/*Cover image field is made but does not interact with the db*/}
                  <div className="flex flex-col space-y-2 text-left">
                    <label htmlFor='cover-image'>Imagem de capa</label> {/** Cover image */} 
                      </div>
                        <Dropzone inputType='image' callBack={returnFunction}></Dropzone> {/** FIX: Doesn't have the functionality to upload coverimage to Buckets yet!*/}
                        {errors.description && <span className='text-warning'>Este campo é obrigatório</span>} {/** This field is required */}
                      </div>
                      <div className='text-right' >
                    <label htmlFor="">o arquivo deve conter no máximo 10Mb</label>
                  </div>

                {/*Create and cancel buttons*/}
                <div className='modal-action'>
                  <div className="flex items-center justify-between gap-4 w-full mt-8">
                  <label onClick={() => { navigate("/courses") }} htmlFor='course-create' className="cursor-pointer underline py-2 px-4 bg-transparent hover:bg-warning-100 text-warning w-full transition ease-in duration-200 text-center text-base font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2  rounded">
                      Cancelar e Voltar {/** Cancel */}
                    </label>
                    
                    <label htmlFor='course-create' className="ml-56 underline py-2 px-4 bg-transparent hover:bg-primaryDarkBlue-100 text-primaryDarkBlue w-full transition ease-in duration-200 text-center text-base font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2  rounded">
                      <button type="submit" className='underline' >
                      Salvar como Rascunho {/** Save as draft */}
                      </button>
                    </label>
                    <label htmlFor='course-create' className="h-12 p-2 bg-primaryDarkBlue hover:bg-primaryDarkBlue focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg">
                      <label onClick={SectionCreation} className='py-2 px-4 h-full w-full cursor-pointer' >
                       Adicionar seções {/** Add sections */}
                      </label>
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

export default CourseEdit
