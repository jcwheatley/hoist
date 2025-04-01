import { useState } from "react";
import { usePlan } from "@/context/PlanContext";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton";
import CancelPlanButton from "../../components/CancelPlanButton";

export default function PlanNotes() {
  const navigate = useNavigate();
  const { plan, updatePlan } = usePlan();
  const [notes, setNotes] = useState(plan.notes || "");

  const handleNext = () => {
    updatePlan({ ...plan, notes });
    navigate("/plan/preview");
  };

  return (
    <div className='pt-20 px-6 max-w-lg mx-auto text-white'>
      <BackButton to='/plan/length' />
      <CancelPlanButton />
      <h1 className='text-2xl font-bold text-center mb-4'>Anything Else?</h1>
      <p className='text-gray-300 text-center mb-6'>
        Optional — tell us more to fine-tune your plan.
      </p>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder='Add any specific preferences or notes (e.g., avoid squats, prefer morning workouts, etc.)'
        className='w-full h-32 p-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 mb-8'
      />

      <button
        onClick={handleNext}
        className='cursor-pointer w-full py-4 bg-orange-500 hover:bg-orange-600 rounded-lg font-bold transition'
      >
        Review Plan
      </button>
    </div>
  );
}
