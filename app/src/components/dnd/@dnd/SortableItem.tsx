
import useSWR from 'swr';
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify';

// Hooks
import { getUserToken } from '../../../helpers/userInfo';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// components
import { SectionArrowIcon } from '../../SectionArrowIcon';
import { ComponentList } from '../ComponentList';


// icons
import { mdiChevronDown, mdiChevronUp, mdiDeleteCircle, mdiDotsVerticalCircle, mdiPlus } from '@mdi/js';
import { Icon } from '@mdi/react';
import { useState, useEffect, useRef } from 'react';
import SectionServices from '../../../services/section.services';


//pop-ups 
import { CreateLecture } from '../../CreateLecturePopUp';
import { CreateExercise } from '../../Exercise/CreateExercisePopUp';


interface Props {
  sid: string,
  savedSID: string,
  addOnSubmitSubscriber: Function
  setSavedSID: Function
}

export function SortableItem({ sid, addOnSubmitSubscriber, savedSID, setSavedSID}: Props) {

  const [arrowDirection, setArrowDirection] = useState<any>(mdiChevronDown);
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>(); 
  const subRef= useRef<HTMLInputElement>(null);
  const openRef= useRef<HTMLInputElement>(null);

  const token = getUserToken();
  
  // Fetch the section data from the server.
  const { data } = useSWR(
    token ? [sid, token] : null,
    SectionServices.getSectionDetail
  );


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
    if (arrowDirection === mdiChevronDown){
      setArrowDirection(mdiChevronUp);
    } else {
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
    if(data === undefined) return;
    if(title === undefined && description === undefined) return;

    const changes: SectionPartial = {
        title: data.title,
        description: data.description
     }

     SectionServices.saveSection(changes, sid, token)
    //  .then(res => toast.success('Seção atualizada'))
     .catch(err => toast.error(err));
  }

  function deleteSection(){
    if(confirm("Tem certeza que deseja excluir?") == true){
      SectionServices.deleteSection(sid, token)
      .then(() => {
        toast.success('Seção excluída');
        window.location.reload();
      })
      .catch(err => toast.error(err));
    }
  }

  useEffect(() => {
    if(data?.title === "Nova seção"){
      setArrowDirection(mdiChevronUp);
    }
    addOnSubmitSubscriber(()=>{ subRef.current?.click() });
  },[]);

  function mapIdstoTypes(){
    const idComponentMap = new Map<string, string>();
    for(let i = 0; i < data.components.length; i++){
      idComponentMap.set(data.components[i].compId, data.components[i].compType);
    }
    return idComponentMap;
  }

  function mapIdstoIdObjIds(){
    const idComponentMap = new Map<string, string>();
    for(let i = 0; i < data.components.length; i++){
      idComponentMap.set(data.components[i].compId, data.components[i]._id);
    }
    return idComponentMap;
  }




  //If data is not found yet, show a loading message.
  if(data === undefined) {return (<p>Loading...</p>)}


  //Else show the sections.
  return (
    <div>
      <div className='collapse w-full rounded border bg-white shadow-lg rounded-lg my-4'>
          <input type="checkbox" className="peer w-4/5 h-full" defaultChecked={data.title ==="Nova seção"} onChange={() => changeArrowDirection()} ref={openRef} />
          
          <div className="collapse-title flex flex-row-2 rounded-top text-primary normal-case peer-checked:bg-primary peer-checked:text-white ">
            <div className='flex w-5/6 '>
              <SectionArrowIcon setArrowDirection={setArrowDirection} arrowDirection={arrowDirection} Checkbox={openRef}/>
              <p className="font-semibold">
                {title ?? data.title}
              </p>
            </div>
            <div className='flex collapse'>
              <div onClick={deleteSection} className='btn btn-ghost hover:bg-transparent hover:text-primary'>
                {/**delete and move buttons on the left side of the section headers */}
                <Icon path={mdiDeleteCircle} size={1.2}></Icon>
              </div>  
              <div  className="flex collapse" ref={setNodeRef} style={style} {...attributes} {...listeners} >
                <div className='btn btn-ghost hover:bg-transparent hover:text-primary'>
                  {/**delete and move buttons on the left side of the section headers */}
                  <Icon path={mdiDotsVerticalCircle} size={1.2}></Icon>    
                </div>
              </div>
            </div>
          </div>

          <div className="collapse-content flex flex-col rounded-lg h-50  w-full rounded space-2 px-128 space-y-5">
            <form onSubmit={handleSectionUpdate(onSubmit)}>
              <div className="pt-5">
                <label htmlFor='title'>Nome </label> {/*Title of section*/}
                <input type="text" defaultValue={data.title ?? ""} placeholder={data.title?? "Nome da seção"}
                  className="text-gray-500 flex form-field bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  {...registerSection("title", { required: true })}
                  onChange={(e) => setTitle(e.target.value) } //update the section title
                />
                {sectionErrors.title && <span>Este campo é obrigatório!</span>}{/** This field is required */}
              </div>

              <div className="pt-5">
                <label htmlFor='title'>Descrição </label> {/*description of section*/}
                <textarea defaultValue={data.description ?? ""} placeholder={data.description ??"Descrição da seção"}
                  className="text-gray-500 form-field bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  {...registerSection("description", { required: true })}
                  onChange={(e) => setDescription(e.target.value) } //update the section title
                />
                {sectionErrors.description && <span>Este campo é obrigatório!</span>}{/** This field is required */}
              </div>

              <div className='hidden' onClick={()=>{onSubmit(data)}}>
                <input type='submit' ref={subRef} />
              </div>
            </form>  

            <ComponentList sid={sid} componentIds={data.components.map((obj: any) => obj.compId)} componentTypesMap={mapIdstoTypes()} idMap={mapIdstoIdObjIds()} addOnSubmitSubscriber={addOnSubmitSubscriber}/>

            {/**ADD lecture and exercise to the section */}
            <div className="mt-5 flex  w-full h-12 border border-dashed border-gray-400 rounded-lg flex-col-3 justify-center space-x-2">
              
              {/* The button to open create lecture modal */}
              <label htmlFor="lecture-create-new" onClick={() => setSavedSID(sid)} className="btn std-btn bg-inherit hover:bg-transparent border border-transparent rounded-lg flex justify-right space-x-2  mb-5">
                  <Icon path={mdiPlus} size={1} className="hover:text-gray-500 text-gray-500 " />
                  <p className='hover:text-gray-500 text-gray-500 normal-case ' >Criar nova aula</p>
              </label>
              
              {/* Put this part before </body> tag */}
              <input type="checkbox" id="lecture-create-new" className="modal-toggle" />
              
              <CreateLecture savedSID={savedSID} data={undefined}/> {/** Create new Lecture */}
              
              <p className='text-gray-500 flex items-center text:align-right '>ou</p>
              
              {/** The button to open create exercise modal */}
              <label htmlFor="exercise-create-new" onClick={() => setSavedSID(sid)} className="btn std-btn bg-inherit hover:bg-transparent border border-transparent rounded-lg flex justify-right space-x-2  mb-5">
              <Icon path={mdiPlus} size={1} className="hover:text-gray-500 text-gray-500 " />
                  <p className='hover:text-gray-500 text-gray-500 normal-case' >Criar novo exercício</p>  {/** Create new Exercise */}
              </label>

              <input type="checkbox" id="exercise-create-new" className="modal-toggle" />
              
              <CreateExercise savedSID={savedSID} data={undefined}/> {/** Create new Exercise */}
            </div>

            {/** PLACEHOLDER FOR NUMBER OF ITEMS IN SECTION*/}
            <div className='flex flex-row-reverse'>                            
              <label htmlFor='description'>0/10 items</label>{/** PLACEHOLDER TEXT */}
            </div>
          </div>
        </div>       
    </div>
  );
}