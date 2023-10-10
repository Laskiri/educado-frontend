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
      <Link to="/" className="w-[10rem] h-6 justify-start items-center  inline-flex space-x-1 normal-case text-xl">
        <img src={logo} alt="logo" className="w-[1.5rem] h-6" /> <img src={educado} alt="educado" className="h-6" />
      </Link>
    </div>
  </nav>

  { /*Containers for the overall page*/ }
  <div className='w-full h-screen'>
    <div className='grid grid-cols-1 md:grid-cols-2 m-auto h-screen sm:max-w-956'> 
    
    <div className='relative w-full h-screen overflow-hidden'>
        <img src={background} alt="w-[42.375rem]" className='object-cover w-full h-full' />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Carousel/> { /*Carousel Integration*/ }
      </div>
    </div>
      
  <body> { /*Container for right side of the page*/ }
  <div className="relative w-[full/2] h-screen right-0">
    <img className="absolute top-[10rem] item-size" src={FrontLogo} alt="Front Logo" />
    <div className="w-[50rem] h-[60rem] px-20 rounded-sm flex-col justify-center items-center gap-20 inline-flex">
      <div className="flex justify-between items-center mb-6 space-x-16"></div>
      <div className="w-[6]"></div> {/* Add a 24px space between the buttons */}
  
      { /*Button for routing to the Login page*/ }
        <Link to="/login">
          <button
            type="submit"
            className="w-[16rem] h-[3rem] px-28 py-3 rounded-lg  bg-cyan-300 text-white transform translate-x-[-140px] translate-y-[-29px] transition duration-100 ease-in hover:bg-cyan-500 hover:text-gray-50 "
          >Entrar
          </button>
        </Link>

        { /*Button for routing to the Signup page*/ }
        <Link to="/Signup">
          <button
            type="submit"
            className="w-208px h-52px px-24 py-3 rounded-lg justify-center items-start gap-2 inline-flex mb-2 bg-cyan-300 text-white  transform translate-x-[140px] translate-y-[-157px] transition duration-100 ease-in hover:bg-cyan-500 hover:text-gray-50"
          >Cadastrar
          </button>
        </Link>

    </div>
    </div> 
  </body>
  </div>
</div>
 
</main>
)};

export default Welcome