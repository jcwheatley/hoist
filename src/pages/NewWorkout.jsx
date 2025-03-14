import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faRobot,
  faStar,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

export default function NewWorkout() {
  return (
    <div className='min-h-screen bg-gray-100 px-6 pt-20'>
      {/* Back Button */}
      <Link
        to='/dashboard'
        className='flex items-center text-blue-600 text-lg font-semibold mb-4'
      >
        <FontAwesomeIcon icon={faArrowLeft} className='mr-2' /> Back to
        Dashboard
      </Link>

      <h1 className='text-3xl font-bold text-center text-gray-900 mb-6'>
        Start a New Workout
      </h1>

      <div className='grid gap-6 max-w-lg mx-auto'>
        {/* Log Manual Workout */}
        <Link
          to='/workouts'
          className='bg-white p-6 rounded-lg shadow-md flex items-center hover:bg-gray-50 transition-all'
        >
          <FontAwesomeIcon
            icon={faPencilAlt}
            className='text-blue-700 text-3xl mr-4'
          />
          <div>
            <h2 className='text-lg font-semibold'>Log a Manual Workout</h2>
            <p className='text-gray-500 text-sm'>
              Add and track your own custom workout routine.
            </p>
          </div>
        </Link>

        {/* Generate AI Workout */}
        <Link
          to='/workouts/ai'
          className='bg-white p-6 rounded-lg shadow-md flex items-center hover:bg-gray-50 transition-all'
        >
          <FontAwesomeIcon
            icon={faRobot}
            className='text-green-700 text-3xl mr-4'
          />
          <div>
            <h2 className='text-lg font-semibold'>Generate AI Workout</h2>
            <p className='text-gray-500 text-sm'>
              Get a personalized workout plan based on your fitness goals.
            </p>
          </div>
        </Link>

        {/* Choose from Favorites */}
        <Link
          to='/workouts/favorites'
          className='bg-white p-6 rounded-lg shadow-md flex items-center hover:bg-gray-50 transition-all'
        >
          <FontAwesomeIcon
            icon={faStar}
            className='text-yellow-500 text-3xl mr-4'
          />
          <div>
            <h2 className='text-lg font-semibold'>Choose from Favorites</h2>
            <p className='text-gray-500 text-sm'>
              Pick from your collection of saved workouts.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
