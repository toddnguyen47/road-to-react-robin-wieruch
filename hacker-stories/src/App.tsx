import React from "react";
import axios from "axios";
import classnames from "classnames";

import styles from "./App.module.css";

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
      <div className={styles["item"]}>
        <span style={{ width: "40%" }}>URL</span>
        <span style={{ width: "30%" }}>Author</span>
        <span style={{ width: "10%" }}># Comments</span>
        <span style={{ width: "10%" }}>Points</span>
        <span style={{ width: "10%" }}></span>
      </div>

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
    <div className={styles["item"]}>
      <span style={{ width: "40%" }}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{ width: "30%" }}>{item.author}</span>
      <span style={{ width: "10%" }}>{item.num_comments}</span>
      <span style={{ width: "10%" }}>{item.points}</span>
      <span style={{ width: "10%" }}>
        <button
          type="button"
          className={`${styles["button"]} ${styles["button__small"]}`}
          onClick={() => onRemoveItem(item)}
        >
          Dismiss
        </button>
      </span>
    </div>
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
      <label htmlFor={id} className={styles["label"]}>
        {children}
      </label>
      <input
        /** (2B) The `inputRef` variable is passed to JSX's reserved `ref` attribute.
         * The element instance is assigned to the mutable `current` property
         */
        ref={inputRef}
        id={id}
        type={type}
        onChange={onInputChanged}
        value={value}
        className={styles["input"]}
      />

      <p>
        {outputString} <strong>'{value}'</strong>
      </p>
    </>
  );
};

/**
 * Store a value in localStorage.
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

const getSumComments = (storiesState: StoriesState): number => {
  const initCommentValue = 0;
  return storiesState.data.reduce(
    (result, value) => result + value.num_comments,
    initCommentValue
  );
};

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}: SearchFormProps) => {
  return (
    <>
      <form onSubmit={onSearchSubmit} className={styles["searchForm"]}>
        <InputWithLabel
          id="search"
          value={searchTerm}
          onInputChanged={onSearchInput}
          isFocused={true}
          outputString="The Search Term is: "
        >
          <strong>Search: &nbsp;</strong>
        </InputWithLabel>

        <button
          type="submit"
          disabled={!searchTerm}
          className={classnames(styles["button"], styles["button__large"])}
        >
          Submit
        </button>
      </form>
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
    data: [] as Story[],
    isLoading: false,
    isError: false,
  });

  const sumOfStoriesComments = getSumComments(stories);

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
    <div className={styles["container"]}>
      <h1 className={styles["headline-primary"]}>
        {welcome.greeting} {welcome.title}
      </h1>

      <h1 className={styles["headline-primary"]}>Hello {getTitle("React")}</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <p>Sum of Number of Comments: {sumOfStoriesComments}</p>

      {stories.isError && <p>Cannot retrieve stories data.</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

export default App;

export { Item, List };
