import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthForm from "../components/AuthForm";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  // Redirect logged-in users to the dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard"); // Redirect to Dashboard if logged in
    }
  }, [user, navigate]);

  if (loading) return <div>Loading...</div>; // Prevents flicker before redirect

  return (
    <div className='min-h-screen flex items-center justify-center bg-white px-6'>
      <div className='w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-center'>
        <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold text-black'>
          HOIST
        </h1>

        <AuthForm />

        <div className='mt-4 text-sm text-gray-600'>
          <p className='mb-2'>
            <a href='/forgot-password' className='hover:underline'>
              Forgot Password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
