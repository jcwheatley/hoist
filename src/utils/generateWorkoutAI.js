export const generateWorkoutAI = async (goal, workoutType, level) => {
  console.log("Generating workout ai ");

  try {
    // const isLocal = import.meta.env.DEV;
    // const baseUrl = isLocal ? "http://localhost:3000" : "";

    const response = await fetch(`/api/fetchAIWorkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, workoutType, level }),
    });

    if (!response.ok) throw new Error("API call failed");

    return await response.json();
  } catch (error) {
    console.error("Using fallback due to error:", error);
    return generateMockWorkout(goal, workoutType, level);
  }
};

// Fallback mock generator
const generateMockWorkout = (goal, workoutType, level) => {
  console.log("Generating fallback workout...");
  const workouts = {
    "full-body": [
      { name: "Squats", sets: [{ type: "reps", value: "10", weight: "100" }] },
      {
        name: "Bench Press",
        sets: [{ type: "reps", value: "8", weight: "80" }],
      },
    ],
    "upper-body": [
      {
        name: "Pull-Ups",
        sets: [{ type: "reps", value: "8", weight: "Bodyweight" }],
      },
      {
        name: "Dumbbell Shoulder Press",
        sets: [{ type: "reps", value: "10", weight: "40" }],
      },
    ],
    "lower-body": [
      {
        name: "Deadlifts",
        sets: [{ type: "reps", value: "5", weight: "150" }],
      },
      { name: "Lunges", sets: [{ type: "reps", value: "12", weight: "50" }] },
    ],
  };

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

const adjustRepsForLevel = (reps, level) => {
  const factor = level === "beginner" ? 0.8 : level === "advanced" ? 1.2 : 1;
  return Math.round(parseInt(reps) * factor);
};

const adjustWeightForLevel = (weight, level) => {
  if (weight === "Bodyweight") return weight;
  const factor = level === "beginner" ? 0.8 : level === "advanced" ? 1.2 : 1;
  return Math.round(parseInt(weight) * factor);
};
