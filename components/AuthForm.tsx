"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";

const authformSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(4, "Nama terlalu pendek") : z.string().optional(),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(5, "Password harus lebih dari 8 karakter"),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const formSchema = authformSchema(type);
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        // Create a new user with email and password
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password); // user akan terdaftar di firebase auth bukan di firestore

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success("Akun berhasil dibuat, silahkan login");
        router.push("/sign-in");
      } else {
        const { email, password } = values;
        const userCredentials = await signInWithEmailAndPassword(auth, email, password); // user akan terdaftar di firebase auth bukan di firestore

        // create session cookie
        const idToken = await userCredentials.user.getIdToken();
        if (!idToken) {
          toast.error("Gagal melakukan sign in, silahkan coba lagi");
          return;
        }

        // sign in to firestore
        await signIn({
          email,
          idToken,
        });

        toast.success("Login berhasil, silahkan tunggu sebentar");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, please try again later.");
    }
  }

  const isSignIn = type === "sign-in";
  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src={"/logo.svg"} alt="Logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>
        <h3 className="text-primary-100 text-center">Latihan Interview dengan AI</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full mt-4 form">
            {!isSignIn && <FormField control={form.control} name="name" label="Name" placeholder="Your name" />}
            <FormField control={form.control} name="email" label="Email" type="email" placeholder="Your Email" />
            <FormField control={form.control} name="password" label="Password" type="password" placeholder="Your Password" />
            <Button className="btn" type="submit">
              {isSignIn ? "Sign in" : "Create an Account"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have account already?"}
          <Link href={!isSignIn ? `/sign-in` : `/sign-up`} className="font-bold text-user-primary ml-1">
            {!isSignIn ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
