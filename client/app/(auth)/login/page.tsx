import { LoginForm } from "@/components/forms/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
      <div className="min-h-[80vh] bg-gray-100 text-gray-900 flex justify-center">
        <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-1/2 p-6 sm:p-12">
            <div className="mt-12 flex flex-col items-center">
              <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Or{" "}
                  <Link
                    href="/register"
                    className="font-medium text-primary hover:text-primary/90"
                  >
                    create a new account
                  </Link>
                </p>
              </div>
            </div>
            <LoginForm />
            <div className="text-center">
            <Link
              href="/forgot-password"
              className="font-medium text-primary hover:text-primary/90"
            >
              Forgot your password?
            </Link>
          </div>
            

          </div>
          <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
            <div
              className=" w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('/auth.jpg')",
                backgroundSize: "cover",
              }}
            ></div>
          </div>
        </div>
      </div>
  );
}
