"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateProfile } from "@/hooks/use-auth";
import { useAuthStore } from "@/lib/auth-store";
import { ApiError } from "@/types/api";
import {
  profileSettingsSchema,
  type ProfileSettingsFormValues,
} from "@/validation/auth";

/** Profile settings form — hydrates from the session, saves via the API. */
export function ProfileForm() {
  const user = useAuthStore((s) => s.user);
  const update = useUpdateProfile();

  const form = useForm<ProfileSettingsFormValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: { name: "", email: "", avatar_url: null },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url ?? null,
      });
    }
  }, [user, form]);

  const onSubmit = (values: ProfileSettingsFormValues) => {
    update.mutate(values, {
      onSuccess: () => toast.success("Profile updated."),
      onError: (error) => {
        toast.error(
          error instanceof ApiError ? error.message : "Could not save changes."
        );
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={update.isPending || !form.formState.isDirty}>
          {update.isPending ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
