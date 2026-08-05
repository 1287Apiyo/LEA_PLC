import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VerifyEmail } from "@/components/auth/verify-email";

export const metadata = { title: "Verify email" };

export default function VerifyEmailPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email verification</CardTitle>
        <CardDescription>Confirming your email address…</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<p className="text-sm text-muted-foreground">Verifying…</p>}>
          <VerifyEmail />
        </Suspense>
      </CardContent>
    </Card>
  );
}
