import { useState, ChangeEvent, FormEvent } from "react";
import { loginUser } from "../../utils/apiFunctions";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

interface LoginState {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [login, setLogin] = useState<LoginState>({
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();
  const redirectUrl = location.state?.path || "/";

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await loginUser(login);
    if (success) {
      const token = success.token;
      auth.handleLogin(token);
      navigate(redirectUrl, { replace: true });
    } else {
      setErrorMessage("Invalid username or password. Please try again.");
    }
    setTimeout(() => {
      setErrorMessage("");
    }, 4000);
  };

  return (
    // <section className="container pt-32 col-6 mt-5 mb-5">
    //   {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
    //   <h2>Login</h2>
    //   <form onSubmit={handleSubmit}>
    //     <div className="row mb-3">
    //       <label htmlFor="email" className="col-sm-2 col-form-label">
    //         Email
    //       </label>
    //       <div>
    //         <input
    //           id="email"
    //           name="email"
    //           type="email"
    //           className="form-control"
    //           value={login.email}
    //           onChange={handleInputChange}
    //         />
    //       </div>
    //     </div>

    //     <div className="row mb-3">
    //       <label htmlFor="password" className="col-sm-2 col-form-label">
    //         Password
    //       </label>
    //       <div>
    //         <input
    //           id="password"
    //           name="password"
    //           type="password"
    //           className="form-control"
    //           value={login.password}
    //           onChange={handleInputChange}
    //         />
    //       </div>
    //     </div>

    //     <div className="mb-3">
    //       <button type="submit" className="btn btn-hotel" style={{ marginRight: "10px" }}>
    //         Login
    //       </button>
    //       <span style={{ marginLeft: "10px" }}>
    //         Don't have an account yet?<Link to={"/register"}> Register</Link>
    //       </span>
    //     </div>
    //   </form>
    // </section>

    <section className="bg-gray-50 pt-12 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                  value={login.email}
                  onChange={handleInputChange}        
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={login.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                  </div>
                </div>
                {/* <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a> */}
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet? <Link to={"/register"} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
