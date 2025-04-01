import { useState, useEffect } from "react";
import { WorkoutContext } from "./WorkoutContextValue";

export function WorkoutProvider({ children }) {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [afterDiscardAction, setAfterDiscardAction] = useState(null);

  // Load active workout from localStorage on mount
  useEffect(() => {
    const storedWorkout = localStorage.getItem("activeWorkout");
    if (storedWorkout) {
      setActiveWorkout(JSON.parse(storedWorkout));
    }
  }, []);

  // Guarded start checks if workout already active
  const startWorkoutGuarded = (name, exercises, callback) => {
    if (activeWorkout) {
      setAfterDiscardAction(() => () => {
        if (name && exercises) {
          startWorkout(name, exercises);
        }
        callback?.();
      });
      setShowDiscardModal(true);
    } else {
      if (!name || !exercises || exercises.length === 0) {
        console.error("Invalid workout data provided");
        return;
      }

      if (name && exercises) {
        startWorkout(name, exercises);
      }
      callback?.();
    }
  };

  const startWorkout = (name, exercises) => {
    const workoutData = {
      name,
      exercises,
      startTime: Date.now(),
    };
    setActiveWorkout({
      ...workoutData,
    });
    localStorage.setItem("activeWorkout", JSON.stringify(workoutData));
  };

  const updateWorkout = (updates) => {
    setActiveWorkout((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("activeWorkout", JSON.stringify(updated));
      return updated;
    });
  };

  // When user confirms discard, stop the workout
  const confirmDiscardWorkout = () => {
    stopWorkout();
    if (afterDiscardAction) afterDiscardAction();
    setAfterDiscardAction(null);
    setShowDiscardModal(false);
  };

  const cancelDiscardWorkout = () => {
    setAfterDiscardAction(null);
    setShowDiscardModal(false);
  };

  const stopWorkout = () => {
    setActiveWorkout(null);
    localStorage.removeItem("activeWorkout");
  };

  const hasMeaningfulWorkoutData = (workout) => {
    if (!workout) return false;
    if (workout.name?.trim()) return true;

    return workout.exercises?.some((exercise) => {
      const hasName = exercise.name?.trim();
      const hasSetData = exercise.sets?.some(
        (set) => Number(set.value) > 0 || Number(set.weight) > 0
      );
      return hasName || hasSetData;
    });
  };

  return (
    <WorkoutContext.Provider
      value={{
        activeWorkout,
        startWorkout,
        updateWorkout,
        stopWorkout,
        startWorkoutGuarded,
        confirmDiscardWorkout,
        cancelDiscardWorkout,
        showDiscardModal,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}
