import { CourseComponent } from "../components/Courses/CourseComponent";
import { SectionCreation } from "../components/SectionCreation";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getUserToken } from '../helpers/userInfo';
import { BACKEND_URL } from '../helpers/environment';
import Checklist from "../components/Checklist";
import Layout from "../components/Layout";
import CourseServices from '../services/course.services';
import useSWR from 'swr';
import Loading from '../components/general/Loading';
import NotFound from '../pages/NotFound';
import { CourseProvider, useCourse } from '../contexts/courseStore';

import { Course } from '../interfaces/Course';

/**
 * This component is responsible for creating and editing courses.
 * 
 * @param token The user token
 * @param id The course id
 * @returns HTML Element
 */

const CourseManager = () => {
    const token = getUserToken();
    const { tick } = useParams();
    const [id, setId] = useState<string>(useParams().id ?? "0");
    const [tickChange, setTickChange] = useState<number>(parseInt(tick ?? "0"));
    const [highestTick, setHighestTick] = useState<number>(0);
    const {course, updateCourse } = useCourse();

    /**
     * Extra function to handle the response from the course service before it is passed to the useSWR hook
     * 
     * @param url The url to fetch the course details from backend
     * @param token The user token
     * @returns The course details
     */

    const getData = async (url: string, token: string) => {
        const res: Course = await CourseServices.getCourseDetail(url, token);
        return res;
    };

    const { data, error } = useSWR(
        (token.length > 0) && id !== "0" ? [`${BACKEND_URL}/api/courses/${id}`, token] : null,
        getData
    );

    useEffect(() => {
        if (data) {
            updateCourse(data);
        }
    }, [data]);

    const isCourseBasicInformation = (data: Course) => {
        return data.title !== "" && data.description !== "" && data.category !== "" && (data.difficulty !== 0) && data.status !== "";
    }

    const doesCourseSectionsExist = (data: Course) => {
        return data.sections && data.sections.length > 0;
    }

    useEffect(() => {
        const calculateMaxTick = (data: Course) => {
            if (isCourseBasicInformation(data)) {
                return 1;
            }
            if (doesCourseSectionsExist(data) ?? false) {
                return 1;
            }
            return 0;
        };

        if (id === "0") {
            return;
        }

        if (course !== undefined && course !== null) {
            const maxTick = calculateMaxTick(course);
            setHighestTick(maxTick);
        }
    }, [course, id]);

    function handleTickChange(newTick: number) {
        setTickChange(newTick);
        if (newTick > highestTick) {
            setHighestTick(newTick);
        }
    }

    function updateHighestTick(newHighestTick: number) {
        setHighestTick(newHighestTick);
    }

    if (!data && id !== "0") return <Layout meta='course overview'><Loading /></Layout>;
    if (error !== undefined && error !== null) return <NotFound />;

    return (
        <Layout meta="Course Manager">
            <div className="flex flex-row">
                <Checklist tickChange={tickChange} highestTick={highestTick} id={id ?? ""} setTickChange={handleTickChange} />
                <div className='flex-none w-2/3 mr-20'>
                    {tickChange === 0 && <CourseComponent token={token} id={id} setTickChange={handleTickChange} setId={setId} updateHighestTick={updateHighestTick} />}
                    {tickChange === 1 && <SectionCreation id={id ?? ""} token={token} setTickChange={handleTickChange} />}
                </div>
            </div>
        </Layout>
    );
};

const CourseManagerWrapper = () => (
    <CourseProvider>
        <CourseManager />
    </CourseProvider>
);

export default CourseManagerWrapper;