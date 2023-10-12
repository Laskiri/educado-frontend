import { useForm } from "react-hook-form";
import { useNavigate, Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react' ;
import * as Yup from 'yup';
import Icon from '@mdi/react';
import { mdiEyeOffOutline, mdiEyeOutline, mdiChevronLeft, mdiCheckboxOutline, mdiCheckboxBlankOutline} from '@mdi/js';
import educado from "../assets/educado.png"
import background from "../assets/background.jpg"
import logo from "../assets/logo.png"
import Carousel from "../components/archive/Carousel";


// services
import AuthServices from '../services/auth.services'

// Form input interface
interface ApplicationInputs {
  name: String,
  email: String, 
  password: String,
  confirmPassword: String,
}

// Yup schema for fields
const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .required("Your full name is Required!"),
  password: Yup.string()
    .min(8, 'Too Short!')
    .required("Password is not long enough"),
  confirmPassword:  Yup.string().oneOf([Yup.ref('password'), null], "Ss senhas não coincidem"),
  
  email: Yup.string()
    .email('Invalid email format').required('Required'),
});

const Signup = () => {

  // Navigation hook
  let navigate = useNavigate(); 

  // Use-form setup
  const { register, handleSubmit, formState: { errors } } = useForm<ApplicationInputs>({
    resolver: yupResolver(SignupSchema)
  });

  
  // Function for success on form-submit, i.e. the function to be executed upon recieving new credentials
  const onSubmit = async (data: any) => {
    await AuthServices.postUserSignup({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    navigate('/login')

  };

  // Variables determining whether or not the password is visible
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  }
  const [passwordVisibleRepeat, setPasswordVisibleRepeat] = useState(false);
  const togglePasswordVisibilityRepeat = () => {
    setPasswordVisibleRepeat(!passwordVisibleRepeat)
  }
  const [passwordCheck1, setPasswordCheck1] = useState(false);
  const togglepasswordCheck1 = () => {
    setPasswordCheck1(!passwordCheck1);
  } 
  
return (
<main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#c8e5ec] to-[white] overflow-hidden">

  { /*Navbar*/ }
  <nav className="navbar bg-base-100 border-b shadow fixed top-0 z-10">
    <div className="navbar-start">
      <Link to="/" className="w-[165.25px] h-6 justify-start items-center  inline-flex space-x-1 normal-case text-xl">
        <img src={logo} alt="logo" className="w-[24.43px] h-6" /> <img src={educado} alt="educado" className="h-6" />
      </Link>
    </div>
  </nav>

  { /*Container for entire page*/ }
  <body className='w-screen h-screen overflow-hidden'>
    <div className='grid grid-cols-2 md:grid-cols'>

    { /*Container for left half of the page*/ }
      <div className='relative w-full h-screen overflow-hidden'>
        <img src={background} alt="w-[42.375rem]" className='object-cover w-full h-full' />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Carousel/> { /*Carousel integration*/ }
        </div>
      </div>

      { /*Container for right side of the page*/ }
      <div className=" relative flex flex-col items-start py-16 px-0 ">
        <div className=" flex flex-col">
          <div className=" absolute flex text-center text-base text-gray-500 font-normal font-Montserrat underline m-6">
            <Link to="/welcome">
              <Icon path={mdiChevronLeft} size={1} color="gray" />
            </Link>
            <Link to="/welcome" className="flex flex-col justify-between text-base text-gray-500 font-normal font-Montserrat underline">
              Voltar
            </Link>
          </div>
      </div>

      { /*Title*/ }
      <div className='self-stretch flex flex-col justify-center flex-1'>
        <div className="w-[48rem] self-stretch flex flex-col items-start justify-center flex-1 py-[4rem] px-[5rem]">
          <h1 className="text-neutral-700 text-[2rem] font-bold font-['Lato'] leading-normal">
            Crie a sua conta gratuitamente!
          </h1>

      { /*Submit form, i.e. fields to write name, email, and password*/ }
      <form onSubmit={handleSubmit(onSubmit)} className="stretch flex flex-col">

        { /*Name Field*/ }
        <label className="stretch flex flex-start text-neutral-700 text-x font-normal gap-[4] font-['Montserrat'] mt-6"htmlFor="usernameField"> 
            Nome <span className=" text-red-500 text-xs font-normal font-montserrat">*</span>
        </label>
        <input
          type="text" id="usernameField"
          className="w-[38rem] h-[2.6rem] rounded border flex border-gray-300 gap-2.5 py-3 px-4 bg-white placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-cyan-300   focus:border-transparent"
          placeholder="Nome Sobrenome"
          {...register("name", { required: "digite seu nome completo." })}/>
          
        { /*Email Field*/ }
        <label className="stretch flex flex-start text-neutral-700 text-x font-normal gap-[4] font-['Montserrat'] mt-6" htmlFor="usernameField">
          Email  
          <span className="text-red-500 text-xs font-normal font-montserrat">*</span>
        </label>
        <input
          type="email" id="emailField"
          className="w-[38rem] h-[2.6rem] rounded border flex border-gray-300 gap-2.5 py-3 px-4 bg-white placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-cyan-300   focus:border-transparent"
          placeholder="User@email.com"
          {...register("email", { required: " introduza o seu e-mail." })}/>

        { /*Password Field*/ }
        <div className="relative">
        <label className="stretch flex flex-start text-neutral-700 text-x font-normal gap-[4]  font-['Montserrat'] mt-6" htmlFor="passwordField">
          Senha   
          <span className=" text-red-500 text-xs font-normal font-montserrat">*</span>
        </label>
        <input
            type={passwordVisible ? "text" : "password"} id="passwordField"
            className="w-[38rem] h-[2.6rem] rounded border flex border-gray-300 gap-2.5 py-3 px-4 bg-white placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-cyan-300   focus:border-transparent"
            placeholder="**********"
            {...register("password", { required: "insira a senha." })}/>
        <button type="button" className="absolute right-3 bottom-2.5" onClick={togglePasswordVisibility}>
          <Icon path={passwordVisible ? mdiEyeOutline : mdiEyeOffOutline} size={0.9} color="gray" />
        </button>
        </div>

        { /*Password Checks*/ }
        <div className="px-3 flex-col gap-0.5 flex">
          <div className=" gap-0.5 inline-flex">
            <div className="text-gray-400 text-xs font-normal font-['Montserrat'] mt-2">
            <Icon className="absolute left-20" path={passwordCheck1 ? mdiCheckboxBlankOutline : mdiCheckboxOutline} size={0.55} color="gray" />
             Mínimo 8 caracteres
            </div>
         </div>
        <div className=" gap-0.5 inline-flex">
            <div className="text-gray-400 text-xs font-normal font-['Montserrat'] ">
            <Icon className="absolute left-20" path={1 ? mdiCheckboxBlankOutline : mdiCheckboxOutline} size={0.55} color="gray" />
              Conter pelo menos uma letra
            </div>
          </div>
        </div>
      
        { /*Confirm Password Field */ }
        <div className="relative">
        <label className="flex flex-start text-neutral-700 text-x font-normal gap-[4] font-['Montserrat'] mt-6 z-10" htmlFor="passwordFieldRepeat">
          Confirmar Senha 
          <span className="text-red-500 text-xs font-normal font-montserrat">*</span>
        </label>
        <input
          type={passwordVisibleRepeat ? "text" : "password"} id="passwordFieldRepeat"
          placeholder="********** "
          className="w-[38rem] h-[2.6rem] rounded border flex border-gray-300 gap-2.5 py-3 px-4 bg-white placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-cyan-300   focus:border-transparent"
          {...register("confirmPassword", { required: "insira a senha." })}/>
        <button type="button" className="absolute right-3 bottom-2.5" onClick={togglePasswordVisibilityRepeat}>
          <Icon path={passwordVisibleRepeat ? mdiEyeOutline : mdiEyeOffOutline} size={0.9} color="gray" />
        </button>
        </div>
      <span className="h-5" /> {/* spacing */}  
      
        { /*Enter button*/ }
        <button type="submit" className="py-4 rounded-lg bg-cyan-300 text-white opacity-100 transition duration-100 ease-in hover:bg-cyan-500 hover:text-gray-50">
            Entrar
        </button>
        { /*Link to Login page*/ }
        <div className="flex justify-center self-stretch mt-[1rem]"> 
          <span className= "text-gray-400 text-base font-normal font-Montserrat">Já possui conta? </span> 
          <Link to="/login" className="text-neutral-700 text-base font-normal font-Montserrat underline hover:text-blue-500 gap-6">Entre agora</Link>
        </div>
      </form>
    </div>
  </div>
</div>
</div>

</body>
</main>
)};

export default Signup;