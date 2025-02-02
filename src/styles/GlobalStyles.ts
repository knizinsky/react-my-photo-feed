import { createGlobalStyle } from "styled-components";

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
    font-family: "Geist", sans-serif;
    background-color: #f0f0f0;
    color: #333;
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
