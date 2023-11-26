// Icon from: https://materialdesignicons.com/

import useSWR from 'swr'

import Icon from '@mdi/react';
import { mdiAlertCircle,mdiPlus,mdiWindowClose } from '@mdi/js';
import { SectionDetail } from './SectionDetail';
import { useState } from 'react';
import { set } from 'cypress/types/lodash';
import { useParams } from 'react-router-dom';

import { SectionForm } from './dnd/SectionForm';
import { SectionList } from './dnd/SectionList';

import { getUserToken } from '../helpers/userInfo';
import { BACKEND_URL } from "../helpers/environment";

import StorageServices from '../services/storage.services';
import CourseServices from '../services/course.services';



interface Inputs {
    id: string,
    token: string,
    increaseTickHandler: Function,
    decreaseTickHandler: Function
}




// Create section
export const SectionCreation = ({ id,token, increaseTickHandler,decreaseTickHandler}: Inputs ) => {
  
  
  const [onSubmitSubscribers, setOnSubmitSubscribers] = useState<Function[]>([]);
  function addOnSubmitSubscriber(callback: Function) {
    //console.log("add subscriber");
    setOnSubmitSubscribers((prevSubscribers) => [
      ...prevSubscribers,
      callback,
    ]);
  }

  function removeOnSubmitSubscriber(callback: Function) {
    setOnSubmitSubscribers((prevSubscribers) =>
      prevSubscribers.filter((cb) => cb !== callback)
    );
  }

  function notifyOnSubmitSubscriber() {
    onSubmitSubscribers.forEach((cb) => cb());
  }


  
  function onSubmit() {
    if(confirm("Tem certeza que deseja sair? As alterações não salvas serão perdidas.") == true){
      notifyOnSubmitSubscriber();
      //increaseTickHandler(); //TODO: add in when next page is implemented
    }
  }

  /**
     * Extra function to handle the response from the course service before it is passed to the useSWR hook
     * 
     * @param url The url to fetch the course details from backend
     * @param token The user token
     * @returns The course details
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

        // Fetch Bucket Details
        if(data?.coverImg){
          var { data: bucketData, error: bucketError } = useSWR(
              token ? [`${BACKEND_URL}/api/bucket/${data?.coverImg}`, token] : null,
              StorageServices.getFile
          )
        }
    }
  
  // ... rest of your component code

  
    return (
      <div>
        <div className="">
          <div className="flex w-full float-right items-center justify-left space-y-4 my-4">
            <h1 className="text-2xl text-left font-bold justify-between space-y-4">Seções do curso </h1>

            
          </div>
          
          <div className="flex w-full float-right items-center justify-left space-y-4 my-4">

                {/** Course Sections area  */}
                <div className='flex w-full flex-col space-y-2 '>
                    <SectionList sections={data ? data.sections : []} addOnSubmitSubscriber={addOnSubmitSubscriber} />
                    <SectionForm callOnSubmit={()=>window.location.reload()}/>
                </div>
          </div>

          <div className="flex w-full float-right space-y-4 ">
            <div className="bg-guideYellow h-10 w-full rounded flex flex-col-2 space-x-2 items-center mb-5 ">
                        <Icon path={mdiAlertCircle} size={1} className="text-warningOrange ml-2 items-center " />
                            <div className='text-sm font-bold ml-2 items-center'>Fique atento!  </div>
                            <div className='text-sm items-center'> Você pode adicionar até 10 itens em cada seção, entre aulas e  exercícios.</div>
            </div>
            
          </div >

          {/*Create and cancel buttons*/}
          <div className='className="flex w-full float-right space-y-4 "'>
            <div className="flex items-center justify-between gap-4 w-full mt-8">
              <label onClick={decreaseTickHandler()}  htmlFor='course-create' className=" w-full cursor-pointer underline py-2 px-4 bg-transparent hover:bg-warning-100 text-primaryDarkBlue w-full transition ease-in duration-200 text-center text-base font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2  rounded">
                  Voltar para Informações {/** GO BACK TO COURSE CREATION PAGE 1/3 IN THE CHECKLIST */}
              </label>
              
              <label htmlFor='course-create' className="ml-56 underline py-2 px-2 bg-transparent w-60 hover:bg-primaryDarkBlue-100 text-primaryDarkBlue w-full transition ease-in duration-200 text-center text-base font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2  rounded">
                <label  className='underline' >
                Salvar como Rascunho {/** Save as draft */}
                </label>
              </label>
              <label htmlFor='course-create' className="h-12 p-2 bg-primaryDarkBlue hover:bg-primaryDarkBlue focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg">
                <label onClick={onSubmit()} className='py-2 px-4 h-full w-full cursor-pointer' >
                    Revisar Curso {/** Go to the Revisar curso page which is not yet implemented therefore it is just a save  */}
                </label>
              </label>
            </div>
          </div>
        </div> 
      </div> 
);}