/**
 * lib/validation/checkout.ts
 * Shared Zod schemas for the checkout Server Action. Re-validated
 * server-side regardless of client input (see lib/orders/placeOrder.ts).
 */
import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

const HTML_SCRIPT_PATTERN = /<[^>]*>|javascript:/i;

// ---------------------------------------------------------------------------
// Contact details — only required from guests. A logged-in customer's
// name/email/phone come from their existing CUSTOMERS row instead.
// ---------------------------------------------------------------------------
export const guestContactSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name is required")
    .max(80, "Full name must be at most 80 characters")
    .trim()
    .refine((val) => !HTML_SCRIPT_PATTERN.test(val), {
      message: "Full name contains invalid characters",
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
      { message: "Please enter a valid phone number" },
    ),
});

export type GuestContactData = z.infer<typeof guestContactSchema>;

// ---------------------------------------------------------------------------
// Shipping address
// ---------------------------------------------------------------------------
export const addressSchema = z.object({
  country: z
    .string()
    .min(1, "Country is required")
    .max(80, "Country must be at most 80 characters")
    .trim()
    .refine((val) => !HTML_SCRIPT_PATTERN.test(val), {
      message: "Country contains invalid characters",
    }),

  stateRegion: z
    .string()
    .max(80, "State/region must be at most 80 characters")
    .trim()
    .refine((val) => !HTML_SCRIPT_PATTERN.test(val), {
      message: "Contains invalid characters",
    })
    .optional()
    .or(z.literal("")),

  city: z
    .string()
    .max(80, "City must be at most 80 characters")
    .trim()
    .refine((val) => !HTML_SCRIPT_PATTERN.test(val), {
      message: "Contains invalid characters",
    })
    .optional()
    .or(z.literal("")),

  postalCode: z
    .string()
    .max(20, "Postal code must be at most 20 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  street: z
    .string()
    .min(1, "Street address is required")
    .max(200, "Street address must be at most 200 characters")
    .trim()
    .refine((val) => !HTML_SCRIPT_PATTERN.test(val), {
      message: "Street address contains invalid characters",
    }),
});

export type AddressData = z.infer<typeof addressSchema>;
