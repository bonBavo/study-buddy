"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, AuthInput } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("registered")) {
      setSuccess("Registration successful! Please login.");
    }
  }, [searchParams]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthInput>({
    resolver: zodResolver(authSchema) as any,
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit = async (data: AuthInput) => {
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(result.error || "Invalid email or password");
      }
    } catch (err) {
      setError("Failed to login. Please try again.");
    }
  };

  return (
    <>
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input {...register("email")} type="email" placeholder="Email Address" />
          {errors.email && <p className="error-message" style={{ marginTop: "5px", border: "none", background: "none", color: "var(--color-error)" }}>{errors.email.message}</p>}
        </div>
        <div>
          <Input {...register("password")} type="password" placeholder="Password" />
          {errors.password && <p className="error-message" style={{ marginTop: "5px", border: "none", background: "none", color: "var(--color-error)" }}>{errors.password.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="auth-container">
      <Card variant="auth">
        <header style={{ marginBottom: "20px" }}>
          <h1>Login</h1>
          <p className="subtitle">Welcome back to Study Buddy</p>
        </header>

        <Suspense fallback={<p>Loading...</p>}>
          <LoginForm />
        </Suspense>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link href="/register" className="text-link">
            Register
          </Link>
        </div>
      </Card>
    </div>
  );
}
