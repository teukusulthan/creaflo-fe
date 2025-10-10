"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Play, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { loginSchema, type LoginBody } from "@/schemas/auth.schema";
import { loginRequest } from "@/services/auth.services";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<LoginBody>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: LoginBody) => {
    try {
      const payload = {
        email: values.email.trim(),
        password: values.password,
      };

      await loginRequest(payload);
      toast.success("Welcome back 👋");
      await new Promise((r) => setTimeout(r, 400));
      router.push("/dashboard");
    } catch (e: any) {
      const msg = e?.message || "Login failed";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background">
      {/* Left side */}
      <div className="relative hidden md:block">
        <Image
          src="https://images.unsplash.com/photo-1698299328112-0777b5d5364e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Workspace illustration"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Right side */}
      <div className="flex flex-col h-full p-6 md:p-10">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="flex items-center text-3xl mb-2 font-semibold tracking-tight">
                Sign in to
                <span className="flex items-center text-primary ml-2">
                  CRE
                  <Play
                    className="w-8 h-8 -rotate-[90deg] translate-y-[1px] mx-[2px]"
                    fill="currentColor"
                    stroke="currentColor"
                  />
                  FLO
                </span>
              </h1>

              <p className="text-sm text-muted-foreground">
                Continue to your workspace and create faster with AI.
              </p>
            </div>

            <Form {...form}>
              <form
                className="space-y-6"
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>

                <Separator />

                <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Create one
                  </Link>
                </p>
              </form>
            </Form>
          </div>
        </div>

        <div className="mt-8 text-xs text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Creaflo App</p>
        </div>
      </div>
    </div>
  );
}
