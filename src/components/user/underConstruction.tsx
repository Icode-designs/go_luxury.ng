"use client";
import Image from "next/image";
import styled from "styled-components";

const StyledUnderConstruction = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.col040};
  font-size: 24px;
  font-weight: bold;

  img {
    width: 300px;
    height: auto;
  }
`;

const UnderConstruction = () => {
  return (
    <StyledUnderConstruction>
      <Image
        src="/underConstruction.jpg"
        alt="Under Construction"
        width={300}
        height={250}
      />
    </StyledUnderConstruction>
  );
};

export default UnderConstruction;
