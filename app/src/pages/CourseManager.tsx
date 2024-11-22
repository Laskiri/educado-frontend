import { CourseComponent } from "../components/Courses/CourseComponent";
import { SectionCreation } from "../components/SectionCreation";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useApi } from "@hooks/useAPI";
import { getUserToken } from '../helpers/userInfo';
import Checklist from "../components/Checklist";
import Layout from "../components/Layout";
import CourseServices from '../services/course.services';
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
    const newCourse = id === "0" ? true : false;
    const courseCached = Object.keys(course).length > 0;
    /**
     * Extra function to handle the response from the course service before it is passed to the useSWR hook
     * 
     * @param url The url to fetch the course details from backend
     * @param token The user token
     * @returns The course details
     */
    const {call: getCourseDetails, isLoading: fetchLoading, error: fetchError } = useApi(CourseServices.getCourseDetail);

    
    useEffect(() => {
        console.log("CourseManager useEffect")
        if (courseCached) return
        if (newCourse) { 
            const data = {
                title: "",
                description: "",
                category: "personal finance",
                difficulty: 1,
                status: "draft",
                estimatedHours: 0,
                sections: [],
                coverImg: "",
                _id: "0"
            }
            updateCourse(data)
            return
        }
        const fetchCourseData = async () => {
            const data = await getCourseDetails(id, token)
            console.log("CourseManager useEffect fetchCourseData", data)
            updateCourse(data) 
        }
        fetchCourseData()
    }, [])


    const isCourseBasicInformation = (course: Course) => {
        return course.title !== "" && course.description !== "" && course.category !== "" && (course.difficulty !== 0) && course.status !== "";
    }

    const doesCourseSectionsExist = (course: Course) => {
        return course.sections && course.sections.length > 0;
    }

    useEffect(() => {
        const calculateMaxTick = (course: Course) => {
            if (isCourseBasicInformation(course)) {
                return 1;
            }
            if (doesCourseSectionsExist(course) ?? false) {
                return 1;
            }
            return 0;
        };

        if (newCourse) {
            return;
        }

        if (courseCached) {
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

    if (fetchLoading) return <Layout meta='course overview'><Loading /></Layout>;
    if (fetchError) return <NotFound />;

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