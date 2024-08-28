import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

export function NamePopUp(): JSX.Element {
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
          <div className="relative rounded-xl  bg-gray-900 shadow-sm w-96 p-10 space-y-10">
            <Dialog.Close className="absolute right-0 top-0 p-1 text-slate-400 hover:text-red-500 ">
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
            <form className="space-y-4">
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
                  required
                />
              </div>
              <button
                className="w-full rounded-lg bg-slate-800 text-slate-200 py-2 text-sm font-medium hover:bg-red-500 transition-colors"
                type="submit"
              >
                Submit
              </button>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
