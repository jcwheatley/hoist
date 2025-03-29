import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useWorkout } from "@/hooks/useWorkout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWeightHanging,
  faListCheck,
  faBook,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  const navigate = useNavigate();
  const { startWorkoutGuarded } = useWorkout();
  const [workoutHistory, setWorkoutHistory] = useState([]);

  // Fetch workout history on mount
  useEffect(() => {
    const fetchWorkouts = async () => {
      const snapshot = await getDocs(collection(db, "workouts"));
      const allWorkouts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWorkoutHistory(allWorkouts);
    };

    fetchWorkouts();
  }, []);

  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const sunday = new Date(now);
    sunday.setHours(0, 0, 0, 0);
    sunday.setDate(now.getDate() - day);
    return sunday;
  };

  const startOfWeek = getStartOfWeek();

  const workoutsThisWeek = workoutHistory.filter((workout) => {
    const workoutDate = new Date(workout.createdAt?.seconds * 1000);
    return workoutDate >= startOfWeek;
  });

  const weeklyVolume = workoutsThisWeek.reduce((total, workout) => {
    const workoutVolume = workout.exercises?.reduce((exTotal, ex) => {
      const exVolume = ex.sets?.reduce((setTotal, set) => {
        const weight = parseFloat(set.weight) || 0;
        const reps = parseFloat(set.value) || 0;
        return setTotal + weight * reps;
      }, 0);
      return exTotal + exVolume;
    }, 0);
    return total + workoutVolume;
  }, 0);

  const handleStartWorkout = () => {
    startWorkoutGuarded(undefined, undefined, () => navigate("/workout"));
  };

  return (
    <div className='flex flex-col items-center'>
      {/* Stats Bar */}
      <div className='text-white shadow-md rounded-lg p-4 mt-4 w-11/12 max-w-lg'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex items-center'>
            <FontAwesomeIcon
              icon={faWeightHanging}
              className='text-white text-2xl mr-3'
            />
            <div>
              <h2 className='text-lg font-bold'>
                {weeklyVolume.toLocaleString()} lbs
              </h2>
              <p className='text-gray-400 text-xs'>Weekly Volume</p>
            </div>
          </div>

          <div className='flex items-center'>
            <FontAwesomeIcon
              icon={faListCheck}
              className='text-white text-2xl mr-3'
            />
            <div>
              <h2 className='text-lg font-bold'>{workoutsThisWeek.length}</h2>
              <p className='text-gray-400 text-xs'>Workouts This Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Start Today's Workout */}
      <button
        onClick={handleStartWorkout}
        className='w-11/12 max-w-lg bg-orange-500 text-white py-4 rounded-lg text-lg font-bold hover:bg-orange-600 transition-all'
      >
        START TODAY’S WORKOUT
        <p className='text-sm font-normal'>UPPER BODY - STRENGTH - 30m</p>
      </button>

      {/* Manual Workout */}
      <button
        onClick={handleStartWorkout}
        className='w-11/12 max-w-lg mt-4 bg-[#19202D] text-white py-4 px-6 rounded-lg text-lg font-semibold text-center hover:bg-[#212b3b] transition-all'
      >
        NEW WORKOUT
        <p className='text-sm font-light'>LOG A WORKOUT AS YOU GO</p>
      </button>

      {/* AIGen + Saved */}
      <div className='w-11/12 max-w-lg mt-4 grid grid-cols-2 gap-4'>
        <Link
          to='/workout/ai'
          className='bg-[#19202D] text-white py-4 px-2 rounded-lg text-center hover:bg-[#212b3b] transition-all flex flex-col items-center justify-center'
        >
          <FontAwesomeIcon icon={faRobot} className='text-lg mb-1' />
          <span className='text-sm font-semibold'>AI GENERATED</span>
        </Link>

        <Link
          to='/library'
          className='bg-[#19202D] text-white py-4 px-2 rounded-lg text-center hover:bg-[#212b3b] transition-all flex flex-col items-center justify-center'
        >
          <FontAwesomeIcon icon={faBook} className='text-lg mb-1' />
          <span className='text-sm font-semibold'>LIBRARY</span>
        </Link>
      </div>
    </div>
  );
}
