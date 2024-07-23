import React, { useState, useEffect, useRef, useCallback } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";

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

const WouldYouRather: React.FC = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const [votedPolls, setVotedPolls] = useState<string[]>([]);
  const [lastVoter, setLastVoter] = useState<{
    name: string;
    optionTitle: string;
  } | null>(null);
  const loader = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch("http://localhost:3333/all-polls");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPolls(data);
        const cookiesVotedPolls = Cookies.get("votedPolls");
        if (cookiesVotedPolls) {
          setVotedPolls(JSON.parse(cookiesVotedPolls));
        }
      } catch (error) {
        console.error("Failed to fetch polls:", error);
      }
    };
    fetchPolls();
  }, []);

  const setupWebSocket = (pollId: string) => {
    wsRef.current = new WebSocket(
      `ws://localhost:3333/polls/${pollId}/results`
    );

    wsRef.current.onmessage = (event) => {
      console.log(`WebSocket message received: ${event.data}`);
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
  };

  useEffect(() => {
    if (polls.length > 0) {
      setupWebSocket(polls[currentIndex].id);
    }
  }, [polls, currentIndex]);

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
        setTransitioning(true);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % polls.length);
      } else if (event.key === "ArrowUp") {
        setTransitioning(true);
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

  useEffect(() => {
    if (transitioning) {
      const timer = setTimeout(() => {
        setTransitioning(false);
      }, 300); // Matches the duration of the transition
      return () => clearTimeout(timer);
    }
  }, [transitioning]);

  const handleVote = async (pollId: string, pollOptionId: string) => {
    if (votedPolls.includes(pollId)) {
      toast.error("You already voted on this poll!");
      return;
    }
    // Optimistically update local state
    setPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll.id === pollId
          ? {
              ...poll,
              options: poll.options.map((option) =>
                option.id === pollOptionId
                  ? { ...option, score: option.score + 1 }
                  : option
              ),
            }
          : poll
      )
    );

    setVotedPolls((prev) => {
      const updated = [...prev, pollId];
      Cookies.set("votedPolls", JSON.stringify(updated), { expires: 30 });
      return updated;
    });

    // Simulate last voter for demonstration purposes
    setLastVoter({ name: "Luis", optionTitle: "Lose a leg" });

    try {
      const response = await fetch(
        `http://localhost:3333/polls/${pollId}/votes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pollOptionId }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Failed to vote. Please try again.");
      }
    } catch (error) {
      console.error("Failed to vote:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const calculatePercentages = (options: PollOption[]) => {
    const totalVotes = options.reduce((sum, option) => sum + option.score, 0);
    return options.map((option) => ({
      ...option,
      percentage:
        totalVotes === 0 ? 0 : Math.round((option.score / totalVotes) * 100),
    }));
  };

  if (polls.length === 0) {
    return (
      <div className="text-white font-bold animate-pulse text-2xl">
        Loading...
      </div>
    );
  }

  const currentPoll = polls[currentIndex];
  const options = calculatePercentages(currentPoll?.options ?? []);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 text-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-center mb-6 font-custom">
          WOULD YOU RATHER
        </h1>
        <div
          className={`flex items-center justify-center relative space-x-3 transition-opacity duration-300 ${
            transitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {options.map((option, index) => (
            <div
              key={option.id}
              className={`option-box p-10 ${
                index === 0
                  ? "bg-custom-hot-gradient"
                  : "bg-custom-cold-gradient"
              } text-white text-center rounded-lg cursor-pointer transition-all duration-1500 overflow-hidden ${
                hovered === (index === 0 ? "left" : "right") ? "w-3/5" : "w-2/5"
              }`}
              onMouseEnter={() => setHovered(index === 0 ? "left" : "right")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleVote(currentPoll.id, option.id)}
              style={{ height: "150px" }}
            >
              <p className="text-2xl font-bold font-custom truncate">
                {option.title}
              </p>
              {votedPolls.includes(currentPoll.id) && (
                <p
                  className={`absolute overflow-visible ${
                    index === 0
                      ? "bottom-full-minus-1 left-1/4 mt-14"
                      : "top-full-minus-1 right-1/4 mt-14"
                  } bg-white text-black rounded-full font-custom text-lg p-3 font-bold shadow-lg`}
                >
                  {option.percentage}%
                </p>
              )}
            </div>
          ))}
          <div
            className={`absolute p-3 text-white bg-gray-900 rounded-full flex items-center justify-center transition-transform duration-1500 ${
              hovered === "right"
                ? "-translate-x-16"
                : hovered === "left"
                ? "translate-x-16"
                : ""
            }`}
          >
            <p className="text-2xl font-bold font-custom">OR</p>
          </div>
        </div>
        {lastVoter && (
          <span className="block mt-4 text-center text-sm text-gray-400">
            {lastVoter.name} has voted "{lastVoter.optionTitle}"
          </span>
        )}
      </div>
      <div ref={loader} className="loader h-5"></div>
    </div>
  );
};

export default WouldYouRather;
