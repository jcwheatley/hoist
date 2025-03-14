import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faRedo } from "@fortawesome/free-solid-svg-icons";

export default function ViewWorkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      const docRef = doc(db, "workouts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setWorkout(docSnap.data());
      } else {
        console.log("Workout not found!");
        navigate("/dashboard"); // Redirect if not found
      }
    };

    fetchWorkout();
  }, [id, navigate]);

  const startWorkoutWithTemplate = () => {
    navigate("/workouts", { state: { templateWorkout: workout } });
  };

  if (!workout) return <p className='text-center mt-10'>Loading...</p>;

  return (
    <div className='min-h-screen bg-gray-100 pt-20 px-6 max-w-lg mx-auto'>
      <button
        onClick={() => navigate("/dashboard")}
        className='flex items-center text-blue-600 text-lg font-semibold mb-4'
      >
        <FontAwesomeIcon icon={faArrowLeft} className='mr-2' /> Back to
        Dashboard
      </button>

      <h1 className='text-3xl font-bold text-center text-gray-900 mb-6'>
        {workout.name}
      </h1>

      <div className='bg-white p-4 rounded-lg shadow-md'>
        {workout.exercises.map((exercise, index) => (
          <div key={index} className='mb-4'>
            <h2 className='text-lg font-semibold'>{exercise.name}</h2>
            {exercise.sets.map((set, setIndex) => (
              <p key={setIndex} className='text-gray-600'>
                Set {setIndex + 1}: {set.weight} lbs, {set.value}{" "}
                {set.type === "reps" ? "reps" : "secs"}
              </p>
            ))}
          </div>
        ))}
      </div>

      <button
        onClick={startWorkoutWithTemplate}
        className='mt-6 w-full bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition-all'
      >
        <FontAwesomeIcon icon={faRedo} className='mr-2' /> Start Workout from
        Template
      </button>
    </div>
  );
}
