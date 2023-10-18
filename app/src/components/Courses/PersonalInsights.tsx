// Interfaces
import { Course } from '../../interfaces/Course';

// Components
import StarRating from "../general/StarRating";

type PersonalInsightsProps = {
  courses: Course[];
}

/**
 * @param props 
 * @param props.courses
 * @returns HTML Element
 * 
 * This component displays personal insights about the user.
 * (Right side of the Courses page at the time of writing)
 */
const PersonalInsights = (props: PersonalInsightsProps) => {
  const courses = props.courses ?? [];

  // TODO: Implement functionality for user info fields
  return (
    <div className='w-full h-full'>
      {/* Welcome message */}
      <h2 className='text-xl font-bold'>Olá User Name</h2>
      {/* Progress section (stats) */}
      <div className='border-y-[1px] border-grayMedium my-4 py-8 '>
        <p className='font-bold'>Progresso</p>
        <div className='grid grid-cols-4 lg:grid-cols-1 gap-y-4'>
          {/* Show stats if the user has > 0 courses */}
          {courses.length ? <>
          <div>
            {/* Total courses */}
            <p>Total cursos</p>
            <p className='font-bold'>8</p>
          </div>
          <div>
            {/* Total students */}
            <p>Total alunos</p>
            <p className='font-bold'>167</p>
          </div>
          <div>
            {/* Total certificates issued */}
            <p>Total certificados emitidos</p>
            <p className='font-bold'>54</p>
          </div>
          <div>
            {/* Rating */}
            <p>Avaliação</p>
            <div className='w-[12rem] max-w-full'>
              <StarRating rating={3.7} className='text-2xl font-bold' />
            </div>
          </div>
          {/* If the user has 0 courses */}
          </> : <p className='italic'>Não há dados suficiente</p> /* There's not enough data */}
        </div>
      </div>
      {/* Activities section */}
      <div className='py-8'>
        <p className='font-bold'>Atividades</p> {/* */}
        <div className='grid grid-cols-4 lg:grid-cols-1 gap-y-2'>
          {/* Show activities if the user has > 0 courses */}
          {courses.length ? <>

          {/* If the user has 0 courses */}
          </> : <p className='italic'>Nenhuma atividade</p> /* No activities */ }
        </div>
      </div>
    </div>
  );
}

export default PersonalInsights;
