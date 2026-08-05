import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata = { title: "Reset password" };

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string; email?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = params.token ?? "";
  const email = params.email ?? "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set a new password</CardTitle>
        <CardDescription>
          Choose a strong password for your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {token ? (
          <ResetPasswordForm email={email} token={token} />
        ) : (
          <p className="text-sm text-muted-foreground">
            This reset link is invalid or incomplete. Please request a new one.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
