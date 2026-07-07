import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    scroll-behavior: smooth;
}

body{
    background-color: ${({ theme }) => theme.colors.col040};
    font-family: var(--font-inter), sans-serif;
    font-size: 16px;
    min-height: 100vh;
    max-width: 100vw;
    overflow: auto;
    scroll-behavior: smooth;
}

p{
    font-family: ${({ theme }) => theme.fonts.fontPrimary};
    font-size: 16px;
    color: ${({ theme }) => theme.colors.col030};
    font-weight: 400;
}

h1{
    font-family: ${({ theme }) => theme.fonts.fontSecondary};
    font-size: clamp(2rem, 5vw, 3rem);
}

h2{
    font-family: ${({ theme }) => theme.fonts.fontSecondary};
    font-size: clamp(1.5rem, 4vw, 2.25rem);
}

h3{
    font-family: ${({ theme }) => theme.fonts.fontPrimary};
    font-size: clamp(0.875rem, 2vw, 1rem);
}

a{
    text-decoration: none;
    color: ${({ theme }) => theme.colors.col040};
    font-size: 14px;
    cursor: pointer;
}

input, textarea, select{
    outline: none;
}

button{
    background: none;
    border: none;
    cursor: pointer;
}
`;

export default GlobalStyles;
