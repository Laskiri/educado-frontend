import { useState } from 'react'
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form";

// Icons
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline"

// components
import Layout from '../components/Layout'
import { CategoryPill as Pill } from "../components/CategoryPill";
import { SectionList } from '../components/dnd/SectionList';

// Services
import CourseServices from '../services/course.services';
import useAuthStore from '../contexts/useAuthStore';
import NotFound from './NotFound';
import { SectionForm } from '../components/dnd/SectionForm';
import StorageService from '../services/storage.services';

// Interface
import { StorageFile } from '../interfaces/File';

type Inputs = {
    coverImg: FileList
    title: string,
    description: string,
};

type CoursePartial = {
    coverImg?: StorageFile | {}
    title: string,
    description: string,
}

const CourseEdit = () => {
    // Demo data
    const DEFAULT_COVER_IMAGE = "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"

    // Get path params
    const { id } = useParams();

    // Global state
    const token = useAuthStore(state => state.token);

    // Fetch data with useSWR
    const { data, error } = useSWR(
        [`http://127.0.0.1:8888/api/courses/${id}`, token],
        CourseServices.getCourseDetail
    )

    console.log(data);

    // React useForm setup
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data);
        const changes: CoursePartial = {
            title: data.title,
            description: data.description
        }

        if (coverImg) {
            changes.coverImg = {
                path: `${id}/coverImg`,
                filename: coverImg.name,
                size: coverImg.size,
                type: coverImg.type
            }
        }

        CourseServices.updateCourseDetail(changes, id)
        .then(res => toast.success(res))
        .catch(err => toast.error(err))

    };



    const course = {
        id: "6335993db89fa3077a35ce82",
        title: "Basic Python",
        description: "Python - Learn math while you commute, develop the skills you need, conquer tomorrow's job market, begin your journey today",
        cover_image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
        created_at: "26 sept 2022",
        categories: ["Programming", "IT"],
        creator: {
            name: "Frederik Bode",
            image: "https://www.tailwind-kit.com/images/person/7.jpg",
            institution: "AAU"
        },
        sections: [
            { name: "variables" },
            { name: "input and output" },
            { name: "functions" },
            { name: "classNamees" }
        ]
    }

    const [coverImg, setCoverImg] = useState()
    const [coverImgPreview, setCoverImgPreview] = useState()


    if (error) return <NotFound />;
    if (!data) return <p>"Loading..."</p>;


    const onCoverImgChange = async (e: any) => {
        const image = e.target.files[0];

        // Enables us to preview the image file before storing it
        // Using coverImage from useState variable instead of regular form field
        // as useForm handles files a little inconsistent
        setCoverImgPreview(URL.createObjectURL(image));
        setCoverImg(image);

        try {
            await StorageService.uploadFile({ file: image, key: `${data.data.id}/coverImg` })
            console.log('success!');
        } catch (error) { console.log(error); }
    }

    return (
        <Layout meta={`Course: ${123}`}>

            {/** Course navigation */}
            <div className="navbar bg-base-100">
                <div className='flex-1'>
                    <Link to="/courses" className="btn btn-square btn-ghost normal-case text-xl"><ArrowLeftIcon width={24} /></Link>
                    <a className="normal-case text-xl ml-4">{data.title}</a>
                </div>
                <div className="flex-none space-x-2">
                    <button onClick={() => toast.success("Course published")} className='btn btn-sm bg-blue-500 text-white border-0'>Unpublish</button>
                    <button type="submit" className='btn btn-sm bg-blue-700 text-white border-0'>Update Course</button>
                </div>
            </div>

            {/** Course details edit */}
            <div className="container mx-auto flex flex-row space-x-4 p-6">
                <div className='w-full max-w-5xl mx-auto bg-white rounded-xl p-6'>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                        <div className='flex flex-col space-y-6 divide'>
                            <h1 className='text-xl font-medium'>Course Content</h1>

                            <div className="flex flex-col space-y-2">
                                <div className='relative'>
                                    <div className='p-1 rounded-xl border-gray-300 border h-[240px] overflow-hidden'>
                                        <img src={coverImgPreview || data.data.coverImg || DEFAULT_COVER_IMAGE} alt={data.data.title} className="w-full h-max rounded-lg object-cover" />
                                    </div>
                                    {/* Cover image upload */}
                                    <input type="file" accept='.jpg,.jpeg,.png'
                                        {...register("coverImg")}
                                        onChange={onCoverImgChange}
                                        className='file-input w-full max-w-xs mt-2'
                                    >
                                    </input>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label htmlFor='title'>Title</label>
                                <input type="text" defaultValue={data.data.title}
                                    className="form-field focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    {...register("title", { required: true })}
                                />
                                {errors.title && <span>This field is required</span>}
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label htmlFor='description'>Description</label>
                                <textarea rows={4} defaultValue={data.data.description} placeholder={data.data.description}
                                    className="resize-none form-field focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    {...register("description", { required: true })}
                                />
                                {errors.description && <span>This field is required</span>}
                            </div>

                            {/** Category Pills */}
                            <div className="flex flex-col space-y-2">
                                <label htmlFor='categories'>Categories</label>
                                <div className='flex flex-row space-x-2'>
                                    {course.categories.map((category: any, key: number) => <Pill category={category} key={key} />)}

                                    {/** Add new pill */}
                                    <span className="px-3 py-1 flex items-center text-base rounded-full border border-blue-500 hover:bg-blue-700 text-blue-500 shadow cursor-pointer">
                                        <span>Add</span>
                                        <button className="bg-transparent">
                                            <PlusIcon className='w-4 h-4 ml-2' />
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className='divider' />
                    </form>

                    {/** Course Sections area  */}
                    <div className='flex flex-col space-y-6 divide'>
                        <h1 className='text-xl font-medium'>Course Sections</h1>
                        <SectionForm />
                        <SectionList sections={data.data.sections} />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CourseEdit