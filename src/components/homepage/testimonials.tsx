import React from "react";
import {
  TestimonialArticle,
  TestimonialsContent,
  TestimonialsSection,
} from "./home.styles";
import HomeSectionHeader from "./homeSectionHeader";
import { FlexBox } from "@/styles/components.styled";
import { IoIosStar } from "react-icons/io";

const Testimonials = () => {
  const testimonials = [
    {
      stars: 5,
      review: `The most realistic hairline I've ever had. Truly donor hair that doesn't tangle even after months.`,
      user: "ADEBOLA Y",
      location: "lagos",
    },
    {
      stars: 5,
      review: `The most realistic hairline I've ever had. Truly donor hair that doesn't tangle even after months.`,
      user: "ADEBOLA Y",
      location: "lagos",
    },
    {
      stars: 5,
      review: `The most realistic hairline I've ever had. Truly donor hair that doesn't tangle even after months.`,
      user: "ADEBOLA Y",
      location: "lagos",
    },
  ];

  return (
    <TestimonialsSection>
      <TestimonialsContent>
        <HomeSectionHeader tag="OUR CLIENTS SPEAK" text="Kind Words" />
        <div>
          {testimonials.map((testimonial, i) => (
            <TestimonialArticle key={i}>
              <FlexBox $gap={10}></FlexBox>
              <p>{`"${testimonial.review}"`}</p>
              <h3>
                -{testimonial.user}, {testimonial.location}
              </h3>
            </TestimonialArticle>
          ))}
        </div>
      </TestimonialsContent>
    </TestimonialsSection>
  );
};

export default Testimonials;
