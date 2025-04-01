import { useNavigate } from "react-router-dom";
import { useWorkout } from "@/context/WorkoutContext";

export default function ActiveWorkoutChip() {
  const { activeWorkout, stopWorkout } = useWorkout();
  const navigate = useNavigate();

  if (!activeWorkout) return null;

  const currentExercise =
    activeWorkout.exercises?.find((ex) => !ex.done) ??
    activeWorkout.exercises?.[0];

  const currentSetIndex = currentExercise?.sets.findIndex(
    (set) => !set.completed
  );

  const currentSetNumber =
    currentSetIndex === -1 ? currentExercise?.sets.length : currentSetIndex + 1;

  return (
    <div className='fixed bottom-20 w-full px-4 z-40'>
      <div className='bg-[#1F2A3A] text-white rounded-md px-4 py-3 flex justify-between items-center max-w-md mx-auto'>
        <div>
          <p className='font-bold text-sm'>ACTIVE WORKOUT</p>
          <p className='text-sm'>{currentExercise?.name ?? "Workout"}</p>
          <p className='text-xs text-gray-400'>
            Set {currentSetNumber} of {currentExercise?.sets.length}
          </p>
        </div>
        <div className='flex gap-4'>
          <button onClick={stopWorkout} className='text-sm text-gray-300'>
            Stop
          </button>
          <button
            onClick={() => navigate("/workout")}
            className='text-sm text-blue-400'
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}
