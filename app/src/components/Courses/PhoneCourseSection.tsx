import { Icon } from '@mdi/react';
import { mdiAccountOutline, mdiCompassOutline, mdiHomeOutline, mdiRobotOutline, mdiChevronLeft, mdiChevronDown } from '@mdi/js';
import { Course} from '../../interfaces/Course';
import CourseServices from '../../services/course.services';
import useSWR from 'swr';

interface PhoneCourseSectionProps {
    course: Course;
}  

const PhoneCourseSession: React.FC<PhoneCourseSectionProps> = ({ course }) => {
    const { data } = useSWR("api/courses/${course_id}/sections", () =>
        CourseServices.getAllCourseSections(course._id)
    );
    
    return (
        <div className="flex flex-col h-screen justify-end bg-[#F2F9FB] w-full mt-3">
            <div className='flex flex-row justify-start items-center p-5'>
                <Icon path={mdiChevronLeft} size={0.7} color="#A3ADB5" className="mt-1 mr-1" />
                {course.title}
            </div>
            <div className="flex flex-row items-center mb-3">
                <button className="bg-[#E4E4E4] text-white p-2 rounded-md text-xs w-3/5 cursor-default ml-5"></button>
                <span className="ml-auto mr-5">0%</span>
            </div>
            {data?.map((section: any, index: number) => (
                index < 5 && (
                <button key={index} className="flex flex-row ml-3 mr-3 mb-2 bg-[#FFFFFF] text-black py-3 rounded-lg text-xs cursor-default">
                    <h2 className="ml-5 max-w-xs text-left">{section.title} </h2>
                    <h2 className="ml-8 text-gray-600 whitespace-nowrap">0/{section.__v} concluídos</h2>
                    <Icon path={mdiChevronDown} size={0.7} color="#A3ADB5" className="ml-auto mr-4"/>
                </button>
                )
            ))}
            <div className="flex flex-col ml-14 mr-14 h-full justify-end">
                <button className="bg-[#FF4848] text-white p-2 rounded-md text-xs w-full mb-5 cursor-default">CANCELAR INSCRIÇÃO</button>
                <button className="bg-[#166276] text-white p-2 rounded-md text-xs w-full mb-5 cursor-default">CONTINUAR SEÇÃO</button>
            </div>
            <div className="flex-grow"></div>
            <nav className="bg-white p-1 shadow-lg" style={{ boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                <ul className="flex space-x-2 text-[10px]">
                    <li className="flex-1 bg-[#5FCBE8] text-white p-1 rounded-xl flex flex-col items-center font-bold">
                        <Icon path={mdiHomeOutline} size={0.6} color="white" />
                        <span className="mt-1">Home</span>
                    </li>
                    <li className="flex-1 text-[#AAB4BA] p-1 flex flex-col items-center">
                        <Icon path={mdiCompassOutline} size={0.6} color="#AAB4BA" />
                        <span className="mt-1">Explore</span>
                    </li>
                    <li className="flex-1 text-[#AAB4BA] p-1 flex flex-col items-center">
                        <Icon path={mdiRobotOutline} size={0.6} color="#AAB4BA" />
                        <span className="mt-1">Edu</span>
                    </li>
                    <li className="flex-1 text-[#AAB4BA] p-1 flex flex-col items-center">
                        <Icon path={mdiAccountOutline} size={0.6} color="#AAB4BA" />
                        <span className="mt-1">Perfil</span>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default PhoneCourseSession;