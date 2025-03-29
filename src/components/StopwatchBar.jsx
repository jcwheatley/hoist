import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStopwatch,
  faRedo,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";

export default function StopwatchBar() {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (milliseconds) => {
    const totalSeconds = milliseconds / 1000;
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = (totalSeconds % 60).toFixed(2).padStart(5, "0");
    return `${minutes}:${seconds}`;
  };
  return (
    <div className='fixed bottom-16 left-0 w-full bg-[#0A0E15] text-white flex justify-between items-center px-6 py-4 z-40 shadow-md'>
      <div className='text-2xl font-mono flex items-center gap-2'>
        <FontAwesomeIcon icon={faStopwatch} className='text-orange-400' />
        {formatTime(timer)}
      </div>

      <div className='flex items-center gap-4'>
        <button
          onClick={() => {
            setTimer(0);
            setIsRunning(false);
          }}
          className='text-white hover:text-red-400'
        >
          <FontAwesomeIcon icon={faRedo} className='text-xl' />
        </button>
        <button
          onClick={() => setIsRunning((prev) => !prev)}
          className='text-white hover:text-green-400'
        >
          <FontAwesomeIcon
            icon={isRunning ? faPause : faPlay}
            className='text-xl'
          />
        </button>
      </div>
    </div>
  );
}
