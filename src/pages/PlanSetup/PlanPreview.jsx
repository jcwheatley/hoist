import { useState } from "react";
import { usePlan } from "@/context/PlanContext";
import { saveWorkoutPlan } from "@/utils/saveWorkoutPlan";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import CancelPlanButton from "../../components/CancelPlanButton";

export default function PlanPreview() {
  const navigate = useNavigate();
  const { plan, updatePlan } = usePlan();
  const [loading, setLoading] = useState(false);

  const handleStartPlan = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/fetchAIPlan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal: plan.goal,
          weeklyFrequency: plan.weeklyFrequency,
          equipment: plan.equipment,
          weekNumber: 1, // Start with week 1
          notes: plan.notes,
        }),
      });

      const result = await response.json();

      if (!response.ok || !Array.isArray(result.plan)) {
        throw new Error(result.error || "Invalid AI response.");
      }

      const fullPlan = {
        ...plan,
        workouts: result.plan,
        currentIndex: 0,
      };

      await saveWorkoutPlan(result.plan);

      // Update context and localStorage
      updatePlan(fullPlan);

      toast.success("Plan created! Let’s get after it 💪");
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to generate plan:", err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const goTo = (path) => navigate(path);

  return (
    <div className='pt-20 px-6 max-w-lg mx-auto text-white'>
      <BackButton to='/plan/notes' />
      <CancelPlanButton />
      <h1 className='text-2xl font-bold text-center mb-6'>Your Workout Plan</h1>

      <div className='space-y-4 mb-10'>
        <PreviewItem
          label='Days Per Week'
          value={`${plan.weeklyFrequency} days`}
          onEdit={() => goTo("/plan/frequency")}
        />
        <PreviewItem
          label='Equipment'
          value={plan.equipment?.join(", ") || "None"}
          onEdit={() => goTo("/plan/equipment")}
        />
        <PreviewItem
          label='Goal'
          value={plan.goal}
          onEdit={() => goTo("/plan/goal")}
        />
        <PreviewItem
          label='Plan Length'
          value={`${plan.planLengthInWeeks} weeks`}
          onEdit={() => goTo("/plan/length")}
        />
        <PreviewItem
          label='Notes'
          value={plan.notes || "None"}
          onEdit={() => goTo("/plan/notes")}
        />
      </div>

      <button
        onClick={handleStartPlan}
        disabled={loading}
        className={`w-full py-4 rounded-lg font-bold transition ${
          loading
            ? "bg-gray-700 cursor-not-allowed"
            : "bg-orange-500 hover:bg-orange-600"
        }`}
      >
        {loading ? "Generating..." : "Generate My Plan"}
      </button>
      {loading && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70'>
          <div className='text-center text-white'>
            <img
              src='/assets/robot-dance.gif'
              alt='Robot Loading'
              className='h-28 w-28 mx-auto mb-6'
            />
            <h2 className='text-xl font-bold'>Generating Your Plan...</h2>
            <p className='text-sm text-gray-300 mt-2'>
              Hang tight — your AI assistant is crafting the perfect plan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function PreviewItem({ label, value, onEdit }) {
  return (
    <div className='bg-gray-800 p-4 rounded-lg flex justify-between items-center'>
      <div>
        <p className='text-sm text-gray-400'>{label}</p>
        <p className='text-lg font-medium'>{value}</p>
      </div>
      <button onClick={onEdit} className='text-gray-300 hover:text-white'>
        <FontAwesomeIcon icon={faPen} />
      </button>
    </div>
  );
}
