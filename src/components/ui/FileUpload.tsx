import styled from "styled-components";

const FileInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FileInput = styled.input`
  &[type="file"] {
    border: 1px dashed #f2f2f2ac;
  }

  &[type="file"]::file-selector-button {
    font-family: ${({ theme }) => theme.fonts.main};
    padding: 6px 12px;
    color: white;
    border: none;
    border-radius: 4px;
    margin-right: 10px;
    cursor: pointer;
    transition: filter 0.3s;
    background-image: ${({ theme }) => theme.colors.buttonBackground};
    color: ${({ theme }) => theme.colors.buttonText};

    &:hover {
      filter: ${({ theme }) => theme.colors.buttonHoverFilter};
    }
  }
`;

const FileName = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

export { FileInputContainer, FileInput, FileName };