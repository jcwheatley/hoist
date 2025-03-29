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
