import { useState } from "react";
import { usePlan } from "@/context/PlanContext";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton";
import CancelPlanButton from "../../components/CancelPlanButton";

export default function PlanLength() {
  const navigate = useNavigate();
  const { plan, updatePlan } = usePlan();
  const [weeks, setWeeks] = useState(plan.planLength || 6);

  const handleNext = () => {
    updatePlan({ ...plan, planLengthInWeeks: weeks });
    navigate("/plan/notes");
  };

  return (
    <div className='pt-20 px-6 max-w-lg mx-auto text-white'>
      <BackButton to='/plan/goal' />
      <CancelPlanButton />
      <h1 className='text-2xl font-bold text-center mb-4'>
        How Long Should Your Plan Be?
      </h1>
      <p className='text-gray-300 text-center mb-6'>
        Slide to set your plan duration.
      </p>

      <div className='flex flex-col items-center space-y-4 mb-10'>
        <input
          type='range'
          min='4'
          max='8'
          step='1'
          value={weeks}
          onChange={(e) => setWeeks(parseInt(e.target.value))}
          className='w-full'
        />
        <div className='text-orange-500 text-lg font-semibold'>
          {weeks} Weeks
        </div>
        <div className='flex justify-between text-gray-400 w-full text-sm px-2'>
          {[4, 6, 8].map((val) => (
            <span key={val}>{val}</span>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        className='w-full py-4 bg-orange-500 hover:bg-orange-600 rounded-lg font-bold transition'
      >
        Next
      </button>
    </div>
  );
}
