import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/utils/firebase";
import { signOut } from "firebase/auth";

export default function Profile() {
  const [user] = useAuthState(auth);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className='min-h-screen text-white px-6 pt-24'>
      <div className='max-w-md mx-auto text-center'>
        {/* Profile Image */}
        <div className='flex justify-center mb-4'>
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt='Profile'
              className='w-24 h-24 rounded-full border-4 border-white'
            />
          ) : (
            <div className='w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-3xl font-bold'>
              {user?.displayName?.[0] || "?"}
            </div>
          )}
        </div>

        {/* Display Name / Email */}
        <h2 className='text-2xl font-bold'>
          {user?.displayName || "Username"}
        </h2>
        <p className='text-gray-400 text-sm mt-1'>{user?.email}</p>

        {/* Placeholder Sections */}
        <div className='mt-8 space-y-4'>
          <div className='bg-[#1a1f29] p-4 rounded-lg shadow'>
            <h3 className='font-semibold text-lg'>Edit Profile</h3>
            <p className='text-gray-400 text-sm'>Coming soon...</p>
          </div>

          <div className='bg-[#1a1f29] p-4 rounded-lg shadow'>
            <h3 className='font-semibold text-lg'>Settings</h3>
            <p className='text-gray-400 text-sm'>Coming soon...</p>
          </div>

          <button
            onClick={handleSignOut}
            className='mt-8 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition'
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
