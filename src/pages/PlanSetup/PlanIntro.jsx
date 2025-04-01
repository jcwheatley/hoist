import { useNavigate } from "react-router-dom";
import CancelPlanButton from "../../components/CancelPlanButton";

export default function WorkoutPlanIntro() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/plan/frequency");
  };

  return (
    <div className='pt-20 px-6 max-w-lg mx-auto text-center text-white'>
      <CancelPlanButton />
      <h1 className='text-3xl font-bold mb-4 border-b-4 border-orange-500 inline-block pb-1'>
        Create Your Workout Plan
      </h1>
      <p className='text-gray-300 mb-6'>
        Let’s build a workout plan tailored to your goals, schedule, and
        equipment. Answer a few questions to get started!
      </p>
      <div className='mb-8'>
        <span role='img' aria-label='Workout' className='text-6xl'>
          🏋️
        </span>
      </div>

      <button
        onClick={handleStart}
        className='w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-semibold transition'
      >
        Get Started
      </button>
    </div>
  );
}
