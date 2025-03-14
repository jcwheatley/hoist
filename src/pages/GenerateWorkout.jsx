import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateWorkoutAI } from "../utils/openaiClient"; // Import OpenAI function

export default function GenerateWorkout() {
  const navigate = useNavigate();
  const [goal, setGoal] = useState("");
  const [workoutType, setWorkoutType] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateWorkout = async () => {
    if (!goal || !workoutType || !level) {
      alert("Please select all options before generating your workout.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Call OpenAI to generate the workout
      const generatedWorkout = await generateWorkoutAI(
        goal,
        workoutType,
        level
      );

      if (!generatedWorkout) {
        alert("Failed to generate workout. Please try again.");
        setLoading(false);
        return;
      }

      // ✅ Navigate to workout logging page with AI-generated data
      navigate("/workouts", { state: { templateWorkout: generatedWorkout } });
    } catch (error) {
      console.error("Error generating workout:", error);
      alert("Error generating workout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 pt-20 px-6 max-w-lg mx-auto'>
      <h1 className='text-3xl font-bold text-center text-gray-900 mb-6'>
        Generate AI Workout
      </h1>

      {/* Goal Selection */}
      <div className='mb-4'>
        <label className='block text-gray-700 text-sm font-bold mb-2'>
          Select Your Goal:
        </label>
        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className='w-full px-3 py-2 border rounded-md'
        >
          <option value=''>Select Goal</option>
          <option value='strength'>Strength</option>
          <option value='endurance'>Endurance</option>
          <option value='hypertrophy'>Muscle Growth</option>
        </select>
      </div>

      {/* Workout Type Selection */}
      <div className='mb-4'>
        <label className='block text-gray-700 text-sm font-bold mb-2'>
          Select Workout Type:
        </label>
        <select
          value={workoutType}
          onChange={(e) => setWorkoutType(e.target.value)}
          className='w-full px-3 py-2 border rounded-md'
        >
          <option value=''>Select Type</option>
          <option value='full-body'>Full Body</option>
          <option value='upper-body'>Upper Body</option>
          <option value='lower-body'>Lower Body</option>
        </select>
      </div>

      {/* Fitness Level Selection */}
      <div className='mb-4'>
        <label className='block text-gray-700 text-sm font-bold mb-2'>
          Select Fitness Level:
        </label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className='w-full px-3 py-2 border rounded-md'
        >
          <option value=''>Select Level</option>
          <option value='beginner'>Beginner</option>
          <option value='intermediate'>Intermediate</option>
          <option value='advanced'>Advanced</option>
        </select>
      </div>

      {/* Generate Workout Button */}
      <button
        onClick={handleGenerateWorkout}
        className={`mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold ${
          loading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-green-700 transition-all"
        }`}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Workout"}
      </button>
    </div>
  );
}
