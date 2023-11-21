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

            {/** Course navigation */}
            <form onSubmit={handleSubmit(onSubmit)} >
                <div className="navbar bg-base-100 ">
                    <div className='flex-1'>
                        <Link to="/courses" className="btn btn-square btn-ghost normal-case text-xl" reloadDocument><ArrowLeftIcon width={24} /></Link>
                        <a className="normal-case text-xl ml-4">{data ? data.title : ""}</a>
                    </div>
                    <div className="flex-none space-x-2">
                        <DeleteButton id={id} token={token} deleteType={DeleteType.course}/> {/*Delete button*/}
                        <button type="submit" className='std-button text-white border-0'>Atualizar</button> {/* Update button */}
                        <button type="submit" onClick={() => setStatusChange(true)} className='std-button bg-primary text-white border-0'>{statusSTR === "draft"? "Publicar":"Definir como rascunho" }</button>
                    </div>
                </div>

                {/** Course details edit */}
                <div className="container mx-auto flex flex-row space-x-4 my-6">
                    <div className='w-full max-w-5xl mx-auto bg-white rounded p-6'>
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                            <div className='flex flex-col space-y-6 divide'>

                                {/* Course status */}
                                <div className='flex items-center justify-center pb-6 '> {/* Updated here */}
                                    <h1 className='text-3xl text-center font-medium'>Curso</h1> {/* Course details */}
                                    
                                    {/** Tooltip for course header*/}
                                    <div className="flex flex-col space-y-2 text-left" onMouseOver={()=>setToolTipIndex(0)}>
                                        <Icon
                                            path={mdiInformationSlabCircleOutline}
                                            size={1}
                                            className="text-primaryDarkBlue" // Add cursor-pointer for hover effect
                                        />
                                        
                                        {toolTipIndex ===0? toolTip[0] : <div></div> }
                                    </div>  
                                  <div className='flex flex-row justify-center'>
                                    <div className={'w-3 h-3 mx-2 rounded-full m-auto '+(statuses[statusSTR].color ?? statuses.default.color)} />
                                    <p className='italic'>
                                      {statuses[statusSTR].br ?? statuses.default.br}
                                    </p>
                                    
                                  </div>
                                </div>

                                {/** Course Title Field */}
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor='title'>Título</label>
                                    <input type="text" defaultValue={data ? data.title : ""} placeholder={data ? data.title : ""}
                                        className="form-field focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                        {...register('title', { required: true})}
                                    />
                                    {errors.title && <span>Este campo é obrigatório!</span>}
                                </div>

                                {/** Course Description Field */}
                                <div className="flex flex-col space-y-2 items-start relative">
                                <div className="flex items-center space-x-2"> {/* Container for label and icon */}
                                    <label htmlFor='description' className="flex-shrink-0">Descrição</label>
                                    {/** Tooltip for description of course*/}
                                    <div className="flex flex-col space-y-2 text-left" onMouseOver={()=>setToolTipIndex(1)}>
                                        <Icon
                                            path={mdiInformationSlabCircleOutline}
                                            size={1}
                                            className="text-primaryDarkBlue" // Add cursor-pointer for hover effect
                                        />
                                        
                                        {toolTipIndex ===1? toolTip[1] : <div></div> }
                                </div>
                                </div>
                                <textarea
                                    rows={4}
                                    defaultValue={data ? data.description : ""}
                                    placeholder={data ? data.description : ""}
                                    className="resize-none form-field focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    {...register('description', { required: true })}
                                />
                                {errors.description && <span>Este campo é obrigatório!</span>}
                                </div>

                                {/* Field to choose a category from a list of options */}
                                <div className="flex flex-col space-y-2 text-left">
                                    <label htmlFor='category'>Categoria</label>

                                    <select defaultValue={data ? data.category : "Selecione a categoria"}
                                        className=" focus:outline-none focus:ring-2 focus:ring-primaryDarkBlue focus:border-transparent"
                                        {...register("category", { required: true })}>
                                            <option value={"Selecione a categoria"} disabled> Selecione a categoria</option>
                                        {/*Hard coded options by PO, should be changed to get from db*/}
                                        {categoriesOptions}

                                    </select>
                                    {errors.category && <span className='text-warning'>Este campo é obrigatório</span>}
                                </div>

                                {/* Field to select a level from a list of options */}
                                <div className="flex flex-col space-y-2 text-left">
                                    <label htmlFor='level'>Nível</label> {/* Level */}
                                    <select defaultValue={data ? data.difficulty : 0}
                                        className="small-form-field focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        {...register('difficulty', { required: true })}
                                    >
                                        {/* Hard coded options by PO, should be changed to get from db */}
                                        <option value={1}>Iniciante </option> {/* Beginner */}
                                        <option value ={2}>Intermediário</option> {/* Intermediate */}
                                        <option value={3}>Avançado </option> {/* Advanced */}

                                    </select>
                                    {errors.difficulty && <span className='text-warning'>Este campo é obrigatório</span>}
                                </div>

                              
                                {/* Field to input the estimated estimatedHours */}
                                <div className="flex flex-col space-y-2 text-left">
                                    <label htmlFor='title'>Tempo estimado</label> {/* Estimated time */}
                                    <input type="number" defaultValue={data ? data.estimatedHours : 0} min={0} step={1}
                                        className="form-field focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        {...register('estimatedHours', { required: true })}
                                    />
                                    {errors.title && <span className='text-warning'>Este campo é obrigatório</span>}
                                    
                                </div>

                                {/** Cover Image Field */}
                                <div className="flex flex-col">
                                    <div className='relative'>
                                        <div className='p-0 rounded-b-none rounded-t border-gray-300 border-x border-t h-[240px] overflow-hidden'>
                                            {bucketData ?
                                                <img src={ coverImgPreview? coverImgPreview : "data:image;base64," + bucketData} /*alt={data.title}*/ className="object-cover w-full h-full rounded" /> :
                                                <div className='h-full w-full oceanic-gradient flex justify-center items-center text-2xl text-white'>Sem imagem de capa</div>
                                            }

                                        </div>
                                        {/* Cover image upload */}
                                        <input type="file" accept='.jpg,.jpeg,.png'
                                            onChange={onCoverImgChange}
                                            className='file-input w-full input-bordered rounded-b rounded-t-none focus:outline-none'
                                        >
                                        </input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

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
