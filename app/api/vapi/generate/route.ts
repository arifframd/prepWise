import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function GET() {
  return Response.json({ message: "Hello....", success: 200 });
}

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  try {
    // membuat interview questions dengan google gemini
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash"),
      prompt: `Siapkan pertanyaan untuk wawancara kerja.
Jabatan pekerjaan adalah ${role}.
Tingkat pengalaman kerja adalah ${level}.
Teknologi yang digunakan dalam pekerjaan adalah: ${techstack}.
Fokus antara pertanyaan behavioural dan technical harus condong ke: ${type}.
Jumlah pertanyaan yang diperlukan adalah: ${amount}.
Harap hanya menjawab pertanyaan, tanpa teks tambahan.
Pertanyaan akan dibacakan oleh asisten suara, jadi jangan gunakan "/" atau "*" atau karakter khusus lainnya yang dapat merusak asisten suara.
Jawab pertanyaan dengan format seperti ini:
        ["Pertanyaan 1", "Pertanyaan 2", "Pertanyaan 3"]
        
        Terimakasihh! <3
    `,
    });

    // menambahkan interview ke database
    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(","),
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({
      success: true,
      status: 200,
      message: "Interview generated successfully",
    });
  } catch (e) {
    console.error(e);
    return Response.json({ success: false, status: 500, message: `Error in generating interview: ${e}` });
  }
}
