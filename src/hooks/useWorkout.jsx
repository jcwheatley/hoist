// src/hooks/useWorkout.js
import { useContext } from "react";
import { WorkoutContext } from "@/context/WorkoutContextValue";

export function useWorkout() {
  return useContext(WorkoutContext);
}
