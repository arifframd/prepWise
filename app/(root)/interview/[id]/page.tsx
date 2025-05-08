import Agent from "@/components/Agent";
import DisplayTechIcon from "@/components/DisplayTechIcon";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewById } from "@/lib/actions/general.action";
import { getRandomInterviewCover } from "@/lib/utils";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: RouteParams) => {
  // ambil params
  const { id } = await params; // ambil id dari params
  const interview = await getInterviewById(id);
  const user = await getCurrentUser(); // ambil user untuk digunakan di agent
  if (!interview) redirect("/");
  return (
    <>
      <div className="flex flex-row justify-between gap-4">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image src={getRandomInterviewCover()} alt="cover-img" width={40} height={40} className="rounded-full size-[40px] object-cover" />
            <h3 className=" capitalize">{interview.role} Interview</h3>
          </div>
          <DisplayTechIcon techStack={interview.techstack} />
        </div>
        <p className="bg-dark-200 px-4 py-2 rounded-lg capitalize h-fit">{interview.type}</p>
      </div>

      {/* Generate ulang agent */}
      <Agent userName={user?.name} userId={user?.id} interviewId={id} type="interview" questions={interview.questions} />
    </>
  );
};

export default page;
