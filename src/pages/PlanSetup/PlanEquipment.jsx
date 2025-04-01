import { useState } from "react";
import { usePlan } from "@/context/PlanContext";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton";
import CancelPlanButton from "../../components/CancelPlanButton";

const equipmentOptions = [
  "None (Bodyweight Only)",
  "Dumbbells",
  "Barbell",
  "Resistance Bands",
  "Pull-up Bar",
  "Bench",
  "Full Gym Access",
];

export default function PlanEquipment() {
  const navigate = useNavigate();
  const { plan, updatePlan } = usePlan();
  const [selectedEquipment, setSelectedEquipment] = useState(
    plan?.equipment || []
  );

  const toggleEquipment = (item) => {
    setSelectedEquipment((prev) =>
      prev.includes(item) ? prev.filter((eq) => eq !== item) : [...prev, item]
    );
  };

  const handleNext = () => {
    if (selectedEquipment.length === 0) return;
    updatePlan({ ...plan, equipment: selectedEquipment });
    navigate("/plan/goal");
  };

  return (
    <div className='pt-20 px-6 max-w-lg mx-auto text-white'>
      <BackButton to='/plan/frequency' />
      <CancelPlanButton />

      <h1 className='text-2xl font-bold text-center mb-4'>
        What Equipment Do You Have?
      </h1>
      <p className='text-gray-300 text-center mb-6'>Select all that apply.</p>

      <div className='flex flex-col gap-3 mb-10'>
        {equipmentOptions.map((item) => (
          <button
            key={item}
            type='button'
            onClick={() => toggleEquipment(item)}
            className={`cursor-pointer w-full px-4 py-3 rounded-lg text-left transition ${
              selectedEquipment.includes(item)
                ? "bg-orange-500 text-white"
                : "bg-gray-800 text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={selectedEquipment.length === 0}
        className={`cursor-pointer w-full py-4 rounded-lg font-bold transition ${
          selectedEquipment.length === 0
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-orange-500 hover:bg-orange-600"
        }`}
      >
        Next
      </button>
    </div>
  );
}
