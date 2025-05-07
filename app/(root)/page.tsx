import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import { getCurrentUser, getInterviewByUserId, getLatestInterview, isAuthenticated } from "@/lib/actions/auth.action";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  // memeriksa apakah user sudah login
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  // get interview by specific user and get latest interview with parallel query
  const user = await getCurrentUser();

  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewByUserId(user?.id!),
    await getLatestInterview({
      userId: user?.id!,
    }),
  ]);

  // cek apakah user sudah pernah mengambil interview
  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = latestInterviews?.length > 0;
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-powered Practice & Feedback</h2>
          <p className="text-lg">Berlatih seperti sedang interview sesungguhnya & mendapatkan feedback langsung</p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href={"/interview"}>Mulai Interview</Link>
          </Button>
        </div>
        <Image src={"/robot.png"} alt="robot" width={400} height={400} className="max-sm:hidden" />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Interview Milikmu</h2>
        <div className="interviews-section">{hasPastInterviews ? userInterviews?.map((interview) => <InterviewCard {...interview} key={interview.id} />) : <p>Kamu belum mengambil interview apapun</p>}</div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Ambil Interview</h2>
        <div className="interviews-section">{hasUpcomingInterviews ? latestInterviews?.map((interview) => <InterviewCard {...interview} key={interview.id} />) : <p>Tidak ada interview yang tersedia</p>}</div>
      </section>
    </>
  );
};

export default page;
