import type { Metadata } from "next";
import { getSiteContent } from "@/lib/settings/getSiteContent";
import {
  BlogDetailSection,
  BlogDetailContainer,
  BlogDetailHeader,
  BlogBody,
} from "@/components/blog/blog.styles";

export const metadata: Metadata = {
  title: "Terms & Policies | Go_LuxuryHair.NG",
  description: "Terms of service and policies for Go_LuxuryHair.NG.",
};

export default async function TermsPage() {
  const { termsAndPolicies } = await getSiteContent();

  return (
    <BlogDetailSection>
      <BlogDetailContainer>
        <BlogDetailHeader>
          <h1>Terms &amp; Policies</h1>
        </BlogDetailHeader>

        {termsAndPolicies ? (
          <BlogBody>{termsAndPolicies}</BlogBody>
        ) : (
          <p style={{ fontSize: 13, color: "#5F5E5E" }}>
            Terms &amp; Policies content hasn&apos;t been added yet.
          </p>
        )}
      </BlogDetailContainer>
    </BlogDetailSection>
  );
}
