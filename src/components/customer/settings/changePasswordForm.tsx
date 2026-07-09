"use client";
import { useActionState, useRef } from "react";
import { InputBox } from "@/styles/auth.styles";
import { FormError, FieldError, FormSuccess } from "@/styles/auth-error.styles";
import Button from "@/components/ui/button";
import {
  changePasswordAction,
  type ChangePasswordState,
} from "@/lib/auth/changePassword";

const initialState: ChangePasswordState = { status: "idle" };

const ChangePasswordForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    changePasswordAction,
    initialState,
  );

  const fieldError = (field: string): string | undefined =>
    state.status === "error" ? state.fieldErrors?.[field]?.[0] : undefined;

  if (state.status === "success" && formRef.current) {
    formRef.current.reset();
  }

  return (
    <form action={formAction} ref={formRef}>
      {state.status === "error" && (
        <FormError role="alert">{state.message}</FormError>
      )}
      {state.status === "success" && (
        <FormSuccess role="status">Password updated.</FormSuccess>
      )}

      <fieldset disabled={isPending} style={{ display: "grid", gap: 16 }}>
        <InputBox>
          <label htmlFor="currentPassword">Current password</label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
          />
          {fieldError("currentPassword") && (
            <FieldError>{fieldError("currentPassword")}</FieldError>
          )}
        </InputBox>

        <InputBox>
          <label htmlFor="newPassword">New password</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            autoComplete="new-password"
          />
          {fieldError("newPassword") && (
            <FieldError>{fieldError("newPassword")}</FieldError>
          )}
        </InputBox>

        <InputBox>
          <label htmlFor="confirmNewPassword">Confirm new password</label>
          <input
            id="confirmNewPassword"
            name="confirmNewPassword"
            type="password"
            required
            autoComplete="new-password"
          />
          {fieldError("confirmNewPassword") && (
            <FieldError>{fieldError("confirmNewPassword")}</FieldError>
          )}
        </InputBox>

        <Button variant="filled-dark" type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Change password"}
        </Button>
      </fieldset>
    </form>
  );
};

export default ChangePasswordForm;
