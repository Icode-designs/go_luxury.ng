"use client";
import { useActionState, useTransition, useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import {
  AuthContainer,
  AuthForm,
  AuthFormHeader,
  Dividerbox,
  InputBox,
  RedirectBox,
  BackButton,
} from "@/styles/auth.styles";
import { FieldError, FormError } from "@/styles/auth-error.styles";
import { loginAction, type LoginActionState } from "@/lib/auth/login";
import { loginSchema, type LoginFormData } from "@/lib/validation/auth";
import Link from "next/link";
import { FiEyeOff, FiArrowLeft } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";

const initialState: LoginActionState = { status: "idle" };

const LoginFormContent = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [state, formAction] = useActionState(loginAction, initialState);

  function handlePasswordVisibility() {
    setPasswordVisible((prev) => !prev);
  }

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (returnTo) formData.append("returnTo", returnTo);

    startTransition(() => {
      formAction(formData);
    });
  });

  const isLoading = isSubmitting || isPending;

  return (
    <main>
      <AuthContainer>
        <BackButton
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <FiArrowLeft /> <h3>Back</h3>
        </BackButton>
        <AuthForm onSubmit={onSubmit} noValidate>
          <AuthFormHeader>
            <h3>WELCOME BACK</h3>
            <h1>Log in to your account</h1>
            <p>Track orders, save addresses, and check out faster</p>
          </AuthFormHeader>

          {state.status === "error" && (
            <FormError role="alert">{state.message}</FormError>
          )}

          <fieldset disabled={isLoading}>
            <InputBox>
              <label htmlFor="email">email address</label>
              <input
                placeholder="enter your email address"
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <FieldError role="alert">{errors.email.message}</FieldError>
              )}
            </InputBox>

            <InputBox>
              <label htmlFor="password">password</label>
              <input
                placeholder="enter your password"
                id="password"
                type={passwordVisible ? "text" : "password"}
                autoComplete="current-password"
                {...register("password")}
              />
              <button
                onClick={handlePasswordVisibility}
                type="button"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
              >
                {passwordVisible ? <IoEyeOutline /> : <FiEyeOff />}
              </button>
              {errors.password && (
                <FieldError role="alert">{errors.password.message}</FieldError>
              )}
            </InputBox>
          </fieldset>

          <Button variant="filled-dark" type="submit" disabled={isLoading}>
            {isLoading ? "LOGGING IN..." : "LOG IN"}
          </Button>

          <Dividerbox>
            <div></div>
            <p>or</p>
            <div></div>
          </Dividerbox>
          <Button variant="outlined" type="button">
            CONTINUE AS GUEST
          </Button>

          <RedirectBox>
            <p>{"Don't"} have an account yet?</p>
            <Link href="/signup">Signup</Link>
          </RedirectBox>
        </AuthForm>
      </AuthContainer>
    </main>
  );
};

const Login = () => {
  return (
    <Suspense
      fallback={
        <main>
          <AuthContainer>Loading...</AuthContainer>
        </main>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
};

export default Login;
