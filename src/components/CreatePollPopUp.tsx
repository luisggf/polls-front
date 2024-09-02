import { X, CheckCircle } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export function CreatePollPopUp(): JSX.Element {
  const [isSubmitted, setIsSubmitted] = useState(false); // State to manage form submission
  const [username, setUsername] = useState(""); // State to manage input field
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission

    if (username.trim()) {
      setIsSubmitted(true); // Set form as submitted to trigger animation

      // Save username in cookies
      Cookies.set("username", username.trim(), { expires: 30 });

      // Wait for the animation to complete before navigating
      setTimeout(() => {
        // Navigate to the WouldYouRather component
        navigate("/would-you-rather");
        setIsSubmitted(false); // Reset form state after navigation
      }, 1000); // Adjust the delay to match your animation duration (e.g., 1000ms)
    } else {
      // Show toast notification if username is empty
      toast.error("Nickname is required!"); // Display error message
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="flex w-full items-center text-grey-200 hover:bg-red-500 hover:text-white rounded-md p-3 transition duration-300 hover:fill-white">
          <svg
            width="24"
            height="24"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path
              d="M2 3.5C2 3.22386 2.22386 3 2.5 3H12.5C12.7761 3 13 3.22386 13 3.5V9.5C13 9.77614 12.7761 10 12.5 10H2.5C2.22386 10 2 9.77614 2 9.5V3.5ZM2 10.9146C1.4174 10.7087 1 10.1531 1 9.5V3.5C1 2.67157 1.67157 2 2.5 2H12.5C13.3284 2 14 2.67157 14 3.5V9.5C14 10.1531 13.5826 10.7087 13 10.9146V11.5C13 12.3284 12.3284 13 11.5 13H3.5C2.67157 13 2 12.3284 2 11.5V10.9146ZM12 11V11.5C12 11.7761 11.7761 12 11.5 12H3.5C3.22386 12 3 11.7761 3 11.5V11H12ZM5 6.5C5 6.22386 5.22386 6 5.5 6H7V4.5C7 4.22386 7.22386 4 7.5 4C7.77614 4 8 4.22386 8 4.5V6H9.5C9.77614 6 10 6.22386 10 6.5C10 6.77614 9.77614 7 9.5 7H8V8.5C8 8.77614 7.77614 9 7.5 9C7.22386 9 7 8.77614 7 8.5V7H5.5C5.22386 7 5 6.77614 5 6.5Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
          Create a Poll
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/70" />
        <Dialog.Content className="overflow-hidden fixed inset-0 w-full flex flex-col items-center justify-center ">
          <div className="relative rounded-xl bg-gray-900 shadow-sm w-96 p-10 space-y-10">
            <Dialog.Close className="absolute right-0 top-0 p-1 text-slate-400 hover:text-red-500">
              <X className="size-4" />
            </Dialog.Close>
            <div className="text-left">
              <h3 className="text-2xl font-medium text-slate-100">
                Before we{" "}
                <span className="text-2xl font-black text-red-500">
                  start...
                </span>
              </h3>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label
                  className="text-sm text-slate-200 font-normal leading-none"
                  htmlFor="username"
                >
                  Nickname
                </label>
                <input
                  className="block w-full text-slate-900 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  id="username"
                  placeholder="Enter a nickname"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <button
                className={`w-full rounded-lg ${
                  isSubmitted
                    ? "bg-red-500 animate-bounceIn"
                    : "bg-slate-800 hover:bg-red-500"
                } text-slate-200 py-2 text-sm font-medium transition-all`}
                type="submit"
              >
                {isSubmitted ? (
                  <CheckCircle className="w-5 h-5 mx-auto" />
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
