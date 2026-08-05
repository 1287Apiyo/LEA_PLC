import Link from "next/link";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { DemoAccounts } from "@/components/auth/demo-accounts";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Access your LEA Labs workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense>
          <LoginForm />
        </Suspense>
        <DemoAccounts />
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        <span>
          New here?{" "}
          <Link href="/register" className="font-medium text-foreground hover:underline">
            Create an account
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}
