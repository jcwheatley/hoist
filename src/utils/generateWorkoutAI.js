export const generateWorkoutAI = async (goal, workoutType, level) => {
  // Dummy AI workout generator for now
  const workouts = {
    "full-body": [
      { name: "Squats", sets: [{ type: "reps", value: "10", weight: "100" }] },
      { name: "Bench Press", sets: [{ type: "reps", value: "8", weight: "80" }] },
    ],
    "upper-body": [
      { name: "Pull-Ups", sets: [{ type: "reps", value: "8", weight: "Bodyweight" }] },
      { name: "Dumbbell Shoulder Press", sets: [{ type: "reps", value: "10", weight: "40" }] },
    ],
    "lower-body": [
      { name: "Deadlifts", sets: [{ type: "reps", value: "5", weight: "150" }] },
      { name: "Lunges", sets: [{ type: "reps", value: "12", weight: "50" }] },
    ],
  };

  // Adjust workout based on level
  const baseWorkout = workouts[workoutType] || [];
  const scaledWorkout = baseWorkout.map((exercise) => ({
    ...exercise,
    sets: exercise.sets.map((set) => ({
      ...set,
      value: adjustRepsForLevel(set.value, level),
      weight: adjustWeightForLevel(set.weight, level),
    })),
  }));

  return {
    name: `${level.charAt(0).toUpperCase() + level.slice(1)} ${goal} Workout`,
    exercises: scaledWorkout,
  };
};

// Helper functions
const adjustRepsForLevel = (reps, level) => {
  const factor = level === "beginner" ? 0.8 : level === "advanced" ? 1.2 : 1;
  return Math.round(parseInt(reps) * factor);
};

const adjustWeightForLevel = (weight, level) => {
  if (weight === "Bodyweight") return weight;
  const factor = level === "beginner" ? 0.8 : level === "advanced" ? 1.2 : 1;
  return Math.round(parseInt(weight) * factor);
};
