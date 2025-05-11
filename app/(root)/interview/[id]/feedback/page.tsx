import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getFeedbackByInterviewId, getInterviewById } from "@/lib/actions/general.action";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);

  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({ interviewId: id, userId: user?.id! });
  console.log(feedback);

  const formattedDate = dayjs(feedback?.createdAt || null || Date.now()).format("DD MMM, YYYY - HH:mm");

  const finalVerdict = () => {
    let total;
    let recommend = false;
    feedback?.categoryScores.map((skor: { score: number }) => (total += skor.score));
    if (total! < 375) {
      console.log(total);
      return recommend;
    } else {
      recommend = true;
      return recommend;
    }
  };

  const isRecommended = finalVerdict();
  return (
    <>
      <div className="flex flex-col text-center py-7">
        <h3 className="font-bold text-5xl">Feedback on the Interview - </h3>
        <h3 className="font-bold capitalize mb-4 text-5xl">{interview.role} developer interview</h3>

        <div className="flex flex-row gap-2 items-center justify-center">
          <Image src={"/star.svg"} alt="star" width={22} height={22} />
          <p className="capitalize">
            overal impression: <strong>{feedback?.totalScore || "---"}</strong>/100
          </p>
          <Image src={"/calendar.svg"} alt="calendar" width={22} height={22} />
          <p>{formattedDate}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full px-4">
        <div className="flex flex-col w-full max-w-3xl">
          <p className="line-clamp-3 mb-4">
            This interview does not reflect serious interest or engagement from the candidate. Their responses are dismissive, vague, or outright negative, making it difficult to assess their qualifications, motivation, or suitability for
            the role.
          </p>

          <h2 className="text-xl font-semibold">Breakdown of Evaluation:</h2>

          <div className="mt-4 mb-5 space-y-3">
            {feedback?.categoryScores.map((item, index) => (
              <div key={index}>
                <h1 className="font-semibold">
                  {index + 1}. {item.name} ({item.score}/100)
                </h1>
                <ul className="list-disc list-outside text-gray-300 ml-9 space-y-1">
                  <li>{item.comment}</li>
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-row mb-5 gap-2">
            <h3>Final Verdict: </h3>
            {!isRecommended ? (
              <span className="text-green-400 sm:text-2xl px-3 rounded-full h-fit font-semibold ">Recommended</span>
            ) : (
              <span className="text-red-400 bg-dark-200 px-3 rounded-full sm:text-2xl h-fit font-semibold text-center">Not Recommended</span>
            )}
          </div>

          <p className="mb-5">{feedback?.finalAssessment}</p>

          <div className="flex flex-col sm:flex-row w-full gap-3">
            <Button className="flex-1 bg-gray-800 text-white py-2 rounded-full">
              <Link href={"/"}>Back to dashboard</Link>
            </Button>
            <Button className="flex-1 bg-purple-300 text-black py-2 rounded-full">
              <Link href={`/interview/${id}`}>Retake interview</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
