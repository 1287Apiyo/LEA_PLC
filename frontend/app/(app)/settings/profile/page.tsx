import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileForm } from "@/components/settings/profile-form";

export const metadata = { title: "Profile settings" };

export default function ProfileSettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Profile settings"
        description="Manage your personal information."
      />
      <Card>
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>
            This information is shown on your profile and in communications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}
