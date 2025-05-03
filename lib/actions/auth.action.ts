"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
  const { uid, name, email, password } = params;

  try {
    const userRecord = await db.collection("users").doc(uid).get(); // Check if user already exists

    if (userRecord.exists) {
      return {
        success: false,
        message: "User sudah terdaftar",
      };
    }

    // Buat user baru di Firebase Auth
    await db.collection("users").doc(uid).set({
      name,
      email,
      password,
    });

    return {
      success: true,
      message: "User berhasil dibuat, Silakan login",
    };
  } catch (error: any) {
    console.error("Error dalam membuat user: ", error);

    // firebase specific error handling
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "Email sudah terdaftar",
      };
    }

    return {
      success: false,
      message: "Gagal membuat user",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email); // Check if user exists
    if (!userRecord) {
      return {
        success: false,
        message: "User tidak ditemukan, silahkan daftar terlebih dahulu",
      };
    }

    await setSessionCookie(idToken); // Set session cookie for user
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Gagal melakukan sign in",
    };
  }
}

export async function setSessionCookie(idToken: string) {
  // buat cookie session untuk user
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000, // in milliseconds
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies(); // get cookie store
  const sessionCookie = cookieStore.get("session")?.value; // get session cookie

  if (!sessionCookie) return null; // if no session cookie, return null

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true); // verify session cookie
    const userRecord = await db.collection("users").doc(decodedClaims.uid).get(); // get user record from firestore

    if (!userRecord.exists) return null; // if user record not found, return null

    return {
      id: userRecord.id,
      ...userRecord.data(),
    } as User; // return user data
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function isAuthenticated() {
  const authUser = await getCurrentUser();

  return !!authUser; // return true jika user terautentikasi, false jika tidak
}
