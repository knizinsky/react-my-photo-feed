import styled from "styled-components";

const Select = styled.select`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: 4px;
  width: 100%;
  max-width: 300px;
  background: ${({ theme }) => theme.colors.inputBackground};
  backdrop-filter: blur(10px);
  color: #fff;
  cursor: pointer;
  position: relative;

  &::after {
    content: "▼";
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #fff;
    pointer-events: none;
  }

  &:focus {
    outline: none;
    border-color: #d2d2d2;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const Option = styled.option`
  color: #000;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;

  &[selected] {
    background: ${({ theme }) => theme.colors.primaryGradient};
    color: #fff;
  }

  &[value=""] {
    color: #b3b3b3;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primaryGradient};
    color: #fff;
  }
`;

export { Select, Option };