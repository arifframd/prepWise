import React from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { getRandomInterviewCover } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";
import DisplayTechIcon from "./DisplayTechIcon";

const InterviewCard = ({ id, userId, role, type, techstack, createdAt }: InterviewCardProps) => {
  const feedback = null as Feedback | null;
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type; // Normalize type to Mixed or Technical
  const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format("DD MMM, YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full mb-3">
      <div className="card-interview">
        <div>
          <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
            <p className="badge-text">{normalizedType}</p>
          </div>
          <Image src={getRandomInterviewCover()} alt="cover" width={90} height={90} className="rounded-full object-fit size-[90px]" />
          <h3 className="mt-5 capitalize">{role} Interview</h3>
          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Image src={"/calendar.svg"} alt="calendar" width={22} height={22} />
              <p>{formattedDate}</p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Image src={"/star.svg"} alt="star" width={22} height={22} />
              <p>{feedback?.totalScore || "---"}/100</p>
            </div>
          </div>
          <p className="line-clamp-2 mb-8 mt-4">{feedback?.finalAssessment || "Kamu belum mengambil interview. Ambil dan tingkatkan skill-mu"}</p>
          <div className="flex flex-row justify-between">
            <DisplayTechIcon techStack={techstack} />
            <Button className="btn-primary">
              <Link href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`}>{feedback ? "Lihat Feedback" : "Lihat Interview"}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
