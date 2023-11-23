// Icon from: https://materialdesignicons.com/

import useSWR from 'swr'

import Icon from '@mdi/react';
import { mdiAlertCircle,mdiPlus,mdiWindowClose } from '@mdi/js';
import { SectionDetail } from './SectionDetail';
import { useState } from 'react';
import { set } from 'cypress/types/lodash';


interface Inputs {
    test: string,
}




// Create section
export const SectionCreation = ({test}:Inputs) => {
 
  const [sections, setSections] = useState<JSX.Element[]>([]);

  function addnewsection (){
    const tong = sections.concat(<SectionDetail test="hey" selfDestroy={removeSection} index={sections.length}/>);
    console.log("the section 3 ",sections);

    
    setSections(tong);
  }

  function removeSection(index: number) {
    setSections(prevSections => {
      console.log("remove section", index);
      console.log("the section 1 ", prevSections);
  
      let updatedSections = prevSections.filter((_, i) => i !== index);
      console.log("remove section", index);
      console.log("the section 1 ", prevSections);
  
      console.log("the section 2 ", prevSections, updatedSections);
  
      return updatedSections;
    });
  }
  
    return (
      
    <div>
      
      <div className="">
        <div className="flex w-3/4 float-right items-center justify-left space-y-4 my-4">
          <h1 className="text-2xl text-left font-bold justify-between space-y-4">Seções do curso </h1>

          
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