"use client";
import { useActionState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  FieldError,
  FormError,
  FormSuccess,
  HoneypotInput,
  TermsRow,
} from "@/styles/auth-error.styles";
import { signupAction, type SignupActionState } from "@/lib/auth/signup";
import { signupSchema, type SignupFormData } from "@/lib/validation/auth";
import Link from "next/link";
import { FiEyeOff, FiArrowLeft } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";

const initialState: SignupActionState = { status: "idle" };

const Signup = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      website: "",
    },
  });

  const [state, formAction] = useActionState(signupAction, initialState);

  function handlePasswordVisibility() {
    setPasswordVisible((prev) => !prev);
  }

  function handleConfirmPasswordVisibility() {
    setConfirmPasswordVisible((prev) => !prev);
  }

  // react-hook-form validates client-side first, then we build FormData
  // ourselves and invoke the Server Action directly inside a transition.
  // We no longer rely on formRef.requestSubmit() — calling a ref's
  // .current during the render-adjacent handleSubmit() wrapper triggered
  // React's "Cannot access refs during render" error. Building FormData
  // manually and calling formAction() directly avoids touching any ref.
  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("terms_accepted", data.terms_accepted ? "true" : "");
    formData.append("website", data.website ?? "");
    formData.append("returnTo", returnTo);

    startTransition(() => {
      formAction(formData);
    });
  });

  const isLoading = isSubmitting || isPending;

  const getServerFieldError = (
    field: keyof SignupFormData,
  ): string | undefined => {
    if (state.status === "error" && state.fieldErrors) {
      return state.fieldErrors[field]?.[0];
    }
    return undefined;
  };

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
            <h3>JOIN US</h3>
            <h1>Create your account</h1>
            <p>Track orders, save addresses, and check out faster</p>
          </AuthFormHeader>

          {state.status === "error" && (
            <FormError role="alert">{state.message}</FormError>
          )}

          {state.status === "success" && (
            <FormSuccess role="status">
              Account created! Please check your email to confirm your account.
            </FormSuccess>
          )}

          <fieldset disabled={isLoading}>
            <HoneypotInput
              type="text"
              {...register("website")}
              aria-hidden="true"
              tabIndex={-1}
              autoComplete="off"
            />

            <InputBox>
              <label htmlFor="firstName">first name</label>
              <input
                placeholder="enter your first name"
                id="firstName"
                type="text"
                autoComplete="given-name"
                {...register("firstName")}
              />
              {(errors.firstName || getServerFieldError("firstName")) && (
                <FieldError role="alert">
                  {errors.firstName?.message ??
                    getServerFieldError("firstName")}
                </FieldError>
              )}
            </InputBox>

            <InputBox>
              <label htmlFor="lastName">last name</label>
              <input
                placeholder="enter your last name"
                id="lastName"
                type="text"
                autoComplete="family-name"
                {...register("lastName")}
              />
              {(errors.lastName || getServerFieldError("lastName")) && (
                <FieldError role="alert">
                  {errors.lastName?.message ?? getServerFieldError("lastName")}
                </FieldError>
              )}
            </InputBox>

            <InputBox>
              <label htmlFor="email">email</label>
              <input
                placeholder="enter your email"
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
              />
              {(errors.email || getServerFieldError("email")) && (
                <FieldError role="alert">
                  {errors.email?.message ?? getServerFieldError("email")}
                </FieldError>
              )}
            </InputBox>

            <InputBox>
              <label htmlFor="tel">Phone number</label>
              <input
                placeholder="enter your phone number"
                id="tel"
                type="tel"
                autoComplete="tel"
                {...register("phone")}
              />
              {(errors.phone || getServerFieldError("phone")) && (
                <FieldError role="alert">
                  {errors.phone?.message ?? getServerFieldError("phone")}
                </FieldError>
              )}
            </InputBox>

            <InputBox>
              <label htmlFor="password">password</label>
              <input
                placeholder="enter your password"
                id="password"
                type={passwordVisible ? "text" : "password"}
                autoComplete="new-password"
                {...register("password")}
              />
              <button
                onClick={handlePasswordVisibility}
                type="button"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
              >
                {passwordVisible ? <IoEyeOutline /> : <FiEyeOff />}
              </button>
              {(errors.password || getServerFieldError("password")) && (
                <FieldError role="alert">
                  {errors.password?.message ?? getServerFieldError("password")}
                </FieldError>
              )}
            </InputBox>

            <InputBox>
              <label htmlFor="confirmPassword">confirm password</label>
              <input
                placeholder="confirm your password"
                id="confirmPassword"
                type={confirmPasswordVisible ? "text" : "password"}
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
              <button
                onClick={handleConfirmPasswordVisibility}
                type="button"
                aria-label={
                  confirmPasswordVisible ? "Hide password" : "Show password"
                }
              >
                {confirmPasswordVisible ? <IoEyeOutline /> : <FiEyeOff />}
              </button>
              {(errors.confirmPassword ||
                getServerFieldError("confirmPassword")) && (
                <FieldError role="alert">
                  {errors.confirmPassword?.message ??
                    getServerFieldError("confirmPassword")}
                </FieldError>
              )}
            </InputBox>

            <Controller
              name="terms_accepted"
              control={control}
              render={({ field }) => (
                <TermsRow>
                  <input
                    type="checkbox"
                    id="terms_accepted"
                    checked={field.value === true}
                    onChange={(e) =>
                      field.onChange(e.target.checked || undefined)
                    }
                  />
                  <label htmlFor="terms_accepted">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </TermsRow>
              )}
            />
            {errors.terms_accepted && (
              <FieldError role="alert">
                {errors.terms_accepted.message}
              </FieldError>
            )}
          </fieldset>

          <Button variant="filled-dark" type="submit" disabled={isLoading}>
            {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
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
            <p>Have an account already?</p>
            <Link href="/login">Login</Link>
          </RedirectBox>
        </AuthForm>
      </AuthContainer>
    </main>
  );
};

export default Signup;
