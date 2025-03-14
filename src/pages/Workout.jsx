import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPlus,
  faCheckCircle,
  faTimes,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { db } from "../utils/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { faCircle as faRegCircle } from "@fortawesome/free-regular-svg-icons"; // Regular outlined circle

export default function Workout() {
  const location = useLocation();
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState([
    {
      name: "",
      sets: [{ type: "reps", value: "", weight: "", completed: false }],
      expanded: true,
    },
  ]);

  useEffect(() => {
    if (location.state?.templateWorkout) {
      // ✅ Load template workout from navigation state
      const { name, exercises } = location.state.templateWorkout;
      setWorkoutName(`${name} (Copied)`); // Mark as a template copy
      setExercises(
        exercises.map((exercise) => ({
          ...exercise,
          sets: exercise.sets.map((set) => ({
            ...set,
            completed: false, // Reset completion status
          })),
          expanded: true,
        }))
      );
    } else {
      // Default empty workout
      setExercises([
        {
          name: "",
          sets: [{ type: "reps", value: "", weight: "", completed: false }],
          expanded: true,
        },
      ]);
    }
  }, [location.state]);

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        name: "",
        sets: [{ type: "reps", value: "", weight: "", completed: false }],
        expanded: true,
      },
    ]);
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const toggleExerciseExpand = (index) => {
    setExercises(
      exercises.map((exercise, i) =>
        i === index ? { ...exercise, expanded: !exercise.expanded } : exercise
      )
    );
  };

  const updateExerciseName = (index, name) => {
    const updatedExercises = [...exercises];
    updatedExercises[index].name = name;
    setExercises(updatedExercises);
  };

  const addSet = (exerciseIndex) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets.push({
      type: "reps",
      value: "",
      weight: "",
      completed: false,
    });
    setExercises(updatedExercises);
  };

  const removeSet = (exerciseIndex) => {
    const updatedExercises = [...exercises];
    if (updatedExercises[exerciseIndex].sets.length > 1) {
      updatedExercises[exerciseIndex].sets.pop();
      setExercises(updatedExercises);
    }
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets[setIndex][field] = value;
    setExercises(updatedExercises);
  };

  const toggleSetCompletion = (exerciseIndex, setIndex) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets[setIndex].completed =
      !updatedExercises[exerciseIndex].sets[setIndex].completed;
    setExercises(updatedExercises);
  };

  const saveWorkout = async () => {
    if (!workoutName || exercises.length === 0) {
      alert("Workout must have a name and at least one exercise.");
      return;
    }

    try {
      await addDoc(collection(db, "workouts"), {
        name: workoutName,
        exercises,
        createdAt: Timestamp.now(),
      });

      alert("Workout saved successfully!");
    } catch (error) {
      console.error("Error saving workout:", error);
      alert("Failed to save workout. Check the console for errors.");
    }
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='pt-20 px-6 max-w-lg mx-auto'>
        <Link
          to='/dashboard'
          className='flex items-center text-blue-600 text-lg font-semibold mb-4'
        >
          <FontAwesomeIcon icon={faArrowLeft} className='mr-2' /> Back to
          Dashboard
        </Link>

        {/* <h1 className='text-3xl font-bold text-center text-gray-900 mb-6'>
          Log Workout
        </h1> */}

        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-1'>
            Workout Name
          </label>
          <input
            type='text'
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600'
            placeholder='e.g., Leg Day'
          />
        </div>

        {exercises.map((exercise, index) => (
          <div key={index} className='relative flex items-center'>
            {/* Exercise Card */}
            <div className='bg-white p-4 rounded-lg shadow-md mt-4 flex-1'>
              <div className='flex justify-between items-center'>
                {/* Exercise Name */}
                <input
                  type='text'
                  value={exercise.name}
                  onChange={(e) => updateExerciseName(index, e.target.value)}
                  className='w-full text-lg font-semibold border-none focus:outline-none'
                  placeholder='Exercise Name'
                />

                {/* Expand / Collapse Button */}
                <button
                  onClick={() => toggleExerciseExpand(index)}
                  className='ml-2'
                >
                  <FontAwesomeIcon
                    icon={exercise.expanded ? faChevronUp : faChevronDown}
                    className='text-gray-500 text-lg'
                  />
                </button>
              </div>

              {exercise.expanded && (
                <>
                  <table className='w-full mt-2'>
                    <thead>
                      <tr className='text-gray-500 text-sm'>
                        <th className='w-1/5 text-center'>SET</th>
                        <th className='w-1/4 px-2'>LBS</th>
                        <th className='w-1/4 px-2'>Reps/Secs</th>
                        <th className='w-1/5 text-center'>Done</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exercise.sets.map((set, setIndex) => (
                        <tr key={setIndex}>
                          <td className='text-center py-2 font-bold'>
                            {setIndex + 1}
                          </td>
                          <td className='px-2 py-2'>
                            <input
                              type='number'
                              value={set.weight}
                              onChange={(e) =>
                                updateSet(
                                  index,
                                  setIndex,
                                  "weight",
                                  e.target.value
                                )
                              }
                              className='w-full border rounded-md text-center p-2'
                            />
                          </td>
                          <td className='px-2 py-2'>
                            <input
                              type='number'
                              value={set.value}
                              onChange={(e) =>
                                updateSet(
                                  index,
                                  setIndex,
                                  "value",
                                  e.target.value
                                )
                              }
                              className='w-full border rounded-md text-center p-2'
                            />
                          </td>
                          <td className='text-center py-2'>
                            <button
                              onClick={() =>
                                toggleSetCompletion(index, setIndex)
                              }
                            >
                              <FontAwesomeIcon
                                icon={
                                  set.completed ? faCheckCircle : faRegCircle
                                }
                                className={`text-2xl ${
                                  set.completed
                                    ? "text-green-600"
                                    : "text-gray-500"
                                }`}
                              />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className='flex justify-between mt-4'>
                    <button
                      onClick={() => removeSet(index)}
                      className='text-red-500 hover:underline'
                    >
                      Remove Set
                    </button>
                    <button
                      onClick={() => addSet(index)}
                      className='text-blue-600 hover:underline'
                    >
                      + Add Set
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* 🗑️ Remove Exercise Button (Right of Card) */}
            <button
              onClick={() => removeExercise(index)}
              className='ml-3 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md transition-all'
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        ))}

        <button
          onClick={addExercise}
          className='mt-4 w-full bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition-all'
        >
          <FontAwesomeIcon icon={faPlus} className='mr-2' /> Add Exercise
        </button>

        <button
          onClick={saveWorkout}
          className='mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all'
        >
          Log Workout
        </button>
      </div>
    </div>
  );
}
