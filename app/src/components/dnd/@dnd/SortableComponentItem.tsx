
import useSWR from 'swr';
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../../../helpers/environment';

// Hooks
import { getUserToken } from '../../../helpers/userInfo';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// icons
import { mdiChevronDown, mdiChevronUp, mdiPlus, mdiDeleteCircle, mdiDotsVerticalCircle  } from '@mdi/js';
import Icon from '@mdi/react';
import { mdiDraw, mdiPencilCircle, mdiTextBox } from '@mdi/js';

import LectureService from '../../../services/lecture.services';
import ExerciseServices  from '../../../services/exercise.services';
import ComponentService from '../../../services/component.service';

//pop-ups 
import { CreateLecture } from '../../CreateLecturePopUp';
import { CreateExercise } from '../../Exercise/CreateExercisePopUp';


interface Props {
  cid: string
  map: any
}

export function SortableComponentItem({cid, map}: Props) {


  const token = getUserToken();

  // Fetch the section data from the server.
  //  const { data, error } = useSWR(
  //     token ? [cid, map.get(cid), token] : null,
  //     ComponentService.getComponentDetail
  //   );

  const { data, error } = useSWR(
    token ? [`${BACKEND_URL}/api/${map.get(cid)}s/${cid}`, token] : null,
    LectureService.getLectureDetail
  );
    

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: cid });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  async function  handleDelete() {
    if(confirm("Tem certeza de que deseja excluir esse componente?")){
      if(map.get(cid) === "lecture"){
        await LectureService.deleteLecture(cid, token)
      }else{
        await ExerciseServices.deleteExercise(cid, token)
      }
      window.location.reload();
    }
  }
  
  //If data is not found yet, show a loading message.
  if(data === undefined) {return (<p>Loading...</p>)}


  //Else show the sections.
  return (

    <div >
      <div className='w-full rounded border bg-white shadow-lg rounded-lg mb-4'>

          
            <div className="flex flex-row-2 space-y-2 bg-secondary">
              <div className='flex flex-row-2 space-x-2 text-primary items-center ml-5 flex w-5/6 text-right'>
                {map.get(cid)==="exercise"? <Icon path={mdiDraw} size={1} /> :
                <Icon path={mdiTextBox} size={1} />}
                <p className="font-semibold">
                  {data.title}
                </p>
              </div>

              <div className='flex -space-x-6 text-primary ' >
                  
                  {/**edit a lecture or exercise and pencil icon*/}
                  <label htmlFor={map.get(cid) +"-create-"+data._id} className='btn btn-ghost hover:bg-transparent hover:text-primaryHover'>
                    <Icon path={mdiPencilCircle} size={1.2}></Icon>
                  </label>
                  
                  <input type="checkbox" id={map.get(cid) +"-create-"+data._id} className="modal-toggle" />  
                  {map.get(cid)==="lecture"? <CreateLecture savedSID={""} data={data} /> : <CreateExercise savedSID={""} data={data} />}                  
                  

                  {/**delete a lecture or exercise and trash icon*/}
                  <div  className='btn btn-ghost hover:bg-transparent hover:text-primaryHover' onClick={()=>handleDelete()}>
                    <Icon path={mdiDeleteCircle} size={1.2}></Icon>
                  </div>

                  <div  className="" ref={setNodeRef} style={style} {...attributes} {...listeners} >
                    {/**Move a lecture or exercise and "move" icon*/}
                  <div className='btn btn-ghost hover:bg-transparent hover:text-primaryHover'>
                    <Icon path={mdiDotsVerticalCircle} size={1.2}></Icon>
                    
                  </div>  
                  </div>
              </div>  
          </div> 

        

          

        </div>
        
    </div>
  );
}