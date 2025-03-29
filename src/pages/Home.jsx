import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthForm from "@/components/AuthForm";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (loading) return <div className='text-white text-center'>Loading...</div>;

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#19202D] px-6'>
      <div className='w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-center'>
        <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-8 tracking-wide'>
          HOIST
        </h1>

        <AuthForm />

        <div className='mt-6 text-sm text-gray-400'>
          <p>
            <a
              href='/forgot-password'
              className='text-orange-400 hover:underline transition'
            >
              Forgot Password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
