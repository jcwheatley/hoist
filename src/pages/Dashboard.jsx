import { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faWeightHanging,
  faListCheck,
  faFire,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

import { collection, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentWorkouts = async () => {
      const workoutsSnapshot = await getDocs(collection(db, "workouts"));
      const workoutsData = workoutsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRecentWorkouts(workoutsData);
    };

    fetchRecentWorkouts();
  }, []);

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Main Content (Added top padding to avoid hiding content under fixed navbar) */}
      <div className='px-6'>
        {/* Responsive Stats Bar */}
        <div className='bg-white shadow-md rounded-lg p-4 mt-6'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
            <div className='flex flex-col items-center'>
              <FontAwesomeIcon
                icon={faWeightHanging}
                className='text-black text-2xl md:text-3xl'
              />
              <h2 className='text-lg font-bold mt-1'>12,450 lbs</h2>
              <p className='text-gray-500 text-xs md:text-sm'>Weekly Volume</p>
            </div>

            <div className='flex flex-col items-center'>
              <FontAwesomeIcon
                icon={faListCheck}
                className='text-black text-2xl md:text-3xl'
              />
              <h2 className='text-lg font-bold mt-1'>4</h2>
              <p className='text-gray-500 text-xs md:text-sm'>
                Workouts This Week
              </p>
            </div>

            <div className='flex flex-col items-center'>
              <FontAwesomeIcon
                icon={faFire}
                className='text-black text-2xl md:text-3xl'
              />
              <h2 className='text-lg font-bold mt-1'>3,200</h2>
              <p className='text-gray-500 text-xs md:text-sm'>
                Calories Burned
              </p>
            </div>

            <div className='flex flex-col items-center'>
              <FontAwesomeIcon
                icon={faClock}
                className='text-black text-2xl md:text-3xl'
              />
              <h2 className='text-lg font-bold mt-1'>5 hrs</h2>
              <p className='text-gray-500 text-xs md:text-sm'>Total Time</p>
            </div>
          </div>
        </div>

        {/* New Workout Button */}
        <Link
          to='/workouts/new'
          className='mt-6 w-full block text-center bg-blue-800 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-900 transition-all'
        >
          New Workout
        </Link>

        {/* Recent Workouts Section */}
        <div className='mt-6 flex justify-between items-center'>
          <h2 className='text-xl font-bold'>Recent Workouts</h2>
          <button className='text-blue-600 text-sm font-semibold hover:underline'>
            View All
          </button>
        </div>

        {/* List of Saved Workouts */}
        <div className='mt-3 grid gap-4'>
          {recentWorkouts.length === 0 ? (
            <p className='text-gray-500'>No recent workouts found.</p>
          ) : (
            recentWorkouts.slice(0, 4).map((workout) => (
              <div
                key={workout.id}
                className='bg-white p-4 rounded-lg shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-200 transition'
                onClick={() => navigate(`/workout/${workout.id}`)}
              >
                <div>
                  <h3 className='text-lg font-semibold'>{workout.name}</h3>
                  <p className='text-gray-500 text-sm'>
                    {new Date(
                      workout.createdAt.seconds * 1000
                    ).toLocaleString()}
                  </p>
                </div>
                <button className='text-gray-700 text-xl'>
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Friend Feed & Leaderboard Tabs */}
        <div className='mt-6'>
          <div className='flex gap-2 border-b border-gray-300'>
            <button className='flex-1 py-2 text-lg font-bold border-b-4 border-black'>
              Friend Feed
            </button>
            <button className='flex-1 py-2 text-lg text-gray-500 hover:text-black'>
              Leaderboard
            </button>
          </div>

          {/* Example Friend Feed Entry */}
          <div className='bg-white p-4 rounded-lg shadow-md flex justify-between items-center mt-4'>
            <div className='flex items-center'>
              <img
                src='https://via.placeholder.com/40'
                alt='Friend'
                className='w-10 h-10 rounded-full mr-3'
              />
              <div>
                <h3 className='text-lg font-semibold'>Upper Body</h3>
                <p className='text-gray-500 text-sm'>Yesterday</p>
              </div>
            </div>
            <button className='text-gray-700 text-xl'>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
