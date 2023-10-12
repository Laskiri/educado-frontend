import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom"

import FrontLogo from "../assets/WelEdnew.png"
import logo from "../assets/logo.png"
import educado from "../assets/educado.png"
import background from "../assets/background.jpg"
import Carousel from "../components/archive/Carousel";




const Welcome = () => {

    const responseGoogle = (response: any) => {
        // Handle the response here (e.g., send it to your backend for verification)
        console.log(response);
      };


return (
  <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#c8e5ec] to-[white] overflow-hidden">
    
    { /*Navbar*/ }
    <nav className="navbar bg-base-100 border-b shadow fixed top-0 z-10">
      <div className="navbar-start">
        <Link to="/" className="w-[165.25px] h-6 justify-start items-center  inline-flex space-x-1 normal-case text-xl">
          <img src={logo} alt="logo" className="w-[24.43px] h-6" /> 
          <img src={educado} alt="educado" className="h-6" />
        </Link>
      </div>
    </nav>

    { /*Containers for the overall page*/ }
    <body className='w-full h-screen'>
      <div className='grid grid-cols-1 md:grid-cols-2 m-auto h-screen sm:max-w-956'> 
        <div className='relative w-full h-screen overflow-hidden'>
          <img src={background} alt="w-[42.375rem]" className='object-cover w-full h-full' />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Carousel/> { /*Carousel Integration*/ }
          </div>
        </div>

        { /*Container for right side of the page*/ }
        <div className="relative h-screen right-0 h-screen flex flex-col justify-center items-center">
          <img className="relative absolute top-[35%] w-[22rem]" src={FrontLogo} alt="Front Logo" />
          
          { /*Container for the buttons*/ }
          <div className="relative flex gap-5 px-[10%] flex-row items-center justify-center h-screen">
            
          { /*Button for routing to the Login page*/ }
            <Link className="flex-auto w-[15rem] h-[3.5rem] items-center justify-center rounded-lg bg-cyan-300 inline-flex text-white transform transition duration-100 ease-in hover:bg-cyan-500 hover:text-gray-50"
              to="/login">
              <button
                type="submit"
                >Entrar
              </button>
            </Link>
            
            { /*Button for routing to the Signup page*/ }
            <Link className="flex-auto w-[15rem] h-[3.5rem] items-center justify-center rounded-lg bg-cyan-300 inline-flex text-white transform transition duration-100 ease-in hover:bg-cyan-500 hover:text-gray-50"
              to="/Signup">
              <button
                type="submit"
                >Cadastrar
              </button>
            </Link>
          </div>
          </div>
        </div>
    </body>
  </main>
    )
}

export default Welcome