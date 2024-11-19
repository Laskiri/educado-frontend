import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dropzone } from "./Dropzone/Dropzone";
import { toast } from "react-toastify";
import RichTextEditor from "./RichTextEditor";

// Contexts
// import useAuthStore from '../../contexts/useAuthStore';
// Hooks
import { getUserToken } from "../helpers/userInfo";
import { useNotifications } from "./notification/NotificationContext";

import { useLectures, useMedia } from "@contexts/courseStore";

// Services
import StorageServices from "../services/storage.services";
import LectureService from "../services/lecture.services";

//components
import { ModalButtonCompont } from "./ModalButtonCompont";
import { Lecture } from "../interfaces/Course";
// Icons
import { Icon } from "@mdi/react";
import { mdiInformationSlabCircleOutline } from "@mdi/js";
import { get, update } from "cypress/types/lodash";

<Icon path={mdiInformationSlabCircleOutline} size={1} />;

type Inputs = {
  title: string;
  description: string;
  contentType: string;
  content: string;
};

interface Props {
  lecture : Lecture; // 
  handleEdit: Function;
}
/**
 * This component is a modal that opens when the user clicks on the button to create a new lecture.
 * It has a form to input the data of the new lecture.
 *
 * @returns HTML Element
 */
export const EditLecture = ({ lecture, handleEdit }: Props) => {
  const [lectureContent, setLectureContent] = useState(null);
  const { getMedia, updateMedia} = useMedia();
  const { updateCachedLecture } = useLectures();
  //TODO: When tokens are done, Remove dummy token and uncomment useToken
  const token = getUserToken();

  //const sid = window.location.pathname.split("/")[2];

  // use-form setup
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [contentType, setContentType] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { addNotification } = useNotifications();
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [lectureVideo, setLectureVideo] = useState<File | null>(null);
  console.log(lecture);
  const cachedVideo = getMedia(lecture._id);

  const toggler = (value: string) => {
    setContentType(value);
  };
  
  useEffect(() => {
    if (cachedVideo) {
      const fileSrc = URL.createObjectURL(cachedVideo);
      setPreviewFile(fileSrc);
    } else {
      const fetchPreview = async () => {
        const fileSrc = await getPreviewVideo();
        if (fileSrc !== null) {
          setPreviewFile(fileSrc);
        }
      };
      fetchPreview();
    }
  }, [lecture._id, lectureVideo]);

  const getPreviewVideo = async () => {
    const videoId = lecture._id + "_l"; // Assuming `data` is available here
    const fileSrc = await StorageServices.getMedia(videoId);
    const videoSrc = `data:video/mp4;base64,${fileSrc.split(',')[1]}`; //Quickfix - backend has to be adjusted to do this correctly, lasse don't @ me
    return videoSrc;
  };

  /**
   * Function to handle the submit of the form
   *
   * @param {Inputs} data The data from each field in the form put into an object
   */
  const onSubmit: SubmitHandler<Inputs> = async (newData) => {
    setIsSubmitting(true);
    const updatedLecture = {
      title: newData.title,
      description: newData.description,
      contentType: newData.contentType,
      content: newData.content,
      parentSection: lecture.parentSection,
      _id : lecture._id
    };
    updateCachedLecture(updatedLecture);
    
    if (lectureVideo !== null) {
      const newMedia = {
        id: lecture._id,
        file: lectureVideo,
        parentType: "l",
      }
      updateMedia(newMedia);
    }
    handleEdit(newData.title);
    addNotification("Aula atualizada com sucesso");
  };

  function returnFunction(lectureContent: any) {
    setLectureContent(lectureContent);
  }

  const [editorValue, setEditorValue] = useState<string>('');

// Initialize the editorValue with data.content if available (for editing)
useEffect(() => {
  if (lecture?.content) {
    setEditorValue(lecture.content);
    setValue('content', lecture.content);  // Initialize form value as well
  }
}, [lecture, setValue]);

const handleEditorChange = (value: string) => {
  setEditorValue(value); // Update local state
  setValue('content', value); // Manually set form value
  lecture.content = value;
};

  return (
    <>
      {/*Text shown in the top of create lecture*/}
      <div
        className="modal"
        id={`lecture-edit-${lecture ? lecture._id : "new"}-modal`}
      >
        <div className="modal-box bg-gradient-to-b from-primaryLight rounded w-11/12 max-w-xl">
          <h3 className="font-bold text-lg">Crie sua nova aula</h3>{" "}
          {/*Create your new lecture!*/}
          <p className="py-4">
            Preencha o formulário e inicie sua nova aula!
          </p>{" "}
          {/*Fill out the form and start your new lecture!*/}
          {/*Field to input the title of the new lecture*/}
          <form
            className="flex h-full flex-col justify-between space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col space-y-2 text-left">
              <label htmlFor="title">Título</label> {/*Title*/}
              <input
                type="text"
                placeholder={"Insira o título da aula"}
                defaultValue={lecture ? lecture.title : ""}
                className="form-field focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                {...register("title", { required: true })}
              />
              {errors.title && (
                <span className="text-warning">Este campo é obrigatório</span>
              )}
            </div>
            {/*Field to input the description of the lecture*/}
            <div className="flex flex-col space-y-2 text-left">
              <label htmlFor="description">Descrição</label> {/*Description*/}
              <textarea
                rows={4}
                placeholder={"Insira o conteúdo escrito dessa aula"}
                defaultValue={lecture ? lecture.description : ""}
                className="resize-none form-field focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                {...register("description", { required: true })}
              />
              {/*defaultValue=Add a description to your lecture*/}
              {errors.description && (
                <span className="text-warning">Este campo é obrigatório</span>
              )}
            </div>
            <label htmlFor="content-type">Tipo de conteúdo</label>{" "}
            {/*Content type*/}
            <div className="flex flex-row space-x-8">
              <div>
                <label htmlFor="radio1">
                  <input
                    type="radio"
                    className="mr-2"
                    id="radio1"
                    value="video"
                    checked={
                      (lecture?.contentType === "video" && contentType === "") ||
                      contentType === "video"
                        ? true
                        : false
                    }
                    {...register("contentType", { required: true })}
                    onChange={(e) => {
                      toggler(e.target.value);
                    }}
                  />
                  Video
                </label>
              </div>

              <div>
                <label htmlFor="radio2" className="space-x-2">
                  <input
                    type="radio"
                    className="mr-2"
                    id="radio2"
                    value="text"
                    checked={
                      (lecture?.contentType === "text" && contentType === "") ||
                      contentType === "text"
                        ? true
                        : false
                    }
                    {...register("contentType", { required: true })}
                    onChange={(e) => {
                      toggler(e.target.value);
                    }}
                  />
                  Texto Estilizado
                </label>
              </div>

              {errors.contentType && (
                <span className="text-warning">Este campo é obrigatório</span>
              )}
            </div>
            {/*One day this will be file*/}
            <div className="flex flex-col space-y-2 text-left">
              {(lecture?.contentType === "video" && contentType === "") ||
              contentType === "video" ? (
                <>
                  <label htmlFor="cover-image">
                    Arquivo de entrada: vídeo ou imagem
                  </label>{" "}
                  {/*Input file*/}
                  <Dropzone inputType="video" id={lecture._id} previewFile={previewFile} onFileChange={setLectureVideo}></Dropzone>
                </>
              ) : (lecture?.contentType === "text" && contentType === "") ||
                contentType === "text" ? (
                <>
                  <label htmlFor="content">Formate o seu texto abaixo</label>
                  <RichTextEditor 
                    value={editorValue}  // Use the local editorValue for the content
                    onChange={handleEditorChange} 
                  />

                </>
              ) : (
                <p></p>
              )}
              {/* {errors.description && <span className='text-warning'>Este campo é obrigatório</span>}*/}
            </div>
            {/*Create and cancel buttons*/}
            <ModalButtonCompont
              type="edit"
              isSubmitting={isSubmitting}
              typeButtons={`lecture-edit-${lecture._id}`}
            />
          </form>
        </div>
      </div>
    </>
  );
};
