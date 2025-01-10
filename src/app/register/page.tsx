import { RegisterForm } from "@/components/auth/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Task View",
  description: "Create a new account to get started with Task View",
};

export default function Page() {
  return (
    <div className='flex h-screen w-full items-center justify-center px-4'>
      <RegisterForm />
    </div>
  );
}
