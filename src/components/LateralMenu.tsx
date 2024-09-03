import * as Dialog from "@radix-ui/react-dialog";
import { CreatePollPopUp } from "../components/CreatePollPopUp";
// import { ManagePollPopUp } from "./ManagePollPopUp";
import { useNavigate } from "react-router-dom";
import React from "react";
import { X } from "lucide-react";

export function LateralMenu() {
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate("/");
  };

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger>
          <div>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
        </Dialog.Trigger>
        <Dialog.Content className="bg-slate-800 w-96 p-5 fixed top-0 left-0 h-full shadow-lg">
          <div className="flex space-x-2 items-center text-center align-middle mb-10">
            <img
              className="w-5 rounded-lg"
              src="https://wouldyourather.app/img/svg/app-icon/would-you-rather.ba38edc5da98bd49107c22981e82470a.svg"
            />
            <h1 className="text-slate-400 font-bold text-sm text-center">
              Would You Rather
            </h1>
            <Dialog.Close className="absolute right-0 top-0 p-2 mt-2 text-slate-400 hover:text-red-500">
              <X className="size-4" />
            </Dialog.Close>
          </div>
          <div className="flex flex-col space-y-4">
            <nav className="space-y-4">
              <div className="flex items-center text-grey-200 hover:bg-red-500 hover:text-white rounded-md p-3 transition duration-300 hover:fill-white">
                <button className="flex" onClick={handleSubmit}>
                  <svg
                    className="mr-2"
                    width="24"
                    height="24"
                    fill="currentColor"
                  >
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                  Home
                </button>
              </div>
              <CreatePollPopUp></CreatePollPopUp>
              {/* <ManagePollPopUp></ManagePollPopUp> */}
            </nav>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
