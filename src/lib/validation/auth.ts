/**
 * lib/validation/auth.ts
 *
 * Shared Zod schemas for authentication forms.
 * Used both client-side (react-hook-form + zodResolver) and independently
 * re-validated server-side in Server Actions. The server NEVER trusts
 * client-side validation alone.
 */
import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Weak password denylist — common/leaked passwords rejected outright.
// Extend this list as needed; it supplements, not replaces, complexity rules.
// ---------------------------------------------------------------------------
const WEAK_PASSWORDS = new Set([
  "password1!",
  "Password1!",
  "P@ssword1",
  "P@ssw0rd",
  "Passw0rd!",
  "Admin1234!",
  "Welcome1!",
  "Qwerty123!",
  "Letmein1!",
  "Monkey123!",
  "Dragon123!",
  "123456789!",
  "Abc123456!",
  "Iloveyou1!",
  "Football1!",
  "Superman1!",
  "Batman123!",
  "Trustno1!",
  "Hello123!",
  "Shadow123!",
]);

// ---------------------------------------------------------------------------
// Pattern to reject HTML / script injection in free-text fields.
// This is a first-layer rejection; DOMPurify sanitises server-side as well.
// ---------------------------------------------------------------------------
const HTML_SCRIPT_PATTERN = /<[^>]*>|javascript:/i;

// ---------------------------------------------------------------------------
// loginSchema
// ---------------------------------------------------------------------------
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(254, "Email must be at most 254 characters")
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address"),

  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// signupSchema
// ---------------------------------------------------------------------------
export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(40, "First name must be at most 40 characters")
      .trim()
      .refine((val) => !HTML_SCRIPT_PATTERN.test(val), {
        message: "First name contains invalid characters",
      }),

    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(40, "Last name must be at most 40 characters")
      .trim()
      .refine((val) => !HTML_SCRIPT_PATTERN.test(val), {
        message: "Last name contains invalid characters",
      }),

    email: z
      .string()
      .min(1, "Email is required")
      .max(254, "Email must be at most 254 characters")
      .trim()
      .toLowerCase()
      .email("Please enter a valid email address"),

    phone: z
      .string()
      .min(1, "Phone number is required")
      .trim()
      .refine(
        (val) => {
          // Accept NG, UK, US, CA, and general EU-format numbers
          const supportedCountries = [
            "NG",
            "GB",
            "US",
            "CA",
            "DE",
            "FR",
            "IT",
            "ES",
            "NL",
            "BE",
            "PT",
            "PL",
            "SE",
            "NO",
            "DK",
            "FI",
            "AT",
            "CH",
            "IE",
          ] as const;

          return supportedCountries.some((country) => {
            try {
              return isValidPhoneNumber(val, country);
            } catch {
              return false;
            }
          });
        },
        {
          message:
            "Please enter a valid phone number (NG, UK, US, CA, or EU format)",
        },
      ),

    password: z
      .string()
      .min(10, "Password must be at least 10 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      )
      .refine((val) => !WEAK_PASSWORDS.has(val), {
        message: "This password is too common. Please choose a stronger one.",
      }),

    confirmPassword: z.string().min(1, "Please confirm your password"),

    terms_accepted: z.literal(true, {
      message: "You must accept the terms to continue",
    }),

    // Honeypot field — must be empty. Validated server-side only.
    // Client-side schema includes it so react-hook-form tracks the field.
    website: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      // Full name length check: firstName + ' ' + lastName, 2–80 chars
      const fullName = `${data.firstName} ${data.lastName}`;
      return fullName.length >= 2 && fullName.length <= 80;
    },
    {
      message: "Full name must be between 2 and 80 characters",
      path: ["firstName"],
    },
  );

export type SignupFormData = z.infer<typeof signupSchema>;

// ---------------------------------------------------------------------------
// profileSchema — account settings "edit profile" form
// ---------------------------------------------------------------------------
export const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name must be at most 80 characters")
    .trim()
    .refine((val) => !HTML_SCRIPT_PATTERN.test(val), {
      message: "Full name contains invalid characters",
    }),

  phone: z
    .string()
    .trim()
    .refine(
      (val) => {
        if (val === "") return true; // phone is optional on profile edit
        const supportedCountries = [
          "NG",
          "GB",
          "US",
          "CA",
          "DE",
          "FR",
          "IT",
          "ES",
          "NL",
          "BE",
          "PT",
          "PL",
          "SE",
          "NO",
          "DK",
          "FI",
          "AT",
          "CH",
          "IE",
        ] as const;

        return supportedCountries.some((country) => {
          try {
            return isValidPhoneNumber(val, country);
          } catch {
            return false;
          }
        });
      },
      {
        message:
          "Please enter a valid phone number (NG, UK, US, CA, or EU format)",
      },
    )
    .optional()
    .or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// ---------------------------------------------------------------------------
// changePasswordSchema — account settings "change password" form
// ---------------------------------------------------------------------------
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(10, "Password must be at least 10 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      )
      .refine((val) => !WEAK_PASSWORDS.has(val), {
        message: "This password is too common. Please choose a stronger one.",
      }),

    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from your current password",
    path: ["newPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
