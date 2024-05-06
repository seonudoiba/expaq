import { HiCheck, HiExclamation, HiX } from "react-icons/hi";
import { Toast } from "flowbite-react";

interface ToastProps {
    message: string;
  }

const Success = ({ message }: ToastProps) => {
  return (
    <Toast>
    {/* Icon container */}
    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
      {/* Icon */}
      <HiCheck className="h-5 w-5" />
    </div>
    
    {/* Message */}
    <div className="ml-3 text-sm font-normal">{message}</div>
    
    {/* Toggle button */}
    <Toast.Toggle />
  </Toast>
  )
}

Success.propTypes = {}

export default Success