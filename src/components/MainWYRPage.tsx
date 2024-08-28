import React, { useEffect, useRef, useState } from "react";
import { NamePopUp } from "./NamePopUp.tsx";

interface PollOption {
  id: string;
  title: string;
  score: number;
}

interface Poll {
  id: string;
  title: string;
  options: PollOption[];
}

const LandingPage: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [currentPollIndex, setCurrentPollIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [animateOut, setAnimateOut] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<
    "left" | "right"
  >("right");
  const [triggerPulse, setTriggerPulse] = useState(false);

  const handleAnimationReset = () => {
    setAnimateOut(false);
  };

  const switchPoll = (direction: "left" | "right") => {
    setTriggerPulse(true); // Trigger pulse animation
    setTimeout(() => setTriggerPulse(false), 1000);
    setAnimationDirection(direction);
    setAnimateOut(true);
    setTimeout(() => {
      setCurrentPollIndex((prevIndex) =>
        direction === "left"
          ? (prevIndex + 1) % polls.length
          : (prevIndex - 1 + polls.length) % polls.length
      );
      handleAnimationReset();
    }, 500);
  };

  useEffect(() => {
    const fetchPopularPolls = async () => {
      try {
        const response = await fetch("http://localhost:3333/popular-polls");
        const data = await response.json();
        setPolls(data);
      } catch (error) {
        console.error("Error fetching popular polls:", error);
      }
    };

    fetchPopularPolls();
  }, []);

  useEffect(() => {
    if (polls.length > 0) {
      const setupWebSocket = (pollId: string) => {
        wsRef.current = new WebSocket(
          `ws://localhost:3333/polls/${pollId}/results`
        );

        wsRef.current.onmessage = (event) => {
          const { pollId, pollOptionId, votes } = JSON.parse(event.data);
          setPolls((prevPolls) =>
            prevPolls.map((poll) =>
              poll.id === pollId
                ? {
                    ...poll,
                    options: poll.options.map((option) =>
                      option.id === pollOptionId
                        ? { ...option, score: votes }
                        : option
                    ),
                  }
                : poll
            )
          );
        };

        wsRef.current.onopen = () => {
          console.log("WebSocket connection established");
        };

        wsRef.current.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        wsRef.current.onclose = () => {
          console.log("WebSocket connection closed");
        };
      };

      setupWebSocket(polls[currentPollIndex].id);

      intervalRef.current = setInterval(() => {
        switchPoll("left");
      }, 5000);

      return () => {
        if (wsRef.current) {
          wsRef.current.close();
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [polls, currentPollIndex]);

  useEffect(() => {
    if (polls.length > 0) {
      const timer = setTimeout(() => {
        switchPoll("left");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentPollIndex, polls.length]);

  const handlePollChange = (index: number) => {
    setTriggerPulse(true); // Trigger pulse animation
    setTimeout(() => setTriggerPulse(false), 1000);
    if (index > currentPollIndex) {
      setAnimationDirection("right");
    } else {
      setAnimationDirection("left");
    }

    setAnimateOut(true);
    setTimeout(() => {
      setCurrentPollIndex(index);
      handleAnimationReset();
    }, 500);
  };

  if (polls.length === 0) {
    return <div>Loading...</div>;
  }

  const currentPoll = polls[currentPollIndex];

  return (
    <div className="min-h-screen text-white flex flex-col justify-between items-center py-10 relative">
      {/* SVG Background */}
      <div className="absolute top-1/2 right-1/3 size-3/4 transform -translate-y-1/2 opacity-5">
        <img src="../../src/assets/abstract2.svg" alt="Abstract Background" />
      </div>
      <div className="text-center">
        <h1 className="text-6xl font-extrabold tracking-tight">WOULD YOU </h1>
        <span className="text-transparent text-9xl font-black bg-clip-text bg-custom-hot-cold-gradient">
          RATHER
        </span>
      </div>
      <div className="flex space-x-10">
        <div>
          <p className="mt-4 text-2xl font-extrabold">
            ENGAGE, CHOOSE, DISCOVER
          </p>
          <p className="text-sm text-gray-400 max-w-xs mx-auto">
            Dive into intriguing questions and see what choices others make.
            What would you rather?
          </p>
        </div>

        <div className="flex flex-col items-center">
          <p className="mb-1 text-gray-400 text-sm">Most popular</p>
          <div
            className={`grid grid-cols-2 gap-x-3 gap-y-1 transition-all duration-500 ease-in-out ${
              animateOut
                ? animationDirection === "right"
                  ? "animate-slideOutRight opacity-0"
                  : "animate-slideOutLeft opacity-0"
                : animationDirection === "right"
                ? "animate-slideInLeft opacity-100"
                : "animate-slideInRight opacity-100"
            }`}
          >
            {currentPoll.options.map((option, index) => (
              <div
                key={option.id}
                className={`p-3 flex items-center justify-center ${
                  index === 0
                    ? "bg-custom-hot-gradient"
                    : "bg-custom-cold-gradient"
                } text-white text-center rounded-xl cursor-pointer shadow-sm`}
                style={{ width: "200px", height: "120px" }}
              >
                <p
                  className="text-sm text-gray-200 overflow-hidden text-ellipsis"
                  style={{
                    whiteSpace: "nowrap",
                    maxWidth: "100%",
                    textOverflow: "ellipsis",
                  }}
                >
                  {option.title}
                </p>
              </div>
            ))}
          </div>

          <div
            className={`mt-1 flex container items-center ${
              triggerPulse ? "animate-pulseSmooth" : ""
            }`}
          >
            <p className="ml-4 text-sm text-gray-400 flex-1 basis-1/3">
              Votos:{" "}
              {currentPoll.options.reduce(
                (acc, option) => acc + option.score,
                0
              )}
            </p>

            <div className="ml-12 flex space-x-2 basis-2/3">
              {polls.map((_, index) => (
                <div
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full cursor-pointer ${
                    index === currentPollIndex ? "bg-orange-500" : "bg-gray-100"
                  }`}
                  onClick={() => handlePollChange(index)}
                ></div>
              ))}
            </div>
            <div className="basis-1"></div>
          </div>
        </div>
      </div>
      <NamePopUp></NamePopUp>
    </div>
  );
};

export default LandingPage;
