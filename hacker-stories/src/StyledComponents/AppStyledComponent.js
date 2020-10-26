import styled from "styled-components";

const HeadlinePrimary = styled.h1`
  font-size: 4.8rem;
  font-weight: 300;
  letter-spacing: 0.2rem;
`;

const StyledButton = styled.button`
  background: transparent;
  border: 0.1rem solid #171212;
  padding: 0.5rem;
  cursor: pointer;

  transition: all 0.1s ease-in;

  &:hover {
    background: #171212;
    color: #ffffff;
  }
`;

const StyledButtonSmall = styled(StyledButton)`
  padding: 0.5rem;
`;

const StyledButtonLarge = styled(StyledButton)`
  padding: 1rem;
`;

const StyledColumn = styled.div`
  padding: 0rem 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  a {
    color: inherit;
  }

  /* Passing in props! */
  width: ${(props) => props.width};
`;

const StyledContainer = styled.div`
  /* height: 100vw; */
  padding: 2rem;

  background: #83a4d4; /* fallback for old browsers */
  background: linear-gradient(to left, #b6fbff, #83a4d4);

  color: #171212;
`;

const StyledItem = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 0.5rem;
`;

const StyledInput = styled.input`
  border: none;
  border-bottom: 0.1rem solid #171212;
  background-color: transparent;
  font-size: 2.4rem;
`;

const StyledLabel = styled.label`
  border-top: 0.1rem solid #171212;
  border-left: 0.1rem solid #171212;
  padding-left: 0.5rem;
  font-size: 2.4rem;
`;

const StyledSearchForm = styled.form`
  padding: 1rem 0rem 2rem 0rem;
  display: flex;
  align-items: baseline;
`;

export {
  HeadlinePrimary,
  StyledButtonSmall,
  StyledButtonLarge,
  StyledColumn,
  StyledContainer,
  StyledItem,
  StyledInput,
  StyledLabel,
  StyledSearchForm,
};
