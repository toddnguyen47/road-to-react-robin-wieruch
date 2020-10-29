import React from "react";
import axios from "axios";
import styled, { StyledProps } from "styled-components";

import { ReactComponent as Check } from "../images/check.svg";

// o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o
//   CONSTANTS
// o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o
const title = "React";
const welcome = {
  greeting: "Hey",
  title: title,
};

// o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o
//   TYPE & INTERFACE DECLARATIONS
// o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o
type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};

type Stories = Array<Story>;

type OnRemoveItem = (item: Story) => void;

type InputWithLabelProps = {
  id: string;
  type?: string;
  value: string;
  onInputChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
  outputString: string;
  isFocused?: boolean;
  children: React.ReactNode;
};

type ItemProps = {
  item: Story;
  onRemoveItem: OnRemoveItem;
};

type ListProps = {
  list: Stories;
  onRemoveItem: OnRemoveItem;
};

type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

interface StoriesFetchInitAction {
  type: "STORIES_FETCH_INIT";
}

interface StoriesFetchSuccessAction {
  type: "STORIES_FETCH_SUCCESS";
  payload: Stories;
}

interface StoriesFetchFailureAction {
  type: "STORIES_FETCH_FAILURE";
}

interface StoriesRemoveAction {
  type: "STORIES_REMOVE";
  payload: Story;
}

type StoriesState = {
  data: Stories;
  isLoading: boolean;
  isError: boolean;
};

type StoriesAction =
  | StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailureAction
  | StoriesRemoveAction;

/** Ref: https://stackoverflow.com/a/60662122 */
type StyledColumnProps = StyledProps<{
  width?: number;
}>;

// o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o
//   FUNCTIONS
// o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o
function getTitle(title: string) {
  return "| " + title + " |";
}

// const List = (props) => {
function List({ list, onRemoveItem }: ListProps) {
  return (
    <>
      <StyledItem>
        <StyledColumn style={{ width: "40%" }}>URL</StyledColumn>
        <StyledColumn style={{ width: "30%" }}>Author</StyledColumn>
        <StyledColumn style={{ width: "10%" }}># Comments</StyledColumn>
        <StyledColumn style={{ width: "10%" }}>Points</StyledColumn>
        <StyledColumn style={{ width: "10%" }}>Dismiss</StyledColumn>
      </StyledItem>

      <div>
        {list.map((item) => {
          return (
            <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
          );
        })}
      </div>
    </>
  );
}

const Item = ({ item, onRemoveItem }: ItemProps) => {
  return (
    <StyledItem>
      <StyledColumn style={{ width: "40%" }}>
        <a href={item.url}>{item.title}</a>
      </StyledColumn>
      <StyledColumn style={{ width: "30%" }}>{item.author}</StyledColumn>
      <StyledColumn style={{ width: "10%" }}>{item.num_comments}</StyledColumn>
      <StyledColumn style={{ width: "10%" }}>{item.points}</StyledColumn>
      <StyledColumn style={{ width: "10%" }}>
        <StyledButtonSmall type="button" onClick={() => onRemoveItem(item)}>
          <Check width="18" height="18" />
        </StyledButtonSmall>
      </StyledColumn>
    </StyledItem>
  );
};

// /** Passing in a full props javascript object */
// const Search = (props) => {

/** Destructuring in the function parameter! */
const InputWithLabel = ({
  id,
  type = "text",
  value,
  onInputChanged,
  outputString,
  isFocused,
  children,
}: InputWithLabelProps) => {
  // (2A) create an inputRef
  const inputRef = React.useRef<HTMLInputElement>(null!);

  // (2C) Go into React's lifecycle. Perform the focus when the element renders or
  // when its dependencies change
  React.useEffect(() => {
    // Check if the `.current` property exists
    if (isFocused && inputRef.current) {
      // (2D) Since `inputRef` is passed into the `input` element as the `ref` attribute,
      // `.current` property gives us access to that `input` element
      inputRef.current.focus();
      console.log("Focusing!");
    }
  }, [isFocused]);

  // (1B) Use the callback function
  return (
    <>
      <StyledLabel htmlFor={id}>{children}</StyledLabel>
      <StyledInput
        /** (2B) The `inputRef` variable is passed to JSX's reserved `ref` attribute.
         * The element instance is assigned to the mutable `current` property
         */
        ref={inputRef}
        id={id}
        type={type}
        onChange={onInputChanged}
        value={value}
      />

      <p>
        {outputString} <strong>'{value}'</strong>
      </p>
    </>
  );
};

/**
 * Store a vallue in localStorage.
 */
const useSemiPersistentState = (
  key: string,
  initialState: string
): [string, (newValue: string) => void] => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  /** We will need to monitor both `key` and `value`
   * In case `key` changes outside this hook
   */
  React.useEffect(() => {
    // Store in localStorage every time searchTerm is changed
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
};

const storiesReducer = (state: StoriesState, action: StoriesAction) => {
  switch (action.type) {
    case "STORIES_REMOVE":
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}: SearchFormProps) => {
  return (
    <>
      <StyledSearchForm onSubmit={onSearchSubmit}>
        <InputWithLabel
          id="search"
          value={searchTerm}
          onInputChanged={onSearchInput}
          isFocused={true}
          outputString="The Search Term is: "
        >
          <strong>Search: &nbsp;</strong>
        </InputWithLabel>

        <StyledButtonLarge type="submit" disabled={!searchTerm}>
          Submit
        </StyledButtonLarge>
      </StyledSearchForm>
    </>
  );
};

/**
 * This is the `App` component.
 * Everything outside is the global space!
 */
const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState("searchKey", "");

  // const [stories, setStories] = React.useState([]);
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  // (3A) fetch popular tech stories
  const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  /** Make a new `url` state and a function to update it */
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  const handleRemoveStory = (item: Story) => {
    dispatchStories({
      type: "STORIES_REMOVE",
      payload: item,
    });
  };

  const handleFetchStories = React.useCallback(async () => {
    // This check isn't needed technically as the button is disabled,
    // but it does not hurt to check
    if (!url) return;

    dispatchStories({ type: "STORIES_FETCH_INIT" });
    try {
      const result = await axios.get(url);
      console.log("Fetching!");
      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [url]); // (4E) when `searchTerm` changes

  React.useEffect(() => {
    handleFetchStories(); // (4C) invoke the callback using the useEffect() hook
  }, [handleFetchStories]); // (4D) dependency array: depends on any re-defined function handleFetchStories

  return (
    <StyledContainer>
      <HeadlinePrimary>
        {welcome.greeting} {welcome.title}
      </HeadlinePrimary>

      <HeadlinePrimary>Hello {getTitle("React")}</HeadlinePrimary>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      {stories.isError && <p>Cannot retrieve stories data.</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}

      <hr />
      <footer>
        Icons made by{" "}
        <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
          Freepik
        </a>{" "}
        from{" "}
        <a href="https://www.flaticon.com/" title="Flaticon">
          {" "}
          www.flaticon.com
        </a>
      </footer>
    </StyledContainer>
  );
};

export default App;

// o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o
//   STYLED COMPONENTS
// o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o-o

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

  &:hover > svg > g {
    fill: palevioletred;
    stroke: #ffffff;
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
  width: ${(props: StyledColumnProps) => props.width};
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
