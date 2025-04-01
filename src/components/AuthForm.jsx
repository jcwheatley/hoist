import { useState } from "react";
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
} from "@/utils/firebase";
import toast from "react-hot-toast";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error) {
      console.error("Auth error:", error);
      if (error.code === "auth/email-already-in-use") {
        // Handle specific case for email already in use during sign up
        toast.error("Email already in use. Please try logging in.");
        return;
      } else if (error.code === "auth/invalid-credential") {
        // Handle case for user not found during login
        toast.error("No account found with this email. Please sign up.");
        return;
      } else if (error.code === "auth/weak-password") {
        // Handle wrong password case
        toast.error(
          "Weak password. Passwords should be at least 6 characters long."
        );
        return;
      } else if (error.code === "auth/invalid-email") {
        // Handle invalid email case
        toast.error("Invalid email address. Please check and try again.");
        return;
      } else if (error.code === "auth/operation-not-allowed") {
        // Handle case where sign-in method is not allowed
        toast.error(
          "This sign-in method is not allowed. Please contact support."
        );
        return;
      } else {
        // For any other errors, show a generic error message
        toast.error(error.message || "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className='flex flex-col max-w-sm items-center w-full mx-auto'>
      <form
        onSubmit={handleSubmit}
        className='w-full flex flex-col bg-[#1F2A3A] p-6 rounded-lg shadow-md'
      >
        <label className='text-gray-300 text-left text-sm font-semibold mb-1 text-white'>
          Email
        </label>
        <label className='text-gray-400 text-left text-sm font-semibold mb-1 text-white'>
          (If you are just browsing, click sign up and use a fake email)
        </label>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full px-3 py-2 rounded-md bg-[#2C3A4D] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500'
          placeholder='example@email.com'
          required
        />

        <label className='text-gray-300 text-left text-sm font-semibold mt-4 mb-1 text-white'>
          Password
        </label>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full px-3 py-2 rounded-md bg-[#2C3A4D] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500'
          placeholder='...'
          required
        />

        <button
          type='submit'
          className='cursor-pointer mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md font-semibold transition-all duration-300'
        >
          {isSignUp ? "Sign Up" : "Login"}
        </button>
      </form>

      <p className='text-sm text-gray-400 mt-4'>
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          className='cursor-pointer text-orange-400 hover:underline font-medium'
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Login" : "Sign Up"}
        </button>
      </p>

      <p className='mt-4 text-gray-500 text-sm'>or</p>

      <button
        onClick={signInWithGoogle}
        className='cursor-pointer mt-4 px-6 py-3 bg-[#4285F4] text-white rounded-md shadow hover:bg-[#357ae8] transition-all font-semibold'
      >
        Sign in with Google
      </button>
    </div>
  );
}
