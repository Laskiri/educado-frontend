import { Link, useLocation} from 'react-router-dom';
import useSWR from 'swr';
import { useForm, SubmitHandler, set } from 'react-hook-form'
import { toast } from 'react-toastify';



// Hooks
import useToken from '../../../hooks/useToken';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// icons

import { mdiChevronDown, mdiChevronUp, mdiPlus, mdiDeleteCircle, mdiDotsVerticalCircle  } from '@mdi/js';

import Icon from '@mdi/react';

import { useState } from 'react';

import SectionServices from '../../../services/section.services';

export function SortableItem(props: any) {

  const sid = props.item;

  
  //const token = "dummyToken";
  const token = useToken();
  
  // Fetch the section data from the server.
  const { data, error } = useSWR(
    token ? [sid, token] : null,
    SectionServices.getSectionDetail
  );

  const [arrowDirction, setArrowDirection] = useState<any>(mdiChevronDown);
  
    

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: sid });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  //Toggles the arrow direction between up and down
  function changeArrowDirection (){
    if (arrowDirction === mdiChevronDown){
      setArrowDirection(mdiChevronUp);
    }else{
      setArrowDirection(mdiChevronDown);
    }
  }

  type SectionPartial = {
    title: string;
    description: string;
  };
  // Create Form Hooks
  const { register: registerSection, handleSubmit: handleSectionUpdate, formState: { errors: sectionErrors } } = useForm<SectionPartial>();
  

 

  /**
     * SubmitHandler: update section
     * 
     * @param data  The data to be updated
    */
  const onSubmit: SubmitHandler<SectionPartial> = (data) => {
    const changes: SectionPartial = {
        title: data.title,
        description: data.description
     }
     
     SectionServices.saveSection(changes, sid, token)
     .then(res => toast.success('Seção atualizada'))
     .catch(err => toast.error(err));
 }

  //If data is not found yet, show a loading message.
  if(data === undefined) return (<div>Loading...</div>);
  

  //Else show the sections.
  return (

    <div>
      <div className='collapse w-full rounded border bg-white shadow-lg rounded-lg m-4'>
          <input type="checkbox" className="peer w-3/4" onChange={changeArrowDirection} />

          <div className="collapse-title rounded-top hover:text-gray-700 text-primaryDarkBlue normal-case peer-checked:bg-primaryDarkBlue peer-checked:text-white ">
            <div className=' flex float-left'>
              <Icon path={arrowDirction} size={1} />
              <p className="font-semibold">
                {data.title ?? "Nome da seção"}
              </p>
            </div>
          </div> 

          <div  className="collapse" ref={setNodeRef} style={style} {...attributes} {...listeners} >
            <div className='btn btn-ghost'>
              {/**delete and move buttons on the left side of the section headers */}
              <Icon path={mdiDotsVerticalCircle} size={1.2}></Icon>
              
            </div>
          </div>
           
            
            
            <div className="collapse-content flex flex-col rounded-lg h-100  w-full rounded space-2  p-4 px-128 space-y-5">
              <form
                  onSubmit={handleSectionUpdate(onSubmit)}

              >
                  <div className=" ">
                    <label htmlFor='title'>Nome </label> {/*Title of section*/}
                    <input type="text"  placeholder={data.title?? "Nome da seção"}
                      className="text-gray-500 form-field bg-secondary focus:outline-none focus:ring-2 focus:ring-primaryDarkBlue focus:border-transparent"
                      {...registerSection("title", { required: true })}
                    />
                    
                  </div>

                  <div className="">
                    <label htmlFor='title'>Descrição </label> {/*description of section*/}
                    <textarea placeholder={data.description ??"Descrição da seção"}
                      className="text-gray-500 form-field bg-secondary focus:outline-none focus:ring-2 focus:ring-primaryDarkBlue focus:border-transparent"
                    />
                    
                  </div>
              </form>
                
              {/**ADD lecture and exercise to the section */}
              <div className="mt-5 flex  w-full h-12 border border-dashed border-gray-400 rounded-lg flex-col-3 justify-center space-x-2 ">
                  <label className=" btn std-btn  bg-inherit hover:bg-transparent border border-transparent w-1/4 border rounded-lg flex space-x-2 mb-5 ">
                    <p className="hover:text-gray-500 text-gray-500 normal-case flex items-center "> 
                    <Icon path={mdiPlus} size={1} className=" " />
                    Adicionar Aula</p>
                  </label>
                  <p className='text-gray-500 flex items-center text:align-right '>ou</p>
                  <label className="btn std-btn bg-inherit hover:bg-transparent border border-transparent w-1/4 rounded-lg flex justify-right space-x-2  mb-5 ">
                    <p className="hover:text-gray-500 text-gray-500 normal-case flex items-center text:align-right"> 
                    <Icon path={mdiPlus} size={1} className=" " />
                    Adicionar Exercício</p>
                  </label>
              </div>

              {/** PLACEHOLDER FOR NUMBER OF ITEMS IN SECTION*/}
              <div className='flex flex-row-reverse'>                            
                    <label htmlFor='description'>0/10 items</label>{/** PLACEHOLDER TEXT */}</div>
              </div>
        </div>
    </div>
  );
}