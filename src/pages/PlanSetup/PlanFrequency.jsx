import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlan } from "@/context/PlanContext";
import BackButton from "@/components/BackButton";
import CancelPlanButton from "../../components/CancelPlanButton";

const options = ["2", "3", "4", "5", "6"];

export default function PlanFrequency() {
  const navigate = useNavigate();
  const { plan, updatePlan } = usePlan();
  const [selected, setSelected] = useState(plan?.frequency || "");

  const handleNext = () => {
    if (!selected) return;
    updatePlan({ ...plan, weeklyFrequency: selected });
    navigate("/plan/equipment");
  };

  return (
    <div className='pt-20 px-6 max-w-lg mx-auto relative'>
      <BackButton to='/plan' />
      <CancelPlanButton />

      <h1 className='text-2xl font-bold text-center text-white mb-6'>
        How Many Days Per Week Do You Want To Workout?
      </h1>

      <div className='flex flex-col gap-3 py-2 items-center'>
        {options.map((days) => (
          <button
            key={days}
            className={`px-4 py-2 rounded-full w-full max-w-xs ${
              selected === days
                ? "bg-orange-500 text-white"
                : "bg-gray-800 text-white"
            }`}
            onClick={() => setSelected(days)}
          >
            {days} Days
          </button>
        ))}
      </div>

      <p className='text-gray-300 text-center mt-4'>
        Choose a schedule that fits your lifestyle.
      </p>

      <div className='mt-10'>
        <button
          onClick={handleNext}
          disabled={!selected}
          className={`w-full py-4 rounded-lg font-bold tracking-wide ${
            selected
              ? "bg-orange-500 hover:bg-orange-600 text-white transition"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>

      {/* <button
        className='absolute top-6 left-6 text-gray-300 text-xl'
        onClick={() => navigate("/plan")}
      >
        ←
      </button> */}
    </div>
  );
}
