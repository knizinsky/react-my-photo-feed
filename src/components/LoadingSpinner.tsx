import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div`
  left: 50%;
  margin-left: -20px;
  top: 50%;
  margin-top: -20px;
  position: absolute;
  z-index: 19 !important;
  animation: ${spin} 500ms linear infinite;
`;

const SpinnerIcon = styled.div`
  width: 40px;
  height: 40px;
  border: solid 4px transparent;
  border-top-color: #88312a !important;
  border-left-color: #43155d !important;
  border-radius: 50%;
`;

const LoadingSpinner = () => {
  return (
    <SpinnerContainer>
      <SpinnerIcon />
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
