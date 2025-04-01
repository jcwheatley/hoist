import { Link, useLocation } from "react-router-dom";
import ActiveWorkoutChip from "@/components/ActiveWorkoutChip";
import Footer from "@/components/Footer";
import { useWorkout } from "@/hooks/useWorkout";

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const { showDiscardModal, confirmDiscardWorkout, cancelDiscardWorkout } =
    useWorkout();

  const hideLogoRoutes = ["/workout/ai", "/workout", "/plan"];
  const hideLogo = hideLogoRoutes.some((route) => pathname.startsWith(route));

  const chipHiddenRoutes = ["/plan", "/workout"];
  const hideWorkoutChip = chipHiddenRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const footerHiddenRoutes = ["/plan"];
  const hideFooter = footerHiddenRoutes.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <div
      className={
        "min-h-screen pb-16 bg-gray-900 text-white" +
        (!hideLogo ? " pt-16" : "")
      }
    >
      {!hideLogo && (
        <header className='fixed bg-gray-900 top-0 left-0 w-full z-50 px-4 py-3'>
          <Link to='/dashboard'>
            <h1 className='text-xl font-extrabold tracking-wide'>HOIST</h1>
          </Link>
        </header>
      )}
      <div>{children}</div>

      {showDiscardModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
          <div className='bg-[#1F2A3A] text-white p-6 rounded-lg max-w-sm w-[90%] shadow-xl'>
            <h2 className='text-lg font-bold mb-3'>Discard Active Workout?</h2>
            <p className='text-sm text-gray-300 mb-6'>
              You have a workout in progress. Starting a new one will discard
              it.
            </p>
            <div className='flex justify-end gap-3'>
              <button
                onClick={cancelDiscardWorkout}
                className='px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm'
              >
                Cancel
              </button>
              <button
                onClick={confirmDiscardWorkout}
                className='px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-semibold'
              >
                Discard & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {!hideWorkoutChip && <ActiveWorkoutChip />}
      {!hideFooter && <Footer />}
    </div>
  );
}
