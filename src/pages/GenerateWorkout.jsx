import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Dropdown from "../components/Dropdown";
import { useWorkout } from "@/hooks/useWorkout";

export default function GenerateWorkout() {
  const { updateWorkout, startWorkoutGuarded } = useWorkout();
  const navigate = useNavigate();
  const [goal, setGoal] = useState("");
  const [workoutType, setWorkoutType] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(false);

  const goalOptions = [
    { value: "strength", label: "Strength" },
    { value: "endurance", label: "Endurance" },
    { value: "hypertrophy", label: "Muscle Growth" },
  ];
  const typeOptions = [
    { value: "full-body", label: "Full Body" },
    { value: "upper-body", label: "Upper Body" },
    { value: "lower-body", label: "Lower Body" },
  ];
  const levelOptions = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  const handleStartWorkout = () => {
    startWorkoutGuarded(undefined, undefined, handleGenerateWorkout);
  };

  const handleGenerateWorkout = async () => {
    if (!goal || !workoutType || !level) {
      toast.error("Please select all options before generating your workout.");
      return;
    }

    setLoading(true);

    try {
      console.log("about to make frontend call to generate workout");

      const response = await fetch("/api/fetchAIWorkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, workoutType, level }),
      });

      if (!response.ok) {
        const { error, fallback } = await response.json();
        toast.error(error || "Failed to generate workout. Using fallback.");
        if (fallback) {
          updateWorkout({
            name: fallback.name,
            exercises: fallback.exercises,
          });
          navigate("/workout", { state: { templateWorkout: fallback } });
        }
        return;
      }

      const text = await response.text();
      const generatedWorkout = text ? JSON.parse(text) : null;

      if (!generatedWorkout || !generatedWorkout.exercises) {
        toast.error("Failed to generate workout. Please try again.");
        return;
      }

      updateWorkout({
        name: generatedWorkout.name,
        exercises: generatedWorkout.exercises,
      });

      navigate("/workout", { state: { templateWorkout: generatedWorkout } });
    } catch (error) {
      console.error("Error generating workout:", error);
      toast.error("Unexpected error occurred.");
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
          options={goalOptions}
          selected={goal}
          setSelected={setGoal}
        />

        <Dropdown
          label='Select Workout Type:'
          options={typeOptions}
          selected={workoutType}
          setSelected={setWorkoutType}
        />

        <Dropdown
          label='Select Fitness Level:'
          options={levelOptions}
          selected={level}
          setSelected={setLevel}
        />
      </div>

      <button
        onClick={handleStartWorkout}
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
            <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-opacity-50 mx-auto mb-6'></div>
            <h2 className='text-xl font-bold'>Generating Your Workout...</h2>
            <p className='text-sm text-gray-300 mt-2'>
              Hang tight — we’re building a workout tailored just for you.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
