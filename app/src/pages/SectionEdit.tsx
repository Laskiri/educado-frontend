import useSWR from 'swr';
import { useState, useEffect } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';


// Contexts
import useToken from '../hooks/useToken';

// Services
import SectionServices from '../services/section.services';
import ExerciseServices from '../services/exercise.services';
import LectureServices from '../services/lecture.services';
import { CreateLecture } from '../components/CreateLecturePopUp';
import { CreateExercise } from '../components/Exercise/CreateExercisePopUp';

// Components
import Loading from './Loading';
import Layout from '../components/Layout';
import { ExerciseArea } from '../components/ExerciseArea';
import { LectureArea } from '../components/LectureArea';
import { ToolTip } from '../components/Courses/ToolTip';


// Interface
import { Section } from '../interfaces/CourseDetail';
import { Exercise } from '../interfaces/Exercise'
import { Lecture } from '../interfaces/Lecture'

// Icons
import Icon from '@mdi/react';
import { mdiInformationSlabCircleOutline } from '@mdi/js';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';
import { mdiAlertCircle } from '@mdi/js';



// Backend URL from .env file (automatically injected) 
import { BACKEND_URL } from "../helpers/environment";

type Inputs = {
    title: string,
    description: string,
};

type SectionPartial = {
    title: string;
    description: string;
};
  

/**
 * SectionEdit component
 *
 * @returns JSX.Element
 */
const SectionEdit = () => {
    const { sid } = useParams();
    //const token = useToken();
    const token = "bruh";

    // Component state
    const [section, setSection] = useState<Section>();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [contentCount, setContentCount] = useState(0);



    //Fetch section details
    const { data: sectionData, error: sectionError } = useSWR(
        token ? [sid, token] : null,
        SectionServices.getSectionDetail
    );

   

    // Fetch the exercises data from the server.    
    const { data: exerciseData, error: exerciseError } = useSWR(
        token ? [`${BACKEND_URL}/api/exercises/section/${sid}`, token] : null,
        ExerciseServices.getExerciseDetail
    );
    
    // Fetch the lecture data from the server.    
    const { data: lectureData, error: lectureError } = useSWR(
        token ? [`${BACKEND_URL}/api/lectures/section/${sid}`, token] : null,
        LectureServices.getLectureDetail
    );
    
    // Create Form Hooks
    const { register: registerSection, handleSubmit: handleSectionUpdate, formState: { errors: sectionErrors } } = useForm<Section>();
  

 /**
 * Delete section and redirect to course edit page
 * Uses window.location.href to redirect instead of navigate, as navigate doesn't update the page
 * 
 * @param sid The section id
 * @param token The user token
 */
const deleteSection = async () => {
    if (confirm("Você tem certeza?") == true) {
        const response = await SectionServices.deleteSection(sid, token);
        const status = response.status

        if (status >= 200 && status <= 299) {
            window.location.href = `/courses/edit/${cid}`;
            toast.success("Section deleted")
        } else if (status >= 400 && status <= 599) {
            toast.error(`(${status}, ${response.statusText}) while attempting to delete section`)
        }
    }
}

    
const [toolTipIndex, setToolTipIndex] = useState<number>(4);

function temp() {
    return toolTipIndex;
}
    
    const [toolTip, setToolTip] = useState<JSX.Element[]>
    ([
    <ToolTip callBack={setToolTipIndex} textContent='👩🏻‍🏫Nossos cursos são separados em seções e você pode adicionar quantas quiser!' myIndex={0} maxIndex={3}></ToolTip>,
    <ToolTip callBack={setToolTipIndex} textContent='📚Em cada seção você pode adicionar até 10 itens, entre aulas e exercícios' myIndex={1} maxIndex={3}></ToolTip>,
    <ToolTip callBack={setToolTipIndex} textContent='😊Lembre-se que precisamos manter os alunos engajados! Quanto mais simples, objetivo e lúdico, melhor!' myIndex={2} maxIndex={3}></ToolTip>,
   
    ]);
    
    
    /**
     * SubmitHandler: update section
     * 
     * @param data  The data to be updated
    */
   const onSubmit: SubmitHandler<Inputs> = (data) => {
       const changes: SectionPartial = {
           title: data.title,
           description: data.description
        }
        
        SectionServices.saveSection(changes, sid, token)
        .then(res => toast.success('Seção atualizada'))
        .catch(err => toast.error(err));
    }
    
    // Render onError and onLoading
    if (sectionError) return <p>"An error has occurred."</p>;
    if (!sectionData || !exerciseData || !lectureData) return <Loading/>;

    const cid =  sectionData.parentCourse;

    // Limiter for the number of exercises and lectures to be < 10
    const limit = sectionData.lectures.length + sectionData.exercises.length;
    // Limiter for the number of lectures to be < 7
    const lectureLimit = sectionData.lectures.length;
    
    

    return (
        
        <Layout meta='Section edit page' >
            
            <div className="w-full" >
                {/** Course navigation */}
                <div className="navbar bg-base-100">
                    <div className='flex-1'>
                        {<Link to={`/courses/edit/${cid}`} className="btn btn-square btn-ghost normal-case text-xl" reloadDocument><ArrowLeftIcon width={24} /></Link>}
                        <a className="normal-case text-xl ml-4">{section?.parentCourse || "Voltar à edição do curso"}</a>
                    </div>
                </div>

                {/** Section details edit */}
                
                <div className='max-w-3xl mx-auto bg-white p-4 rounded my-6 ' >
                    <div className='flex flex-row-2 items-center justify-center pb-6'>
                        <h1 className='text-3xl text-center font-medium'>Seção</h1>
                        {/** Tooltip for Section header*/}
                        <div className="flex flex-col space-y-2 text-left" onMouseOver={()=>setToolTipIndex(0)}>
                            <Icon
                                path={mdiInformationSlabCircleOutline}
                                size={1}
                                className="text-primaryDarkBlue" // Add cursor-pointer for hover effect
                            />
                            
                            {toolTipIndex ===0? toolTip[0] :<div></div> }
                        </div>
                    </div>

                    <div className="bg-guideYellow h-10 rounded flex flex-col-2 space-x-2 items-center mb-5 ">
                    <Icon path={mdiAlertCircle} size={1} className="text-warningOrange ml-2 items-center " />
                        <div className='text-sm font-bold ml-2 items-center'>Fique atento!  </div>
                        <div className='text-sm items-center'> Você pode adicionar até 10 itens em cada seção, entre aulas e  exercícios.</div>
                    </div>
                    
                    {/** Section update area */}
                    <form
                        onSubmit={handleSectionUpdate(onSubmit)}
                        className="flex flex-col space-y-6 divide"
                    >
                        {/** Section Title Field */}
                        <div className="flex flex-col space-y-2">
                            <label htmlFor='title'>Título da seção</label>{/**Title of the section */}
                            <input type="text" defaultValue={section?.title || sectionData?.title} placeholder={sectionData?.title}
                                className="form-field focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                {...registerSection("title", { required: true })}
                            />
                            {sectionErrors.title && <span>Este campo é obrigatório!</span>}{/** This field is required */}
                        </div>
 
                        {/** Section Description Field */}
                        <div className="flex flex-col space-y-2">

                            <div className='flex flex-row-2'>                            
                            <label htmlFor='description'>Descrição da seção</label>{/** Description of the section */}

                            {/** Tooltip for description of section*/}
                                <div className="flex flex-col space-y-2 text-left" onMouseOver={()=>setToolTipIndex(2)}>
                                    <Icon
                                        path={mdiInformationSlabCircleOutline}
                                        size={1}
                                        className="text-primaryDarkBlue" // Add cursor-pointer for hover effect
                                    />
                                    
                                    {toolTipIndex ===2? toolTip[2]: <div></div>}
                                </div>
                             </div>

                            <textarea rows={4} defaultValue={section?.description || sectionData?.description} placeholder={sectionData?.description}
                                className="resize-none form-field focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                {...registerSection("description", { required: false })}
                            />
                            {sectionErrors.description && <span>Este campo é obrigatório!</span>}{/** This field is required */}
                        </div>
                        <div className="flex items-left w-full mt-8">
                            {/** Section save and delete button */}
                            <button type="button" onClick={deleteSection} className='left-0 std-button bg-warning hover:bg-red-800' >Excluir</button> {/** Delete*/}
                            <button type="submit" className='std-button  ml-auto'>Atualizar</button> {/** Save*/}
                        </div>
                    </form>

                    <div className="divider"></div>
                    


                    {/** Lecture list area */}
                    <div className='flex flex-col space-y-4 mb-4' id='lectures'>
                        <h1 className='text-xl  font-medium'>Aulas</h1> {/** Lecture*/}
                        <LectureArea lectures={lectures.length > 0 ? lectures : lectureData} />
                    </div>



                    {/**Create new lecture that disappear if there is 10 or more exercise and lectures*/}
                    {limit < 10 && lectureLimit < 7 ?
                    <div className="navbar bg-none p-6" >
                        
                         <CreateLecture /> 
                         
                    </div>
                    :
                    <div></div>
                    }

                    <div className="divider"></div>
                    
   
                    {/** Exercise list area */}
                    <div className='flex flex-col space-y-4 mb-4' id='exercises'>
                        <h1 className='text-xl font-medium'>Exercícios</h1> {/** Exercises*/}
                        <ExerciseArea exercises={exercises.length > 0 ? exercises : exerciseData} />
                    </div>
                    
                   
          
                    {/**Create new exercise that disappear if there is 10 or more exercise and lectures  */}
                    {limit  <10 ?
                    <div className="navbar bg-none p-6">
                        <div className="flex-1">
                            {/** Create new Exercise */}
                            {<CreateExercise sid={sid}/>}
                        </div>
                    </div>
                    :
                    <div></div>
                    }

                    {/** PLACEHOLDER FOR NUMBER OF ITEMS IN SECTION*/}
                    <div className='flex flex-row-2'>                            
                        <label htmlFor='description'>0/10 items</label>{/** PLACEHOLDER TEXT */}

                        {/** Tooltip for description of section*/}
                        <div className="flex flex-col space-y-2 text-left" onMouseOver={()=>setToolTipIndex(1)}>
                            <Icon
                                path={mdiInformationSlabCircleOutline}
                                size={1}
                                className="text-primaryDarkBlue" // Add cursor-pointer for hover effect
                            />
                            
                            {toolTipIndex ===1? toolTip[1]: <div></div>}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default SectionEdit