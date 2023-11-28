// SignupForm.tsx

// ... (import statements and other code)

const SignupForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<ApplicationInputs>({
      resolver: yupResolver(SignupSchema)
    });
  
    // ... (remaining form-related code)
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="stretch flex flex-col">

        <div className="flex">
    
          { /*FirstName Field*/ }
          <div className="relative flex-1">
          <label className="flex flex-start text-[#383838] text-sm font-normal gap-1 font-['Montserrat'] mt-5 after:content-['*'] after:ml-0.5 after:text-red-500 "htmlFor="firstNameField"> 
              Nome {/*Name*/}
          </label>
          <input onInput={areFieldsFilled}
            type="text" id="firstNameField"
            className="w-[95%] flex border-gray-300  py-3 px-4 bg-white placeholder-gray-400 text-lg text-[#383838]  focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
            placeholder="Nome"
            {...register("firstName", { required: "digite seu nome primeiro nome." })}/> { /*enter your first name*/ }
          </div>
          
          { /*Last Name Field*/ }
          <div className="relative flex-1 ml-2">
          <label className="flex flex-start text-[#383838] text-sm font-normal gap-1 font-['Montserrat'] mt-5 after:content-['*'] after:ml-0.5 after:text-red-500 "htmlFor="lastNameField"> 
          Sobrenome {/*Last Name*/}
          </label>
          <input onInput={areFieldsFilled}
            type="text" id="lastNameField"
            className="w-[100%] flex border-gray-300  py-3 px-4 bg-white placeholder-gray-400 text-lg text-[#383838] focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
            placeholder="Sobrenome"
            {...register("lastName", { required: "digite seu nome, sobrenome." })}/> { /*enter your last name*/ }
          </div>
    
        </div>
    
          { /*Email Field*/ }
          <div className="relative">
          <label className=" flex flex-start text-[#383838] text-sm font-normal gap-1 font-['Montserrat'] mt-5 after:content-['*'] after:ml-0.5 after:text-red-500 " htmlFor="usernameField">
            Email 
          </label>
          <input onInput={areFieldsFilled}
            type="email" id="emailField"
            className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
            placeholder="usuario@gmail.com"
            {...register("email", { required: " introduza o seu e-mail." })}/>
    
            {emailExistsError && (
            <div className="flex items-center font-normal font-['Montserrat']" role="alert">
              <Icon path={mdiAlertCircleOutline} size={0.6} color="red"/> 
              <p className='mt-1 ml-1 text-red-500 text-sm'>{emailExistsErrorMessage}</p>
            </div>
           )}
          </div>
    
          { /*Password Field*/ }
          <div className="relative">
          <label className=" flex flex-start text-[#383838] text-sm font-normal gap-1 font-['Montserrat'] mt-5 after:content-['*'] after:ml-0.5 after:text-red-500 " htmlFor="passwordField">
            Senha {/*Password*/}
          </label>
          <input onInput={areFieldsFilled}
              type={passwordVisible ? "text" : "password"} id="passwordField"
              className="w-[100%] hflex border-gray-300  py-3 px-4 bg-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
              placeholder="**********"
              {...register("password", { required: "insira a senha." })} onChange={handlePasswordChange}/>
          <button type="button" className="absolute right-3 bottom-3" onClick={togglePasswordVisibility} id="hidePasswordIcon">
            <Icon path={passwordVisible ? mdiEyeOutline : mdiEyeOffOutline} size={1} color="#A1ACB2" />
          </button>
          </div>
    
    
          { /*Password Checks*/ }
          <div className="px-3">
            <div className="items-stretch text-[#A1ACB2] text-sm font-normal font-['Montserrat'] mt-2">
              {passwordCheck1 ? (
                <Icon className=" left-20 float-left" path={mdiCheckBold} size={0.55} color=" green" />
              ) : null}
              &bull; Mínimo 8 caracteres {/*Minimum 8 characters*/}
            </div >
    
            <div className="text-[#A1ACB2] text-sm font-normal font-['Montserrat'] items-stretch">
              {passwordCheck2 ? (
                <Icon className="left-20 float-left" path={mdiCheckBold} size={0.55} color="green" />
              ) : null}
              &bull; Conter pelo menos uma letra {/*Contain at least one letter*/}
            </div>
          </div>
    
    
          { /*Confirm Password Field */ }
          <div className="relative">
          <label className=" flex flex-start text-[#383838] text-sm font-normal gap-1 font-['Montserrat'] mt-6 after:content-['*'] after:ml-0.5 after:text-red-500 " htmlFor="passwordFieldRepeat">
            Confirmar Senha {/*Confirm Password*/}
          </label>
          <input onInput={areFieldsFilled}
            type={passwordVisibleRepeat ? "text" : "password"} id="passwordFieldRepeat"
            placeholder="********** "
            className="w-[100%] flex border-gray-300 gap-2.5 py-3 px-4 bg-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
            {...register("confirmPassword", { required: "insira a senha." })}/>
          <button type="button" className="absolute right-3 bottom-3" onClick={togglePasswordVisibilityRepeat}>
            <Icon path={passwordVisibleRepeat ? mdiEyeOutline : mdiEyeOffOutline} size={1} color="#A1ACB2" />
          </button>
          </div>
          {passwordMismatchError && (
            <div className="flex items-center font-normal font-['Montserrat']" role="alert">
              <Icon path={mdiAlertCircleOutline} size={0.6} color="red"/> 
              <p className='mt-1 ml-1 text-red-500 text-sm'>{passwordMismatchErrorMessage}</p>
            </div>
           )}
          
            
          <span className="h-10" /> {/* spacing */}  
          
            { /*Enter button*/ }
            <button type="submit" id="submitSignupButton" className="disabled:opacity-20 disabled:bg-slate-600 flex-auto w-[100%] h-[3.3rem]  rounded-lg bg-[#166276] text-[#FFF] transition duration-100 ease-in hover:bg-cyan-900 hover:text-gray-50 text-lg font-bold font-['Montserrat']"
            disabled>
                Cadastrar {/*Register*/} 
            </button>
    
          <span className="h-2" /> {/* spacing */}  
          
            { /*Link to Login page*/ }
            <div className="flex justify-center space-x-1"> 
              <span className= "text-[#A1ACB2] text-lg font-normal font-['Montserrat']">Já possui conta? {/*Already have an account?*/}  </span> 
              <Link to="/login" className="text-[#383838] text-lg font-normal font-['Montserrat'] underline hover:text-blue-500 gap-6">Entre agora {/*Get in now*/} </Link>
            </div>
          </form>
    );
  };
  
  export default SignupForm;
  