import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();

export const saveWorkoutPlan = async (workouts) => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('User not logged in');

  const planRef = doc(db, 'users', user.uid, 'workout', 'plan');
  await setDoc(planRef, {
    workouts,
    createdAt: Date.now(),
    currentIndex: 0, // track which workout is next
  });
};
