"use client";
import { useActionState } from "react";
import { InputBox } from "@/styles/auth.styles";
import { FormError, FieldError, FormSuccess } from "@/styles/auth-error.styles";
import Button from "@/components/ui/button";
import {
  updateProfileAction,
  type UpdateProfileState,
} from "@/lib/auth/updateProfile";

interface ProfileFormProps {
  initialFullName: string;
  initialPhone: string;
}

const initialState: UpdateProfileState = { status: "idle" };

const ProfileForm = ({ initialFullName, initialPhone }: ProfileFormProps) => {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState,
  );

  const fieldError = (field: string): string | undefined =>
    state.status === "error" ? state.fieldErrors?.[field]?.[0] : undefined;

  return (
    <form action={formAction}>
      {state.status === "error" && (
        <FormError role="alert">{state.message}</FormError>
      )}
      {state.status === "success" && (
        <FormSuccess role="status">Profile updated.</FormSuccess>
      )}

      <fieldset disabled={isPending} style={{ display: "grid", gap: 16 }}>
        <InputBox>
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            defaultValue={initialFullName}
          />
          {fieldError("fullName") && (
            <FieldError>{fieldError("fullName")}</FieldError>
          )}
        </InputBox>

        <InputBox>
          <label htmlFor="phone">Phone (optional)</label>
          <input id="phone" name="phone" type="text" defaultValue={initialPhone} />
          {fieldError("phone") && <FieldError>{fieldError("phone")}</FieldError>}
        </InputBox>

        <Button variant="filled-dark" type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </fieldset>
    </form>
  );
};

export default ProfileForm;
