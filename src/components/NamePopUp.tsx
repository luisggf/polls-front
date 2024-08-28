// NamePopUp.tsx
import { X, CheckCircle } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

export function NamePopUp(): JSX.Element {
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

      // Navigate to the WouldYouRather component
      navigate("/would-you-rather");

      // Hide the success state after a few seconds
      setTimeout(() => {
        setIsSubmitted(false); // Reset form state after a delay
      }, 2000);
    } else {
      // Show toast notification if username is empty
      toast.error("Nickname is required!"); // Display error message
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className="py-6 px-14 rounded-lg text-md font-semibold tracking-wide text-grey-200 bg-transparent border-2 hover:animate-pulseGradient focus:outline-none"
          style={{
            borderImageSource:
              "linear-gradient(80deg, #EF2525 20%, #FF5500 35%, #FF753B 45%, #00B3ff 60%, #0093ff 80%, #005EFE 100%)",
            borderImageSlice: 1,
          }}
        >
          Start Now...
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
                className={`w-full rounded-lg bg-slate-800 text-slate-200 py-2 text-sm font-medium transition-all ${
                  isSubmitted
                    ? "animate-bounceIn bg-red-500"
                    : "hover:bg-red-500"
                }`}
                type="submit"
              >
                {isSubmitted ? (
                  <CheckCircle className="w-5 h-5 mx-auto bg-red-500" />
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
