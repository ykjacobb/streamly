import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import SignUpForm from "./_components/signup-form";

export default function SignUp() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <SignUpForm />
        </div>
    );
}
