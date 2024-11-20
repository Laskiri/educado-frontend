import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { useNotifications } from "../notification/NotificationContext";
import { useCourse, useMedia } from '../../contexts/courseStore';
// Services
import CourseServices from "../../services/course.services";
import StorageServices from "../../services/storage.services";
import {useApi} from "../../hooks/useAPI";
// Helpers
import { getUserInfo } from "../../helpers/userInfo";
import categories from "../../helpers/courseCategories";
import { convertSrcToFile } from "@helpers/fileHelpers";


// Components
import { Dropzone } from "../Dropzone/Dropzone";
import { ToolTipIcon } from "../ToolTip/ToolTipIcon";
import Loading from "../general/Loading";
import Layout from "../Layout";
import GenericModalComponent from "../GenericModalComponent";
// Interface
import { Course } from "../../interfaces/Course";
import CourseGuideButton from "./GuideToCreatingCourse";

interface CourseComponentProps {
  token: string;
  id: string;
  setTickChange: (tick: number) => void;
  setId: (id: string) => void;
  updateHighestTick: (tick: number) => void;
}




/**
 * This component is responsible for creating and editing courses.
 *
 * @param token The user token
 * @param id The course id
 * @returns HTML Element
 */

export const CourseComponent = ({ token, id, setTickChange, setId, updateHighestTick }: CourseComponentProps) => {
  const {course, updateCourse, getFormattedCourse } = useCourse();
  const { addMediaToCache, updateMedia, getMedia } = useMedia();
  const [categoriesOptions, setCategoriesOptions] = useState<JSX.Element[]>([]);
  const [statusSTR, setStatusSTR] = useState<string>("draft");
  const [toolTipIndex, setToolTipIndex] = useState<number>(4);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [dialogConfirm, setDialogConfirm] = useState<() => void>(() => {});
  const [cancelBtnText] = useState("Cancelar");
  const [confirmBtnText] = useState("Confirmar");
  const [dialogTitle, setDialogTitle] = useState("Cancelar alterações");
  

  const [charCount, setCharCount] = useState<number>(0);
  const [isLeaving, setIsLeaving] = useState<boolean>(false);

  

  const courseImg = getMedia(id);
  const previewCourseImg = courseImg ? URL.createObjectURL(courseImg) : null;

  // Callbacks
  const { call: fetchCoverImg} = useApi(StorageServices.getMedia);
  const { call: createCourse, isLoading: submitLoading} = useApi(CourseServices.createCourse);




  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Course>();

  // Notification
  const { addNotification } = useNotifications();

  const existingCourse = id != "0";
  const courseCached = Object.keys(course).length > 0;
  const navigate = useNavigate();


     /**
     * Extra function to handle the response from the course service before it is passed to the useSWR hook
     * 
     * @param url The url to fetch the course details from backend
     * @param token The user token
     * @returns The course details
     */
     useEffect(() => {
      if (courseImg || !existingCourse) return;
  
      const fetchPreview = async () => {
        const courseImgId = id + "_c";
        const fileSrc = await fetchCoverImg(courseImgId);
        const validFileSrc = fileSrc !== null && fileSrc !== undefined;
        if (validFileSrc) {
          const file = await convertSrcToFile(fileSrc, `${id}_c`);
          addMediaToCache({ id: id, file: file, parentType: "c" });
        }
      };
      fetchPreview(); 
    }, [id]);
  

  useEffect(() => {
    //TODO: get categories from db
    const inputArray = [
      "personal finance",
      "health and workplace safety",
      "sewing",
      "electronics",
    ];
    setCategoriesOptions(
      inputArray.map((categoryENG: string, key: number) => (
        <option value={categoryENG} key={key}>
          {categories[inputArray[key]]?.br}
        </option>
      ))
    );
  }, []);

  useEffect(() => {
    if (courseCached) {
      console.log("Course cached", course);
      setStatusSTR(course.status);
      setCharCount(course.description.length);
    }
  }, [course]);

  const formatCourse = (course: Partial<Course>): Course => {
    return {
      title: course.title ?? '',
      description: course.description ?? '',
      category: course.category ?? '',
      difficulty: course.difficulty ?? 0,
      status: course.status ?? 'draft',
      creator: course.creator ?? '',
      estimatedHours: course.estimatedHours ?? 0,
      coverImg: course.coverImg ?? '',
    };
  };

  //Used to format PARTIAL course data, meaning that it can be used to update the course data gradually
  const handleFieldChange = (field: keyof Course, value: string | number | File | null) => {
    const updatedData = { ...course, [field]: value };
    updateCourse(formatCourse(updatedData));
  };
  const handleDialogEvent = (
    message: string,
    onConfirm: () => void,
    dialogTitle: string
  ) => {
    setDialogTitle(dialogTitle);
    setDialogMessage(message);
    setDialogConfirm(() => onConfirm);
    setShowDialog(true);
  };

  const handleImageUpload = (file: File | null) => {
    console.log("file", file);
    if (!file) return;
    const newMedia = { id: id, file: file, parentType: "c" };
    if (!courseImg) {
      console.log("adding media");
      addMediaToCache(newMedia);
    }
    else {
      console.log("updating media");
      updateMedia(newMedia);
    }
  }


  // Updates existing draft of course and navigates to course list
  const handleSaveExistingDraft = async (changes: Course) => {
    try {
      const newCourse = getFormattedCourse();
      // Do somethign with Formated Course


      //Upload image with the old id
      navigate("/courses");
      addNotification("Seções salvas com sucesso!");
    } catch (err) {
      toast.error(err as string);

    }
  };

  // Creates new draft course and navigates to course list
  const handleCreateNewDraft = async (course: Course) => {
    try {
      const newCourse = getFormattedCourse();
      console.log("new course", newCourse);

      const res = await createCourse(newCourse, token);
      console.log(res);
      //Upload image with the new id

      navigate("/courses");
      addNotification("Seção deletada com sucesso!");
    } catch (err) {
      toast.error(err as string);
    }
  }

  // Creates new course and navigates to section creation for it
  const handleCreateNewCourse = async (course: Course) => {
    try {
      const newCourse = getFormattedCourse();
      // call some service or something with the new formatted course
      setTickChange(1);
      updateHighestTick(1);
      navigate(`/courses/manager/${newCourse.courseInfo._id}/1`);
    } catch (err) {
      toast.error(err as string);
    }
  };

  //Used to prepare the course changes before sending it to the backend
  const prepareCourseChanges = (course: Course): Course => {
    return {
      title: course.title,
      description: course.description,
      category: course.category,
      difficulty: course.difficulty,
      status: statusSTR,
      creator: getUserInfo().id,
      estimatedHours: course.estimatedHours,
      coverImg: id + "_" + "c",
    };
  }

  const onSubmit: SubmitHandler<Course> = (course) => {
    const changes = prepareCourseChanges(course);
    if (isLeaving) {
      
      // left button pressed
      // StorageService.deleteFile(id, token);
  
      // Update course details
      // When the user press the button to the right, the tick changes and it goes to the next component
      // When the user press the draft button, it saves as a draft and goes back to the course list
      if (existingCourse && statusSTR === "draft") {
        handleDialogEvent(
          "Você tem certeza de que quer salvar como rascunho as alterações feitas?",
          handleSaveExistingDraft.bind(this, changes),
          "Salvar como rascunho "
        );
      } else if (!existingCourse && statusSTR === "draft") {
        handleDialogEvent(
          "Você tem certeza de que quer salvar como rascunho as alterações feitas?",
          handleCreateNewDraft.bind(this, changes),
          "Salvar como rascunho "
        );
      }
      setIsLeaving(false);
    } else {
      updateCourse(changes);
      // right button pressed
      // Creates new course and navigates to section creation for it
      if (!existingCourse) {
        handleCreateNewCourse(changes);
      } else {
        // navigates to section creation for existing course
        setTickChange(1);
        navigate(`/courses/manager/${id}/1`);
      }
    }
  };

  if (Object.keys(course).length === 0  && existingCourse)
    return (
      <Layout meta="course overview">
        <Loading />
      </Layout>
    ); // Loading course details


  return (
    <div>
      <GenericModalComponent
        title={dialogTitle}
        contentText={dialogMessage}
        cancelBtnText={cancelBtnText}
        confirmBtnText={confirmBtnText}
        isVisible={showDialog}
        onConfirm={async () => {
          await dialogConfirm();
        }}
        onClose={() => {
          setShowDialog(false);
        }} 
      />
      <div className="w-full flex flex-row items-center justify-between py-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold"> Informações gerais </h1>
          <ToolTipIcon
          alignLeftTop={false}
          index={0}
            toolTipIndex={toolTipIndex}
            text={
              "👩🏻‍🏫Nossos cursos são separados em seções e você pode adicionar quantas quiser!"
            }
            tooltipAmount={2}
            callBack={setToolTipIndex}
          />
        </div>
        <CourseGuideButton />
      </div>

      {/*Field to input the title of the new course*/}
      <form
        className="flex h-full flex-col justify-between space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/*White bagground*/}
        <div className="w-full float-right bg-white rounded-lg shadow-lg justify-between space-y-4 p-10">
          <div className="flex flex-col space-y-2 text-left">
            <label htmlFor="title">Nome do curso <span className="text-red-500">*</span></label> {/*Title*/}
            <input
              id="title-field"
              type="text"
              defaultValue={course.title}
              placeholder={course.title}
              className="form-field  bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              {...register("title", { required: true })}
              onChange={(e) => handleFieldChange('title', e.target.value)}
            />
            {errors.title && (
              <span className="text-warning">Este campo é obrigatório</span>
            )}{" "}
            {/** This field is required */}
          </div>

          <div className="flex items-center gap-8 w-full mt-8">
            {/*Field to select a level from a list of options*/}
            <div className="flex flex-col w-1/2 space-y-2 text-left  ">
            <label htmlFor='level'> Nível <span className="text-red-500">*</span></label> {/*asteric should not be hard coded*/}
              <select id="difficulty-field" 
              defaultValue={course.difficulty}
              className="bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              {...register("difficulty", { required: true })}
              onChange={(e) => handleFieldChange('difficulty', parseInt(e.target.value))}
              >
                {/*Hard coded options by PO, should be changed to get from db*/}
                <option value=""disabled> Selecione o nível</option>
                <option value={1}>Iniciante</option> {/** Beginner */}
                <option value={2}>Intermediário</option> {/** Intermediate */}
                <option value={3}>Avançado</option> {/** Advanced */}
              </select>
              <span className='text-warning min-h-[24px]'>{errors.difficulty ? 'Este campo é obrigatório': ''}</span>
            </div>

            {/*Field to choose a category from a list of options*/}
            <div className="flex flex-col w-1/2 space-y-2 text-left  ">
              <label htmlFor='category'>Categoria <span className="text-red-500">*</span></label> 
              <select id="category-field"
                defaultValue={course.category}
                className="bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                {...register("category", { required: true })}
                onChange={(e) => handleFieldChange('category', e.target.value)}
              >
                {/*Hard coded options by PO, should be changed to get from db*/}
                <option value="" disabled> Selecione a categoria</option>,
                {categoriesOptions}

              </select>
              <span className='text-warning min-h-[24px]'>{errors.category ? 'Este campo é obrigatório': "               "}</span>
            </div>
          </div>

          {/*Field to input the description of the course*/}
          <div className="flex flex-col space-y-2 ">
            <div className="flex items-center space-x-2"> {/* Container for label and icon */}
              <label className='text-left' htmlFor='description'>Descrição <span className="text-red-500">*</span> </label> {/** Description */} 
              <ToolTipIcon alignLeftTop={false} index={1} toolTipIndex={toolTipIndex} text={"😉 Dica: insira uma descrição que desperte a curiosidade e o interesse dos alunos"} tooltipAmount={2} callBack={setToolTipIndex}/>
            </div>
            <textarea id="description-field" maxLength={400} rows={4}
            defaultValue={course.description}
            placeholder={course.description}
            className="resize-none form-field focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-secondary"
            {...register("description", { required: true })}
            onChange={(e) => {
              setCharCount(e.target.value.length);
              handleFieldChange('description', e.target.value);
            }}
            />
            {errors.description && (
              <span className="text-warning">Este campo é obrigatório</span>
            )}{" "}
            {/** This field is required */}
            <div className="text-right">
              <label htmlFor="">{charCount}/400</label>
            </div>
          </div>

          <div>
            {/*Cover image field*/}
            <div className="flex flex-col space-y-2 text-left">
              <label htmlFor='cover-image'>Imagem de capa <span className="text-red-500">*</span></label> {/** Cover image */} 
            </div>
              <Dropzone inputType='image' id={id ?? "0"} previewFile={previewCourseImg} onFileChange={handleImageUpload} />
            {errors.description && <span className='text-warning'>Este campo é obrigatório</span>} {/** This field is required */}
          </div>
        </div>
        {/*Create and cancel buttons*/}
        <div className="modal-action pb-10">
          <div className="whitespace-nowrap flex items-center justify-between w-full mt-8">
            <label
              onClick={() => {
                navigate("/courses");
              }}
              htmlFor="course-create"
              className="cursor-pointer underline py-2 pr-4 bg-transparent hover:bg-warning-100 text-warning w-full transition ease-in duration-200 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2  rounded"
            >
              Cancelar e Voltar {/** Cancel */}
            </label>

            <label
              htmlFor="course-create"
              className={` ${
                statusSTR === "published" ? "invisible pointer-events-none" : ""
              } whitespace-nowrap ml-42 underline py-2 px-4 bg-transparent hover:bg-primary-100 text-primary w-full transition ease-in duration-200 text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2  rounded`}
            >
              <button
                id="SaveAsDraft"
                onClick={() => setIsLeaving(true)}
                type="submit"
                className="underline"
              >
                Salvar como Rascunho {/** Save as draft */}
              </button>
            </label>

            <label
          htmlFor="course-create"
          className="whitespace-nowrap h-12 p-2 bg-primary hover:bg-primary focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
        >
          <button
            type="submit"
            id="addCourse"
            disabled={submitLoading}
            className="flex items-center justify-center py-4 px-8 h-full w-full cursor-pointer"
          >
            {submitLoading ? (
              <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-t-transparent rounded-full mr-2"></span>
            ) : null}
            Adicionar seções
          </button>
        </label>
          </div>
        </div>
      </form>
    </div>
  );
};
