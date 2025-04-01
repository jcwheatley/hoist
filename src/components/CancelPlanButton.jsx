import { useNavigate } from "react-router-dom";
import { usePlan } from "@/context/PlanContext";

export default function CancelPlanButton() {
  const navigate = useNavigate();
  const { clearPlan } = usePlan();

  const handleCancel = () => {
    clearPlan();
    navigate("/dashboard");
  };

  return (
    <button
      onClick={handleCancel}
      className='absolute top-4 right-6 text-gray-300 text-xl hover:text-white transition'
      aria-label='Cancel workout plan setup'
    >
      ✕
    </button>
  );
}
