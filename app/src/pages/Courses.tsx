// Hooks
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';
import useToken from '../hooks/useToken';

// Services
import CourseServices from '../services/course.services';

// Interfaces
import { Course } from '../interfaces/Course';

// Components
import Layout from '../components/Layout'
import Loading from './Loading';
import { CourseListCard } from '../components/Courses/CourseListCard'
import { CreateCourseModal } from '../components/Courses/CreateCourseModal';
import PersonalInsights from '../components/Courses/PersonalInsights';

// Images
import noCoursesImage from '../assets/no-courses.png';

/**
 * @returns HTML Element
 * 
 * This page displays all courses created by the user\
 * as well as some personal insights about the user.
 */
const Courses = () => {
  // States and Hooks
  const navigate = useNavigate();
  const token = useToken();

  // Fetch all courses

  // TODO: Implement proper backend call once backend is ready

  const { data, error } = useSWR(
    token ? ["http://127.0.0.1:8888/api/courses/eml/getall", token] : null,
    CourseServices.getAllCourses
  );
  /* const data: Course[] = [
    {
      _id: "1",
      title: "Curso de Matemática",
      description: "Aprenda matemática de forma fácil e divertida",
      createdAt: new Date("2023-10-10T00:00:00.000Z"),
      modifiedAt: new Date("2023-10-13T13:01:00.000Z"),
      coverImg: "",
      category: "health and workplace safety",
      sections: [],
      creators: [1],
      difficulty: 2,
      status: 'draft',
      estimatedHours: 8.5,
      rating: 4.5,
      numOfSubscriptions: 157,
      __v: 0,
    },
    {
      _id: "2",
      title: "Curso de Finanças",
      description: "Aprenda finanças de forma fácil e divertida",
      createdAt: new Date("2023-10-10T00:00:00.000Z"),
      modifiedAt: new Date("2023-10-11T00:00:00.000Z"),
      coverImg: "",
      category: "sewing",
      sections: [],
      creators: [1],
      difficulty: 2,
      status: 'draft',
      estimatedHours: 8.5,
      rating: 2.2,
      numOfSubscriptions: 157,
      __v: 0,
    },
    {
      _id: '3',
      title: "Curso de Matemática you know?",
      description: "Aprenda matemática de forma fácil e divertida",
      createdAt: new Date("2023-10-10T00:00:00.000Z"),
      modifiedAt: new Date("2021-05-15T00:00:00.000Z"),
      coverImg: "",
      category: "undefined category",
      sections: [],
      creators: [1],
      difficulty: 2,
      status: 'published',
      estimatedHours: 8.5,
      rating: 3.75,
      numOfSubscriptions: 157,
      __v: 0,
    },
  ];
  const error = null; */

  // useSWR built in loaders
  if (error) {
    navigate("/login");
    return null
  }
  if (!data) return <Loading />;

  return (
    <Layout meta="Course overview" >
      <div className='grid lg:grid-cols-[3fr_1fr] h-full'>
        {/* Left side displaying courses, filtering for these and create new button */}
        <div className='m-8 p-8 pb-0 bg-white rounded-xl overflow-hidden flex flex-col'>
          {data.length ? <>
            {/* Header and create course button */}
            <div className='flex flex-row no-wrap'>
              <h1 className='text-3xl font-bold flex-1'>Confira seus cursos</h1>
              <CreateCourseModal />
            </div>
            {/* Card/compact view toggle and filters */}
            <div className='h-10 my-8 bg-grayLight'>
              {/* TODO: Implement card/compact view toggle */}

              {/* TODO: Implement filters */}

            </div>
            <div className='overflow-y-scroll no-scrollbar'>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-6 pb-4">
                {data.map((course: any, key: number) => <CourseListCard course={course} key={key} />)}
              </div>
            </div></>
            :
            // If the user has no courses, display this 'empty state'
            <div className='grid place-content-center w-full h-full text-center'>
              <div className='md:mx-40 xl:mx-64'>
                <img src={noCoursesImage} className='w-full' />
                <h1 className='text-xl font-bold my-4'>Comece agora</h1>
                {/* You haven't created any courses yet.
                Click the button below and follow the
                step-by-step instructions to develop your first course. */}
                <p>Você ainda não criou nenhum curso. Clique no botão abaixo e siga o passo a passo para desenolver o seu primeiro curso.</p>
                {/* Create course button */}
                <CreateCourseModal className='mt-4' />
              </div>
            </div>
          }
        </div>
        {/* Right side displaying personal insights */}
        <div className='m-8 hidden lg:block'>
          <PersonalInsights courses={data} />
        </div>
      </div>
    </Layout>
  )
}

export default Courses

