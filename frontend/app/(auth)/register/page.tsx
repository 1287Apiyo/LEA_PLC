import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>
          Join LEA Labs to start learning.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        <span>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground hover:underline">
            Sign in
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}
