"use client";

import { Eye, EyeOff, Loader2, User, Mail, Lock, ArrowRight, Brain } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleButton } from "@/components/auth/google-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useRegisterForm } from "./useRegisterForm";

export default function RegisterForm() {
  const {
    form,
    onSubmit,
    handleGoogleSignUp,
    isLoading,
    loadingType,
    showPassword,
    setShowPassword,
  } = useRegisterForm();

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex flex-col items-center text-center">
        <div className="h-12 w-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center mb-2">
          <Brain />
        </div>
        <h1 className="text-2xl font-bold">Join Mindnamo</h1>
        <p className="text-sm text-zinc-500">Create your expert account</p>
      </div>

      <GoogleButton
        onClick={handleGoogleSignUp}
        isLoading={loadingType === "google"}
        disabled={isLoading}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="John Doe" disabled={isLoading} />
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
                  <Input {...field} placeholder="name@example.com" disabled={isLoading} />
                </FormControl>
                <FormMessage />
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
                      {...field}
                      type={showPassword ? "text" : "password"}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {loadingType === "credentials" ? (
              <>
                <Loader2 className="mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account <ArrowRight className="ml-2" />
              </>
            )}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className={cn("font-semibold text-zinc-900", isLoading && "pointer-events-none")}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

