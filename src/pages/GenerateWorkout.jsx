import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Dropdown from "../components/Dropdown";
import { useWorkout } from "@/context/WorkoutContext";

export default function GenerateWorkout() {
  const { updateWorkout, startWorkoutGuarded } = useWorkout();
  const navigate = useNavigate();
  const [goal, setGoal] = useState("");
  const [workoutType, setWorkoutType] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(false);

  const dropdownOptions = {
    goals: [
      { value: "strength", label: "Strength" },
      { value: "endurance", label: "Endurance" },
      { value: "hypertrophy", label: "Muscle Growth" },
    ],
    types: [
      { value: "full-body", label: "Full Body" },
      { value: "upper-body", label: "Upper Body" },
      { value: "lower-body", label: "Lower Body" },
    ],
    levels: [
      { value: "beginner", label: "Beginner" },
      { value: "intermediate", label: "Intermediate" },
      { value: "advanced", label: "Advanced" },
    ],
  };

  const handleGenerateWorkout = async () => {
    if (!goal || !workoutType || !level) {
      toast.error("Please select all options to generate your workout.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/fetchAIWorkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, workoutType, level }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to generate workout. Using backup.");
        if (data.fallback) {
          updateWorkout(data.fallback);
          navigate("/workout", { state: { templateWorkout: data.fallback } });
        }
        return;
      }

      if (!data?.exercises?.length) {
        toast.error("Generated workout is invalid. Please try again.");
        return;
      }

      updateWorkout(data);
      navigate("/workout", { state: { templateWorkout: data } });
    } catch (error) {
      console.error("Workout generation error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='pt-20 px-6 max-w-lg mx-auto'>
      <h1 className='text-3xl font-bold text-center text-white mb-6'>
        Generate AI Workout
      </h1>
      <div className='space-y-4 pb-8'>
        <Dropdown
          label='Select Your Goal:'
          options={dropdownOptions.goals}
          selected={goal}
          setSelected={setGoal}
        />
        <Dropdown
          label='Select Workout Type:'
          options={dropdownOptions.types}
          selected={workoutType}
          setSelected={setWorkoutType}
        />
        <Dropdown
          label='Select Fitness Level:'
          options={dropdownOptions.levels}
          selected={level}
          setSelected={setLevel}
        />
      </div>
      <button
        onClick={() =>
          startWorkoutGuarded(undefined, undefined, handleGenerateWorkout)
        }
        disabled={loading}
        className={`w-full bg-orange-500 text-white py-4 rounded-lg font-bold tracking-wide ${
          loading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-orange-600 transition-all"
        }`}
      >
        Generate Workout
      </button>
      {loading && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70'>
          <div className='text-center text-white'>
            <img
              src='/assets/robot-dance.gif'
              alt='Robot Loading'
              className='h-28 w-28 mx-auto mb-6'
            />
            <h2 className='text-xl font-bold'>Generating Your Workout...</h2>
            <p className='text-sm text-gray-300 mt-2'>
              Hang tight — we’re building your perfect workout.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
