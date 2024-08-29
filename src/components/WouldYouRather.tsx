import { useState, useEffect, useRef, useCallback } from "react";
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

export default function WouldYouRather() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const [votedPolls, setVotedPolls] = useState<string[]>([]);
  const [lastVoter, setLastVoter] = useState<{
    name: string;
    optionTitle: string;
  } | null>(null);
  const [animationClass, setAnimationClass] = useState<string>("");

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
        setAnimationClass("animate__animated animate__fadeInDown");
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % polls.length);
        }, 150); // delay for fadeOut animation before changing index
      } else if (event.key === "ArrowUp") {
        setTransitioning(true);
        setAnimationClass("animate__animated animate__fadeInUp");
        setTimeout(() => {
          setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + polls.length) % polls.length
          );
        }, 150); // delay for fadeOut animation before changing index
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
        setAnimationClass(""); // reset animation class after transition
      }, 500); // Matches the duration of the transition
      return () => clearTimeout(timer);
    }
  }, [transitioning]);

  const handleVote = async (pollId: string, pollOptionId: string) => {
    if (votedPolls.includes(pollId)) {
      toast.error("You already voted on this poll!");
      return;
    }

    const voterName = Cookies.get("username") || "Anonymous";

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

    // Set the last voter with the name from the cookies
    const selectedOption = polls
      .find((poll) => poll.id === pollId)
      ?.options.find((option) => option.id === pollOptionId)?.title;

    setLastVoter({ name: voterName, optionTitle: selectedOption || "" });

    // Set a timeout to remove the last voter message after 5 seconds
    setTimeout(() => {
      setLastVoter(null);
    }, 5000);

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
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="text-center mb-20">
        <h1 className="text-6xl font-extrabold tracking-tight">WOULD YOU</h1>
        <span className="text-transparent text-9xl font-black bg-clip-text bg-custom-hot-cold-gradient">
          RATHER
        </span>
      </div>
      <div
        className={`flex items-center justify-center relative space-x-2 transition-opacity duration-300 ${
          transitioning ? "opacity-0" : "opacity-100"
        } ${animationClass}`}
      >
        {options.map((option, index) => (
          <div
            key={option.id}
            className={`option-box p-10 ${
              index === 0 ? "bg-custom-hot-gradient" : "bg-custom-cold-gradient"
            } text-slate-100 text-center rounded-lg cursor-pointer flex items-center justify-center transition-transform duration-500 relative`}
            onMouseEnter={() => setHovered(index === 0 ? "left" : "right")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handleVote(currentPoll.id, option.id)}
            style={{
              height: "250px",
              width:
                hovered === (index === 0 ? "left" : "right") ? "60%" : "40%", // Using percentages for dynamic widths
              transition: "width 0.5s ease-in-out", // Adding transition effect for width change
            }}
          >
            <p className="text-sm text-slate-100 font-medium overflow-hidden drop-shadow-lg text-ellipsis">
              {option.title}
            </p>
            {votedPolls.includes(currentPoll.id) && (
              <p
                className="absolute left-1/2 transform -translate-x-1/2 bottom-2 bg-white text-slate-900 font-bold py-1 px-3 rounded-full drop-shadow-lg"
                style={{ width: "auto" }}
              >
                {option.percentage}%
              </p>
            )}
          </div>
        ))}

        <div
          className={`absolute p-3 text-white bg-gray-900 rounded-full flex items-center justify-center transition-transform duration-1500 ${
            hovered === "right"
              ? "-translate-x-24"
              : hovered === "left"
              ? "translate-x-24"
              : ""
          }`}
          style={{ transition: "0.5s ease-in-out" }}
        >
          <p className="text-2xl font-bold">OR</p>
        </div>
      </div>

      {votedPolls.includes(currentPoll.id) && (
        <p className="absolute left-1/3 bottom-1/5 mt-2 text-slate-400 font-medium text-xs">
          Already voted
        </p>
      )}
      {lastVoter && (
        <div className="text-center mt-4">
          <p className="text-slate-400 font-medium text-xs">
            {lastVoter.name} just voted for "{lastVoter.optionTitle}"
          </p>
        </div>
      )}

      <div ref={loader} />
    </div>
  );
}
