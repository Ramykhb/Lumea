import { Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";

const Signup = (props) => {
    return (
        <div className="w-full h-[100vh] flex justify-center items-center h-f bg-primary-light dark:bg-primary-dark">
            <div className="w-[80%] xs:w-[55%] sm:w-[45%] md:w-[35%] lg:w-[30%] xl:w-[25%]">
                <Link to={"/"}>
                    <img
                        src="/Lumea.png"
                        className="w-[40%] ml-[30%] block dark:hidden"
                        alt="Logo"
                    />
                    <img
                        src="/Lumea-dark.png"
                        className="hidden dark:block w-[40%] ml-[30%]"
                        alt="Logo"
                    />
                </Link>
                <AuthForm method="signup" onAuth={props.onAuth} />
            </div>
        </div>
    );
};

export default Signup;
