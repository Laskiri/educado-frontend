import { Icon } from '@mdi/react';
import { mdiAccountOutline, mdiCompassOutline, mdiHomeOutline, mdiRobotOutline } from '@mdi/js';

const PhoneCourseSession = () => {
    return (
        <div className="flex flex-col h-screen justify-end bg-[#F2F9FB] w-full">
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