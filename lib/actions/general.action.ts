import { db } from "@/firebase/admin";

// Mengambil semua interview berdasarkan userId
export async function getInterviewByUserId(userId: string): Promise<Interview[] | null> {
  // get all interviews by user id
  const interviews = await db.collection("interviews").where("userId", "==", userId).orderBy("createdAt", "desc").get();
  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[]; // return interviews data
}

// Mengambil interview terbaru selain dari userId yang sama
export async function getLatestInterview(params: GetLatestInterviewsParams): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db.collection("interviews").where("finalized", "==", true).where("userId", "!=", userId).orderBy("createdAt", "desc").limit(limit).get();
  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[]; // return interviews data
}

// Mengambil interview berdasarkan interviewId
export async function getInterviewById(id: string): Promise<Interview | null> {
  // get all interviews by user id
  const interview = await db.collection("interviews").doc(id).get();
  return interview.data() as Interview; // return interview data
}
