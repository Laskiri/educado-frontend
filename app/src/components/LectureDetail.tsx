import { useState, } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

// Components
import AnswerCards from "../components/Exercise/AnswerCards";

// Interfaces
import { Answer } from "../interfaces/Answer";
import { Lecture } from "../interfaces/Lecture";

// Helpers
import LectureService from "../services/lecture.services";

// Pop-up messages
import { toast } from "react-toastify";

// Hooks
import useToken from "../hooks/useToken";

export interface LecturePartial {
    title: string,
    description: string,
    fileRef?: string
}


export const LectureDetail = ({ lecture, lid }: { lecture: Lecture, lid: string }) => {


    const { register, handleSubmit: handleExerciseSave, formState: { errors } } = useForm();
    const onExerciseSave: SubmitHandler<any> = data => updateLecture(data);

    /** Token doesnt work, reimplement when it token is implemented */
    //const token = useAuthStore(state => state.token);
    //const token = useToken();
    const token = "dummyToken";

    const updateLecture = (data: any) => {

        const lectureToSave: LecturePartial = {
            title: data.title,
            description: data.description,
            
        }

        

        // LectureService.updateLecture(lectureToSave, token, lid)
        //     .then(() => toast.success(`Successfully saved exercise`))
        //     .catch((e) => toast.error("Failed to save exercise due to error: " + e));

    }

/**
 * Delete exercise and reload page
 * Uses window.location.reload to refresh
 * 
 * @param lid The exercise id
 * @param token The user token
 */
const deleteLecture = async () => {
    // if (confirm("Você tem certeza?") == true) {
    //     const response = await LectureService.deleteLecture(lid, token);
    //     const status = response.status

    //     if (status >= 200 && status <= 299) {
    //         window.location.reload();
    //         toast.success("Exercise deleted")
    //     } else if (status >= 400 && status <= 599) {
    //         toast.error(`(${status}, ${response.statusText}) while attempting to delete exercise`)
    //     }
    // }
}

    return (

        <form onSubmit={handleExerciseSave(onExerciseSave)}
            className="flex flex-col space-y-6 divide py-2"
        >
            <div className=" rounded-md cursor-pointer p-2 focus:outline-none bg-base-100 border ">
                <div className="flex flex-col form-control align-items justify-content w-full">
                    <label className="label">
                        <span className="label-text">Exercise title</span>
                    </label>
                    <input
                        type="text"
                        defaultValue={lecture.title}
                        placeholder="Lecture title goes here"
                        className="input input-bordered w-full max-w-xs"
                        {...register("title", { required: true })}
                    />

                    <label className="label">
                        <span className="label-text">Exercise question</span>
                    </label>
                    <textarea
                        className="textarea textarea-bordered h-24"
                        defaultValue={lecture.description}
                        placeholder="Write the description for the lecture here"
                        {...register("description", { required: true })}
                    ></textarea>

                </div>
            </div>

            {/* divider */}
            <div className="flex flex-col w-full">
                <div className="divider"></div>
            </div>

            <div className="flex items-left w-full mt-8">
                {/** Exercise save and delete button */}
                <button type="button" onClick={deleteLecture} className='left-0 std-button bg-warning hover:bg-red-800' >Excluir exercício</button> {/** Delete exercise*/}
                <button type='submit' className="std-button ml-auto py-2 px-4">Salvar exercícios</button> {/** Save exercise */}
            </div>
        </form>

    );
};

export default LectureDetail;
