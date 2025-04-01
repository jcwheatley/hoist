import { createContext, useContext, useState, useEffect } from "react";

const WorkoutContext = createContext(null);

export const WorkoutProvider = ({ children }) => {
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);

  const [activeWorkout, setActiveWorkout] = useState(() => {
    const stored = localStorage.getItem("activeWorkout");
    return stored ? JSON.parse(stored) : null;
  });

  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [afterDiscardAction, setAfterDiscardAction] = useState(null);

  const updateWorkout = (workout) => {
    setActiveWorkout(workout);
    localStorage.setItem("activeWorkout", JSON.stringify(workout));
  };

  const startWorkout = (name, exercises) => {
    const newWorkout = { name, exercises };
    updateWorkout(newWorkout);
  };

  const stopWorkout = () => {
    setActiveWorkout(null);
    setStopwatchTime(0);
    setStopwatchRunning(false);
    localStorage.removeItem("activeWorkout");
  };

  const isWorkoutMeaningful = (workout) => {
    if (!workout?.name?.trim()) return false;
    return workout.exercises?.some((ex) => ex.name?.trim()) ?? false;
  };

  const startWorkoutGuarded = (name, exercises, onConfirmed) => {
    const hasMeaningfulWorkout = isWorkoutMeaningful(activeWorkout);

    if (hasMeaningfulWorkout) {
      setAfterDiscardAction(() => () => {
        startWorkout(name, exercises);
        onConfirmed?.();
      });
      setShowDiscardModal(true);
    } else {
      startWorkout(name, exercises);
      onConfirmed?.();
    }
  };

  const confirmDiscard = () => {
    stopWorkout();
    setShowDiscardModal(false);
    afterDiscardAction?.();
    setAfterDiscardAction(null);
  };

  const cancelDiscard = () => {
    setShowDiscardModal(false);
    setAfterDiscardAction(null);
  };

  return (
    <WorkoutContext.Provider
      value={{
        activeWorkout,
        startWorkout,
        stopWorkout,
        updateWorkout,
        isWorkoutMeaningful,
        startWorkoutGuarded,
        showDiscardModal,
        confirmDiscard,
        cancelDiscard,
        stopwatchTime,
        setStopwatchTime,
        stopwatchRunning,
        setStopwatchRunning,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => useContext(WorkoutContext);
