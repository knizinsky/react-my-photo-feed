import styled from "styled-components";

const Button = styled.button<{ secondary?: boolean }>`
  padding: 10px 16px;
  background: ${({ secondary, theme }) =>
    secondary ? theme.colors.secondary : theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: filter 0.3s;
  background-image: ${({ theme }) => theme.colors.buttonBackground};
  color: ${({ theme }) => theme.colors.buttonText};
  box-shadow: 1px 14px 20px 0px #0000001e;

  &:hover {
    filter: ${({ theme }) => theme.colors.buttonHoverFilter};
  }

  svg {
    margin-right: 6px;
  }
`;

export const PrimaryButton = styled(Button)`
  background-image: ${({ theme }) => theme.colors.primaryGradient};
  color: ${({ theme }) => theme.colors.buttonPrimaryText};
`;

export const ButtonSmall = styled(Button)`
  padding: 7px 13px;
  margin: 4px;
  box-shadow: 1px 14px 20px 0px #00000033;
`;

export default Button;
