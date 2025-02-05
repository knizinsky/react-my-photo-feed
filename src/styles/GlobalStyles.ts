import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *,
  *::after,
  *::before {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body {
    height: 100%;
  }

  body {
    font-family: ${({ theme }) => theme?.fonts?.main || "sans-serif"};
    background-color: ${({ theme }) => theme?.colors?.background || "#000"};
    background-image: linear-gradient(8deg, rgb(0 34 69 / 93%), rgb(0 0 0 / 94%)), url(../../public/background.jpg);
    color: ${({ theme }) => theme?.colors?.text || "#fff"};
  }

  html {
    scroll-behavior: smooth;
  }

  a {
    text-decoration: none;
  }

  img {
    height: auto;
  }

  input,
  button,
  textarea,
  select {
    font-family: inherit;
  }

  button {
    border: none;
    cursor: pointer;
  }

  textarea {
    resize: vertical;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
`;