import { useState } from "react";
import { usePlan } from "@/context/PlanContext";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton";
import CancelPlanButton from "../../components/CancelPlanButton";

const goalOptions = [
  "Build Strength",
  "Increase Endurance",
  "Grow Muscle (Hypertrophy)",
  "Lose Weight",
  "General Fitness",
];

export default function PlanGoal() {
  const navigate = useNavigate();
  const { plan, updatePlan } = usePlan();
  const [selectedGoal, setSelectedGoal] = useState(plan.goal || "");

  const handleNext = () => {
    if (!selectedGoal) return;
    updatePlan({ ...plan, goal: selectedGoal });
    navigate("/plan/length");
  };

  return (
    <div className='pt-20 px-6 max-w-lg mx-auto text-white'>
      <BackButton to='/plan/equipment' />
      <CancelPlanButton />
      <h1 className='text-2xl font-bold text-center mb-4'>What’s Your Goal?</h1>
      <p className='text-gray-300 text-center mb-6'>Pick your primary focus.</p>

      <div className='flex flex-col gap-3 mb-10'>
        {goalOptions.map((goal) => (
          <button
            key={goal}
            type='button'
            onClick={() => setSelectedGoal(goal)}
            className={`w-full px-4 py-3 rounded-lg text-left transition ${
              selectedGoal === goal
                ? "bg-orange-500 text-white"
                : "bg-gray-800 text-white"
            }`}
          >
            {goal}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!selectedGoal}
        className={`w-full py-4 rounded-lg font-bold transition ${
          !selectedGoal
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-orange-500 hover:bg-orange-600"
        }`}
      >
        Next
      </button>
    </div>
  );
}
