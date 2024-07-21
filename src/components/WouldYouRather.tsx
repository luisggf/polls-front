import React, { useState, useEffect, useRef, useCallback } from "react";

const WouldYouRather: React.FC = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [polls, setPolls] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const loader = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch("http://localhost:3333/all-polls");
        if (!response.ok) {
          throw new Error("COuldnt get response from promise");
        }
        const data = await response.json();
        setPolls(data);
      } catch (error) {
        console.error("Failed to fetch polls:", error);
      }
    };
    fetchPolls();
  }, []);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && polls.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % polls.length);
      }
    },
    [polls.length]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [handleObserver]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (polls.length > 0) {
      if (event.key === "ArrowDown") {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % polls.length);
      } else if (event.key === "ArrowUp") {
        setCurrentIndex(
          (prevIndex) => (prevIndex - 1 + polls.length) % polls.length
        );
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [polls.length]);

  if (polls.length === 0) {
    return (
      <div className="text-white font-bold animate-pulse text-2xl">
        Loading...
      </div>
    );
  }

  const currentPoll = polls[currentIndex];
  const options = currentPoll?.options ?? [];

  return (
    <div className="w-full max-w-2xl mx-auto p-6 text-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-center mb-6 font-custom">
          WOULD YOU RATHER
        </h1>
        <div className="flex items-center justify-center relative space-x-3">
          <div
            className={`option-box p-10 bg-custom-hot-gradient text-white text-center rounded-lg cursor-pointer transition-all duration-500 overflow-hidden ${
              hovered === "left" ? "w-3/5" : "w-2/5"
            }`}
            onMouseEnter={() => setHovered("left")}
            onMouseLeave={() => setHovered(null)}
            style={{ height: "150px" }}
          >
            <p className="text-2xl font-bold font-custom truncate">
              {options[0]?.title}
            </p>
          </div>
          <div
            className={`absolute p-3 text-white bg-gray-900 rounded-full flex items-center justify-center transition-transform duration-500 ${
              hovered === "right"
                ? "-translate-x-16"
                : hovered === "left"
                ? "translate-x-16"
                : ""
            }`}
          >
            <p className="text-2xl font-bold font-custom">OR</p>
          </div>
          <div
            className={`option-box p-10 bg-custom-cold-gradient text-white text-center rounded-lg cursor-pointer transition-all duration-500 overflow-hidden ${
              hovered === "right" ? "w-3/5" : "w-2/5"
            }`}
            onMouseEnter={() => setHovered("right")}
            onMouseLeave={() => setHovered(null)}
            style={{ height: "150px" }}
          >
            <p className="text-2xl font-bold font-custom truncate">
              {options[1]?.title}
            </p>
          </div>
        </div>
      </div>
      <div ref={loader} className="loader h-5"></div>
    </div>
  );
};

export default WouldYouRather;
