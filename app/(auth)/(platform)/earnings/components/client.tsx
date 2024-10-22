"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CalendarNavbar from "@/components/CalendarNavbar";
import WeekView from "@/components/WeekView";
import MonthView from "@/components/MonthView";
import { useCalendarStore } from "@/store/CalendarStore";
import { useEmailModal } from "@/store/EmailModalStore";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuthModal } from "@/store/AuthModalStore";
import { useEarningsStore } from "@/store/EarningsStore";
import { useSubscriptionModal } from "@/store/SubscriptionModalStore";
import { User, Subscription, EarningsCallTranscript } from "@prisma/client";

export type UserWithSubscription =
  | (User & {
      subscription: Subscription | null;
    })
  | null;

const EarningsClient = ({ userInfo }: { userInfo: UserWithSubscription }) => {
  const [transcripts, setTranscripts] = useState<EarningsCallTranscript[]>([]);
  // const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const setSelectedCompany = useEarningsStore(
    (state) => state.setSelectedCompany
  );

  const { currentDate, view, setCurrentDate, setView, navigateMonth } =
    useCalendarStore();
  const emailModal = useEmailModal();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { onOpen: openAuthModal } = useAuthModal();
  const { onOpen: openSubscriptionModal } = useSubscriptionModal();

  const fetchTranscripts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const params = new URLSearchParams(searchParams);
      params.set("month", month.toString());
      params.set("year", year.toString());
      params.set("page", currentPage.toString());

      router.push(`/earnings?${params.toString()}`, { scroll: false });

      const response = await fetch(`/api/transcripts?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch transcripts");
      }
      const data = await response.json();

      setTranscripts(data.articles);
      // setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error("Failed to fetch transcripts:", error);
      setError("Failed to fetch transcripts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTranscripts();
  }, [currentDate, currentPage]);

  useEffect(() => {
    const hasModalBeenShown = localStorage.getItem("emailModalShown");

    if (!hasModalBeenShown) {
      const timer = setTimeout(() => {
        emailModal.onOpen();
        localStorage.setItem("emailModalShown", "true");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [emailModal]);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - currentDate.getDay() + i);
    return date;
  });

  const handleViewChange = (newView: "week" | "month") => {
    setView(newView);
  };

  const handleDateChange = (newDate: Date) => {
    if (!userInfo) {
      openAuthModal();
    } else {
      setCurrentDate(newDate);
    }
  };

  const handleNavigateMonth = (direction: "prev" | "next") => {
    if (!userInfo) {
      openAuthModal();
    } else {
      navigateMonth(direction === "next" ? 1 : -1);
    }
  };

  const handleCompanyClick = (transcriptInfo: EarningsCallTranscript) => {
    console.log(transcriptInfo);

    if (!userInfo) {
      console.log("open auth modal");
      openAuthModal();
    } else if (!userInfo.subscription) {
      console.log("open subscription modal");
      openSubscriptionModal();
    } else {
      setSelectedCompany({
        id: transcriptInfo.id,
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <CalendarNavbar
        currentDate={currentDate}
        setCurrentDate={handleDateChange}
        navigateMonth={(direction: number) =>
          handleNavigateMonth(direction > 0 ? "next" : "prev")
        }
        view={view}
        setView={handleViewChange}
      />
      <div className="flex-1 overflow-y-auto relative">
        {isLoading && <LoadingSpinner />}
        {error && <div className="p-4 text-red-500">Error: {error}</div>}
        {!isLoading &&
          !error &&
          (view === "week" ? (
            <WeekView
              weekDays={weekDays}
              weekDates={weekDates}
              transcripts={transcripts}
              handleCompanyClick={handleCompanyClick}
            />
          ) : (
            <MonthView
              currentDate={currentDate}
              transcripts={transcripts}
              handleCompanyClick={handleCompanyClick}
            />
          ))}
      </div>
    </div>
  );
};

export default EarningsClient;
