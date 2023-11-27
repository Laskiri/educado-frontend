import { useState, } from "react";
import { useForm, SubmitHandler } from "react-hook-form";


// Icons
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';


// Components
import AnswerCards from "../../components/Exercise/AnswerCards";
import{ CreateButtonCompont } from "../CreateButtonCompont";

// Interfaces
import { Answer } from "../../interfaces/Answer";
import { Exercise } from "../../interfaces/Exercise"

// Helpers
import ExerciseServices from "../../services/exercise.services";

// Pop-up messages
import { toast } from "react-toastify";


export interface ExercisePartial {
    title: string,
    question: string,
    answers: Answer[]
}

type Inputs = {
    sid: string|undefined;
};


export const CreateExercise = ({sid}:Inputs) => {

    let TempAnswers = [{text: "", correct: true, feedback: ""}, {text: "", correct: false, feedback: ""}];

    const [answers, setAnswers] = useState<Answer[]>(TempAnswers);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


    const { register, handleSubmit: handleExerciseSave, formState: { errors } } = useForm();
    
    const onExerciseSave: SubmitHandler<any> = data => createExercise(data);


    /** Token doesnt work, reimplement when it token is implemented */
    //const token = useAuthStore(state => state.token);
    //const token = useToken();
    const token = "dummyToken";

    const createExercise = (data: any) => {

        setIsSubmitting(true);
        const exerciseToSave: ExercisePartial = {
            title: data.title,
            question: data.question,
            answers: answers
        }
        


        ExerciseServices.addExercise(exerciseToSave, token, sid)
            .then(() => {toast.success(`Exercício criado com sucesso`); window.location.reload();}) /** Successfully created exercise */
            .catch(err => {toast.error("Fracassado: " + err); setIsSubmitting(false);})
    }

    return (

        <div>
            {/** The button to open create exercise modal */}
            <label htmlFor="exercise-create" className="btn std-btn bg-inherit hover:bg-transparent border border-transparent  rounded-lg flex justify-right space-x-2  mb-5">
            <Icon path={mdiPlus} size={1} className="hover:text-gray-500 text-gray-500 " />
                <p className='hover:text-gray-500 text-gray-500 normal-case' >Criar novo exercício</p>  {/** Create new Exercise */}
            </label>

            <input type="checkbox" id="exercise-create" className="modal-toggle" />
            <div className="modal" id="exercise-create-modal">
                <div className="bg-white bg-gradient-to-b rounded w-3/8 h-5/6">
                    <div className="p-5 bg-gradient-to-b from-primaryLight overflow-auto h-full">
                        <form onSubmit={handleExerciseSave(onExerciseSave)}
                        className="flex flex-col space-y-6 divide py-2">
                            <div className="rounded-md cursor-pointer p-2 focus:outline-none bg-base-100 border">
                                <div className="flex flex-col form-control align-items justify-content w-full">
                                    <label className="label">
                                        <span className="label-text">Título</span> {/*Title*/}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Adicione um título a este exercício" /*Add a title to this exercise*/
                                        className="input input-bordered w-full max-w-xs"
                                        {...register("title", { required: true })}
                                    />

                                    <label className="label">
                                        <span className="label-text">Pergunta</span> {/*Question*/}
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered h-24"
                                        placeholder="Adicione uma pergunta a este exercício" /*Add a question to this exercise*/
                                        {...register("question", { required: true })}
                                    ></textarea>

                                </div>
                            </div>

                            {/* divider */}
                            <div className="flex flex-col w-full">
                                <div className="divider"></div>
                            </div>

                            {/* Answers. Answers sometimes doesn't get loaded hence the conditional rendering ... */}
                            {answers ?
                                <div className="rounded-md cursor-pointer p-2 focus:outline-none bg-base-100 border ">
                                    <h1 className='text-md font-medium'>Resposta</h1>  {/** Answer */}
                                {   <AnswerCards update={setAnswers} initialAnswers={answers} />}
                                </div>
                                :
                                <p>Carregando ...</p>  /** Loading ... */
                            }
                            {/*Create and cancel buttons*/}
                            <CreateButtonCompont isSubmitting={isSubmitting}/>
                            
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
};
