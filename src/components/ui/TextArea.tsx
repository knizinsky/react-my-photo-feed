import styled from "styled-components";

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: 4px;
  width: 100%;
  min-height: 40px;
  background: ${({ theme }) => theme.colors.inputBackground};
  backdrop-filter: blur(10px);
  color: #fff;
  &:focus {
    outline: 1px solid ${({ theme }) => theme.colors.inputFocusBorder};
  }
`;

export default TextArea;