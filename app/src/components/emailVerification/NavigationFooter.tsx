import { useContext, useState, useEffect } from "react";
import { FormDataContext } from "../../pages/Signup"; // Import the context
import AuthServices from "../../services/auth.services";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { LoginResponseError } from "../../interfaces/LoginResponseError";
import { ToggleModalContext } from "../../pages/Signup";
import { setUserInfo } from "../../helpers/userInfo";

type propsType = {
  codeVerified: boolean;
  token: string; // Add the token (code) prop
};

export default function NavigationFooter(props: propsType): JSX.Element {
  const { token, codeVerified } = props; // Destructure token from props
  const toggleModal = useContext(ToggleModalContext);
  const formData = useContext(FormDataContext); // Access form data from context
  const navigate = useNavigate();
  const [error, setError] = useState<LoginResponseError.RootObject | null>(
    null
  );
  const [cooldown, setCooldown] = useState(0); // Cooldown state for resend button

  const resendEmail = async () => {
    if (!formData) {
      console.error("Form data is not available");
      return;
    }

    if (cooldown === 0) {
      // Start cooldown
      setCooldown(30);
      console.log("Submitting formData from NavigationFooter:", formData);
      // Trigger resend email functionality
      await AuthServices.postUserSignup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        token: token,
        role: formData.role,
      });


    }
  };

  // Cooldown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      const timerId = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);

      // Clear interval when cooldown reaches 0
      return () => clearInterval(timerId);
    }
  }, [cooldown]);

  const onSubmit1 = async () => {
    if (!formData) {
      console.error("Form data is not available");
      return;
    }
    console.log("Submitting formData from NavigationFooter:", formData);

    // Show the email verification modal
    await AuthServices.postUserVerification({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      token: token,
      role: formData.role,
    })
      .then(() => {
        AuthServices.postUserLogin({
          isContentCreator: true,
          email: formData.email,
          password: formData.password,
        }).then((res) => {
          if (res.status === 200) {
            const id = res.data.baseUser;
            navigate(`/application/${id}`);
          }
          if (res.status === 202) {
            localStorage.setItem("token", res.data.accessToken);
            localStorage.setItem("id", res.data.userInfo.id);
            setUserInfo(res.data.userInfo);
            navigate("/courses");
          }
        });
      })
      .catch((err) => {
        console.log(err);
        setError(err);
        toast.error(err.response?.data.message);
      });
  };

  return (
    <div className="">
  <label>
    <button
      id="continue"
      onClick={onSubmit1} // Call onSubmit when clicked
      className="py-2 px-7 mt-8 bg-primary hover:bg-gray-100 border border-primary hover:text-primary text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:ring-offset-2 rounded"
    >
      {!props.codeVerified ? "Continuar" : "Redefinir senha"}{" "}
      {/* Continue or reset password */}
    </button>
  </label>

  <label className="flex flex-col items-center w-full mt-4">
    <p className="mb-2 text-sm text-gray-600">O código não chegou?</p>
  </label>

  <div className="flex justify-center w-full mt-2">
    <button
      id="resend-email"
      onClick={resendEmail} // Call resendEmail when clicked
      disabled={cooldown > 0} // Disable button during cooldown
      className={`py-1 px-4 bg-secondary text-primary rounded transition ease-in duration-200 text-sm font-medium shadow-xl border border-primary 
                  ${cooldown > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary hover:text-white hover:border-primary'}`}
    >
      {cooldown > 0 ? `Reenviar código em ${cooldown}s` : 'Reenviar código'}
    </button>
  </div>
</div>
  );
}
