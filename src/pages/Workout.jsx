import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faCheckCircle,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle as faRegCircle } from "@fortawesome/free-regular-svg-icons";
import { db } from "@/utils/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import StopwatchBar from "@/components/StopwatchBar";
import toast from "react-hot-toast";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useWorkout } from "@/hooks/useWorkout";

export default function Workout() {
  const { startWorkout, activeWorkout, updateWorkout, stopWorkout } =
    useWorkout();
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState([
    {
      name: "",
      done: false,
      sets: [
        { type: "reps", value: 0, weight: 0, completed: false },
        { type: "reps", value: 0, weight: 0, completed: false },
        { type: "reps", value: 0, weight: 0, completed: false },
      ],
      expanded: true,
    },
  ]);

  useEffect(() => {
    const templateWorkout = location.state?.templateWorkout;

    if (templateWorkout) {
      // Use the passed-in workout as the starting point
      startWorkout(templateWorkout.name, templateWorkout.exercises);
      setWorkoutName(templateWorkout.name.toUpperCase());
      setExercises(templateWorkout.exercises);
    } else if (activeWorkout) {
      const { name, exercises } = activeWorkout;
      setWorkoutName(name.toUpperCase());
      setExercises(exercises);

      // ✅ Start workout in context
      // startWorkout(name.toUpperCase(), preparedExercises);
    } else {
      // Start default workout
      startWorkout(workoutName, exercises);
    }
  }, [location.state]);

  useEffect(() => {
    window.history.replaceState({}, document.title);
  }, []);

  useEffect(() => {
    const activeWorkout = {
      name: workoutName,
      exercises,
    };
    localStorage.setItem("activeWorkout", JSON.stringify(activeWorkout));
  }, [workoutName, exercises]);

  useEffect(() => {
    updateWorkout({ name: workoutName, exercises });
  }, [workoutName, exercises]);

  useEffect(() => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight;
      setHeaderHeight(height);
    }
  }, [workoutName]);

  const toggleSetCompletion = (exerciseIndex, setIndex) => {
    setExercises((prev) =>
      prev.map((exercise, i) =>
        i === exerciseIndex
          ? {
              ...exercise,
              sets: exercise.sets.map((set, j) =>
                j === setIndex ? { ...set, completed: !set.completed } : set
              ),
            }
          : exercise
      )
    );
  };

  const updateExerciseName = (exerciseIndex, name) => {
    setExercises((prev) =>
      prev.map((exercise, i) =>
        i === exerciseIndex ? { ...exercise, name } : exercise
      )
    );
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    setExercises((prev) =>
      prev.map((exercise, i) =>
        i === exerciseIndex
          ? {
              ...exercise,
              sets: exercise.sets.map((set, j) =>
                j === setIndex ? { ...set, [field]: value } : set
              ),
            }
          : exercise
      )
    );
  };

  const addSet = (exerciseIndex) => {
    setExercises((prev) =>
      prev.map((exercise, i) =>
        i === exerciseIndex
          ? {
              ...exercise,
              sets: [
                ...exercise.sets,
                { type: "reps", value: "", weight: "", completed: false },
              ],
            }
          : exercise
      )
    );
  };

  const removeSet = (exerciseIndex) => {
    setExercises((prevExercises) => {
      const updated = [...prevExercises];
      const currentSets = [...updated[exerciseIndex].sets];

      if (currentSets.length > 1) {
        currentSets.pop(); // removes the last set safely
        updated[exerciseIndex] = {
          ...updated[exerciseIndex],
          sets: currentSets,
        };
      }

      return updated;
    });
  };

  const addExercise = () => {
    setExercises((prev) => [
      ...prev,
      {
        name: "",
        done: false,
        sets: [{ type: "reps", value: "", weight: "", completed: false }],
        expanded: true,
      },
    ]);
  };

  const removeExercise = (exerciseIndex) => {
    setExercises((prevExercises) =>
      prevExercises.filter((_, i) => i !== exerciseIndex)
    );
  };

  // ✅ Save Workout to Firestore
  const completeWorkout = async () => {
    if (!workoutName || exercises.length === 0) {
      toast.error("Workout must have a name and at least one exercise.");
      return;
    }

    try {
      await addDoc(collection(db, "workouts"), {
        name: workoutName,
        exercises,
        createdAt: Timestamp.now(),
      });

      toast.success("Workout completed. Nice Work.");
      navigate("/library");
    } catch (error) {
      console.error("Error saving workout:", error);
      toast.error("Failed to save workout.");
    }
    stopWorkout();
  };

  const markExerciseDoneStatus = (exerciseIndex, status) => {
    setExercises((prev) =>
      prev.map((exercise, i) =>
        i === exerciseIndex ? { ...exercise, done: status } : exercise
      )
    );
  };

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [workoutName]);

  return (
    <div className='p-4 pb-32'>
      <div
        ref={headerRef}
        className='fixed top-0 left-0 right-0 z-50 bg-[#19202D] border-b border-gray-600 py-4 px-4'
      >
        <div className='flex items-center justify-between gap-4'>
          <textarea
            ref={textareaRef}
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            rows={1}
            className='flex-1 font-bold resize-none bg-transparent focus:outline-none text-white text-lg min-w-0 leading-snug overflow-hidden text-left'
            placeholder='Workout Name...'
          />

          <button
            onClick={completeWorkout}
            className='bg-orange-500 text-white px-4 py-1 rounded-md font-semibold whitespace-nowrap'
          >
            DONE
          </button>
        </div>
      </div>

      {/* Exercises List */}
      <div
        style={{ paddingTop: `${headerHeight + 2}px` }}
        className='space-y-4'
      >
        {exercises.map((exercise, index) => (
          <div key={index} className='bg-[#19202D] p-4 rounded-lg'>
            {/* Exercise Header */}
            <div className='flex justify-between items-center'>
              <input
                type='text'
                value={exercise.name}
                onChange={(e) => updateExerciseName(index, e.target.value)}
                className='bg-transparent text-lg font-semibold focus:outline-none w-full'
                placeholder='Exercise Name...'
              />

              {!exercise.done ? (
                <>
                  {/* Options Menu */}
                  <Menu
                    as='div'
                    className='relative inline-block text-left ml-2'
                  >
                    <MenuButton className='text-gray-400 hover:text-white focus:outline-none'>
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </MenuButton>

                    <MenuItems className='absolute right-0 mt-2 w-40 origin-top-right bg-[#1F2A3A] text-white divide-y divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10'>
                      <div className='px-2 py-1'>
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={() => {
                                if (exercise.sets.length > 1) removeSet(index);
                              }}
                              className={`${
                                active ? "bg-[#2C3A4D]" : ""
                              } w-full text-left px-2 py-2 text-sm`}
                            >
                              Remove Last Set
                            </button>
                          )}
                        </MenuItem>

                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={() => removeExercise(index)}
                              className={`${
                                active ? "bg-[#2C3A4D]" : ""
                              } w-full text-left px-2 py-2 text-sm text-red-400`}
                            >
                              Delete Exercise
                            </button>
                          )}
                        </MenuItem>

                        <MenuItem disabled>
                          <span className='block px-2 py-2 text-sm text-gray-500 cursor-not-allowed'>
                            Exercise Info (coming soon)
                          </span>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </Menu>
                </>
              ) : (
                <button
                  onClick={() => markExerciseDoneStatus(index)}
                  className='ml-2 text-gray-400 hover:text-white focus:outline-none'
                >
                  <FontAwesomeIcon icon={faChevronDown} />
                </button>
              )}
            </div>

            {!exercise.done && (
              <>
                {/* Sets Table */}
                <table className='w-full mt-3'>
                  <thead>
                    <tr className='text-gray-400 text-sm'>
                      <th className='w-1/5 text-center'>SET</th>
                      <th className='w-1/4 text-center'>LBS</th>
                      <th className='w-1/4 text-center'>REPS</th>
                      <th className='w-1/5 text-center'></th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.sets.map((set, setIndex) => (
                      <tr key={setIndex} className='text-white'>
                        <td className='py-2 text-center'>{setIndex + 1}</td>
                        <td className='py-2' colSpan={2}>
                          <div className='flex gap-2'>
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
                              className='w-full rounded-md text-center p-2 bg-gray-800 text-white placeholder-gray-400'
                              placeholder='0'
                            />
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
                              className='w-full rounded-md text-center p-2 bg-gray-800 text-white placeholder-gray-400'
                              placeholder='0'
                            />
                          </div>
                        </td>
                        <td className='py-2 text-center'>
                          <button
                            onClick={() => toggleSetCompletion(index, setIndex)}
                          >
                            <FontAwesomeIcon
                              icon={set.completed ? faCheckCircle : faRegCircle}
                              className={`text-2xl ${
                                set.completed
                                  ? "text-green-500"
                                  : "text-gray-500"
                              }`}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className='flex gap-2 mt-4'>
                  <button
                    onClick={() => addSet(index)}
                    className='flex-1 bg-[#1F2A3A] text-white py-2 rounded-md font-semibold'
                  >
                    + Add Set
                  </button>
                  <button
                    onClick={() => markExerciseDoneStatus(index, true)}
                    className='flex-1 border border-green-500 text-green-500 hover:bg-green-500 hover:text-white py-2 rounded-md font-semibold transition'
                  >
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add Exercise */}
      <button
        onClick={addExercise}
        className='w-full bg-[#1F2A3A] text-white py-2 mt-4 rounded-md font-semibold'
      >
        + Add Exercise
      </button>

      <StopwatchBar />
    </div>
  );
}
