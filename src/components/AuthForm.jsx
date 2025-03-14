import { useState } from "react";
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
} from "../utils/firebase";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      await signUpWithEmail(email, password);
    } else {
      await signInWithEmail(email, password);
    }
  };

  return (
    <div className='flex flex-col items-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg'>
      <>
        <form onSubmit={handleSubmit} className='w-full flex flex-col'>
          <label className='text-gray-700 text-sm font-bold mb-1'>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
            required
          />

          <label className='text-gray-700 text-sm font-bold mt-4 mb-1'>
            Password
          </label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
            required
          />

          <button
            type='submit'
            className='mt-6 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-all duration-300'
          >
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className='text-sm text-gray-600 mt-4'>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            className='text-blue-600 hover:underline'
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>

        <p className='mt-4 text-gray-600 text-sm'>or</p>

        <button
          onClick={signInWithGoogle}
          className='mt-4 px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-all'
        >
          Sign in with Google
        </button>
      </>
    </div>
  );
}
