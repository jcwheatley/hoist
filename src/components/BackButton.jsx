import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function BackButton({ to }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className='absolute top-[18px] left-4 text-gray-300 hover:text-white flex items-center'
    >
      <FontAwesomeIcon icon={faArrowLeft} className='w-4 h-4 mr-2' />
      Back
    </button>
  );
}
