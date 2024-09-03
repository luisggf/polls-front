import { useState, useEffect, useRef, useCallback } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { LateralMenu } from "./LateralMenu";

interface PollOption {
  id: string;
  title: string;
  score: number;
}

interface Poll {
  id: string;
  options: PollOption[];
}

export default function WouldYouRather() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const [votedPolls, setVotedPolls] = useState<string[]>([]);
  const [animationDirection, setAnimationDirection] = useState<string>("");
  const [viewedPollsCount, setViewedPollsCount] = useState<number>(0);

  const loader = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const offsetRef = useRef<number>(0);
  const limitRef = useRef<number>(4);

  // Fetch polls with the correct offset and limit
  const fetchPolls = async (offset: number, limit: number) => {
    try {
      const response = await fetch(
        `http://localhost:3333/polls-scroll?offset=${offset}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched polls:", data);
      setPolls((prevPolls) => [...prevPolls, ...data]);

      const cookiesVotedPolls = Cookies.get("votedPolls");
      if (cookiesVotedPolls) {
        setVotedPolls(JSON.parse(cookiesVotedPolls));
      }
    } catch (error) {
      console.error("Failed to fetch polls:", error);
    }
  };

  useEffect(() => {
    fetchPolls(offsetRef.current, limitRef.current);
  }, []);

  const setupWebSocket = (pollId: string) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    wsRef.current = new WebSocket(
      `ws://localhost:3333/polls/${pollId}/results`
    );

    wsRef.current.onmessage = (event) => {
      const {
        pollId: messagePollId,
        pollOptionId,
        votes,
        username,
      } = JSON.parse(event.data);

      if (pollId !== messagePollId) return;

      setPolls((prevPolls) =>
        prevPolls.map((poll) =>
          poll.id === messagePollId
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

      const currentPoll = polls.find((poll) => poll.id === messagePollId);
      const selectedOptionTitle = currentPoll?.options.find(
        (option) => option.id === pollOptionId
      )?.title;

      if (username && selectedOptionTitle && currentPoll) {
        toast.info(`${username} just voted for "${selectedOptionTitle}"`);
      }
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
      if (target.isIntersecting) {
        handleLoadMore();
      }
    },
    [polls.length]
  );

  const handleLoadMore = () => {
    setTransitioning(true);
    setAnimationDirection("right");
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % polls.length);
      setTransitioning(false);
      setViewedPollsCount((prevCount) => prevCount + 1);

      if (viewedPollsCount + 1 >= offsetRef.current + limitRef.current) {
        offsetRef.current += limitRef.current;
        fetchPolls(offsetRef.current, limitRef.current);
      }
    }, 500);
  };

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
        setAnimationDirection("down");
        setTimeout(() => {
          const nextIndex = (currentIndex + 1) % polls.length;
          setCurrentIndex(nextIndex);
          setTransitioning(false);
          setViewedPollsCount((prevCount) => {
            const newCount = prevCount + 1;
            if (newCount >= offsetRef.current + limitRef.current) {
              offsetRef.current += limitRef.current;
              fetchPolls(offsetRef.current, limitRef.current);
            }
            return newCount;
          });
        }, 500);
      } else if (event.key === "ArrowUp") {
        setTransitioning(true);
        setAnimationDirection("up");
        setTimeout(() => {
          const prevIndex = (currentIndex - 1 + polls.length) % polls.length;
          setCurrentIndex(prevIndex);
          setTransitioning(false);
        }, 500);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [polls.length, currentIndex]);

  const handleVote = async (pollId: string, pollOptionId: string) => {
    if (votedPolls.includes(pollId)) {
      toast.error("You already voted on this poll!");
      return;
    }

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

    setVotedPolls((prevVotedPolls) => [...prevVotedPolls, pollId]);
    Cookies.set("votedPolls", JSON.stringify([...votedPolls, pollId]));

    try {
      const response = await fetch(
        `http://localhost:3333/polls/${pollId}/votes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
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
    <>
      <div className="absolute top-0 left-0 m-4">
        <LateralMenu></LateralMenu>
      </div>
      <div className="w-full max-w-5xl mx-auto p-6">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-extrabold tracking-tight">WOULD YOU</h1>
          <span className="text-transparent text-9xl font-black bg-clip-text bg-custom-hot-cold-gradient">
            RATHER
          </span>
        </div>
        <div
          className={`flex items-center justify-center relative space-x-2 transition-all duration-500 ease-in-out ${
            transitioning
              ? animationDirection === "right"
                ? "animate-slideOutRight opacity-0"
                : animationDirection === "down"
                ? "animate-fadeOutDown opacity-0"
                : "animate-fadeOutUp opacity-0"
              : animationDirection === "right"
              ? "animate-slideInLeft opacity-100"
              : animationDirection === "down"
              ? "animate-fadeInDown opacity-100"
              : "animate-fadeInUp opacity-100"
          }`}
        >
          {options.map((option, index) => (
            <div
              key={option.id}
              className={`option-box p-10 ${
                index === 0
                  ? "bg-custom-hot-gradient"
                  : "bg-custom-cold-gradient"
              } text-slate-100 text-center rounded-lg cursor-pointer flex items-center justify-center transition-transform duration-500 relative`}
              onMouseEnter={() => setHovered(index === 0 ? "left" : "right")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleVote(currentPoll.id, option.id)}
              style={{
                height: "250px",
                width:
                  hovered === (index === 0 ? "left" : "right") ? "60%" : "40%",
                transition: "width 0.5s ease-in-out",
              }}
            >
              <p className="text-sm text-slate-100 font-medium overflow-hidden drop-shadow-lg text-ellipsis">
                {option.title}
              </p>
              {votedPolls.includes(currentPoll.id) && (
                <p
                  className="absolute left-1/2 transform -translate-x-1/2 bottom-2 bg-white text-slate-900 font-bold p-2 rounded-full drop-shadow-lg"
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

        <div ref={loader}></div>
      </div>
    </>
  );
}
