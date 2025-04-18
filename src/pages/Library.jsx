import { useEffect, useState } from "react";
import { query, where, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/utils/firebase";
import { useNavigate } from "react-router-dom";
import { useWorkout } from "@/context/WorkoutContext";

export default function Library() {
  const [workouts, setWorkouts] = useState([]);
  const navigate = useNavigate();
  const { startWorkoutGuarded } = useWorkout();

  useEffect(() => {
    const fetchWorkouts = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      const userWorkouts = query(
        collection(db, "workouts"),
        where("userId", "==", user.uid)
      );
      const snapshot = await getDocs(userWorkouts);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWorkouts(data);
    };

    fetchWorkouts();
  }, []);

  const handleStartWorkout = (workout) => {
    startWorkoutGuarded(workout.name, workout.exercises, () =>
      navigate("/workout", { state: { templateWorkout: workout } })
    );
  };

  return (
    <div className='p-6'>
      <h1 className='text-xl font-bold mb-6'>Recent Workouts</h1>
      {workouts.length === 0 ? (
        <p className='text-gray-400 text-center'>No workouts found.</p>
      ) : (
        <div className='space-y-4 pb-32'>
          {[...workouts]
            .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
            .map((workout) => (
              <div
                key={workout.id}
                className='bg-[#19202D] p-4 mb-2 rounded-lg shadow-md flex justify-between items-center hover:bg-gray-700 transition cursor-pointer'
                onClick={() => handleStartWorkout(workout)}
              >
                <div className='w-full max-w-full'>
                  <div className='w-full max-w-full'>
                    <h2 className='text-lg font-semibold break-all overflow-hidden line-clamp-3 leading-snug'>
                      {workout.name}
                    </h2>
                  </div>
                  <p className='text-sm text-gray-400'>
                    {new Date(workout.createdAt?.seconds * 1000).toLocaleString(
                      [],
                      {
                        dateStyle: "short",
                        timeStyle: "short",
                      }
                    )}
                  </p>
                </div>
                <span className='text-sm text-right text-orange-400'>
                  Start From Template
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
