import { createContext, useContext, useState, useEffect } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const PlanContext = createContext();
const db = getFirestore();

export const PlanProvider = ({ children }) => {
  const [plan, setPlan] = useState(() => {
    const stored = localStorage.getItem("workoutPlan");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  // Load plan from Firestore on first render
  useEffect(() => {
    const fetchPlan = async () => {
      const user = getAuth().currentUser;
      if (!user) return setLoading(false);

      const planRef = doc(db, "users", user.uid, "workout", "plan");
      const docSnap = await getDoc(planRef);

      if (docSnap.exists()) {
        const firestorePlan = docSnap.data();
        setPlan(firestorePlan);
        localStorage.setItem("workoutPlan", JSON.stringify(firestorePlan));
      }

      setLoading(false);
    };

    fetchPlan();
  }, []);

  const updatePlan = async (updates) => {
    const user = getAuth().currentUser;
    if (!user) return;

    const updated = { ...plan, ...updates };
    setPlan(updated);
    localStorage.setItem("workoutPlan", JSON.stringify(updated));

    const planRef = doc(db, "users", user.uid, "workout", "plan");
    await setDoc(planRef, updated, { merge: true });
  };

  const clearPlan = async () => {
    setPlan(null);
    localStorage.removeItem("workoutPlan");

    const user = getAuth().currentUser;
    if (user) {
      const planRef = doc(db, "users", user.uid, "workout", "plan");
      await setDoc(planRef, {});
    }
  };

  const markWorkoutComplete = async () => {
    const user = getAuth().currentUser;
    if (!user || !plan) return;

    const planRef = doc(db, "users", user.uid, "workout", "plan");
    const newIndex = (plan.currentIndex || 0) + 1;

    const updated = { ...plan, currentIndex: newIndex };
    setPlan(updated);
    localStorage.setItem("workoutPlan", JSON.stringify(updated));

    await updateDoc(planRef, {
      currentIndex: increment(1),
    });
  };

  const currentIndex = plan?.currentIndex || 0;
  const workouts = plan?.workouts || [];
  const todayWorkout = workouts[currentIndex] || null;
  const hasNextWorkout = currentIndex < workouts.length;

  return (
    <PlanContext.Provider
      value={{
        plan,
        updatePlan,
        clearPlan,
        markWorkoutComplete,
        todayWorkout,
        currentIndex,
        hasNextWorkout,
        loading,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => useContext(PlanContext);
