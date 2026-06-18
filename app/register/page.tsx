"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, AuthInput } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthInput>({
    resolver: zodResolver(authSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      password: "",
    }
  });

  const onSubmit = async (data: AuthInput) => {
    setError(null);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        router.push("/login?registered=true");
      } else {
        setError(result.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to register. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <Card variant="auth">
        <header style={{ marginBottom: "20px" }}>
          <h1>Register</h1>
          <p className="subtitle">Join Study Buddy today</p>
        </header>

        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" method="POST" onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit)(e);
        }}>
          <div>
            <Input {...register("name")} type="text" placeholder="Full Name" />
            {errors.name && <p className="error-message" style={{ marginTop: "5px", border: "none", background: "none", color: "var(--color-error)" }}>{errors.name.message}</p>}
          </div>
          <div>
            <Input {...register("email")} type="email" placeholder="Email Address" />
            {errors.email && <p className="error-message" style={{ marginTop: "5px", border: "none", background: "none", color: "var(--color-error)" }}>{errors.email.message}</p>}
          </div>
          <div>
            <Input {...register("password")} type="password" placeholder="Password" />
            {errors.password && <p className="error-message" style={{ marginTop: "5px", border: "none", background: "none", color: "var(--color-error)" }}>{errors.password.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link href="/login" className="text-link">
            Login
          </Link>
        </div>
      </Card>
    </div>
  );
}
