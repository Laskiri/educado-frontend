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
    test: string,
}




// Create section
export const SectionCreation = ({ test }: Inputs) => {
  const [sections, setSections] = useState<JSX.Element[]>([]);

  const token = getUserToken();
  let id = useParams().id

  function addnewsection() {

    const newSection = (
      <SectionDetail
        key={sections.length} // Ensure each section has a unique key
        test="hey"
        selfDestroy={() => removeSection(sections.length)} // Pass the correct index
        index={sections.length}
      />
    );
    const updatedSections = sections.concat(newSection);
    setSections(updatedSections);
  }

  function removeSection(index: number) {
    setSections((prevSections) => {
      const updatedSections = prevSections.filter((_, i) => i !== index);
      return updatedSections;
    });
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
        var { data: bucketData, error: bucketError } = useSWR(
            token ? [`${BACKEND_URL}/api/bucket/${data?.coverImg}`, token] : null,
            StorageServices.getFile
        )
    }

  // ... rest of your component code

  
    return (
      
    <div>
       
      
      <div className="">
        <div className="flex w-3/4 float-right items-center justify-left space-y-4 my-4">
          <h1 className="text-2xl text-left font-bold justify-between space-y-4">Seções do curso </h1>

          
        </div>
        
        <div className="flex w-3/4 float-right items-center justify-left space-y-4 my-4">

              {/** Course Sections area  */}
              <div className='flex w-full flex-col space-y-2 '>
                  <SectionList sections={data ? data.sections : []} />
                  <SectionForm/>
              </div>
        </div>

        <div className="flex w-3/4 float-right space-y-4 ">
          <div className="bg-guideYellow h-10 w-full rounded flex flex-col-2 space-x-2 items-center mb-5 ">
                      <Icon path={mdiAlertCircle} size={1} className="text-warningOrange ml-2 items-center " />
                          <div className='text-sm font-bold ml-2 items-center'>Fique atento!  </div>
                          <div className='text-sm items-center'> Você pode adicionar até 10 itens em cada seção, entre aulas e  exercícios.</div>
            </div>
          
        </div >

        {/** List of new section */}
        <div className="flex flex-col w-3/4 float-right space-y-4 ">
          {sections}
        </div>


         
        <label className="mt-5 flex bg-transparent hover:bg-transparent h-10  w-3/4 float-right space-y-4 btn std-btn  border border-dashed border-gray-400 ">
          <label onClick={addnewsection} className=" h-10 w-full rounded-lg flex justify-center space-x-2 items-center mb-5 ">
          <p className="hover:text-gray text-gray-500 normal-case font-semibold flex  items-center text-align:center"> 
                <Icon path={mdiPlus} size={1} className=" " />
              Nova seção</p>
          </label>

        </label >
        
          
        

        
        

    </div> 
          

    </div> 
             
                
                    
        
    
    );}