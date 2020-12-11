import React from "react";
import axios from "axios";

import styles from "./App.module.css";
import List from "./components/List";
import { Stories, Story } from "./components/List/Stories";
import SearchForm from "./components/SearchForm";

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
interface StoriesFetchSuccessAction {
  type: "STORIES_FETCH_SUCCESS";
  payload: Stories;
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

interface StoriesFetchInitAction {
  type: "STORIES_FETCH_INIT";
}

interface StoriesFetchFailureAction {
  type: "STORIES_FETCH_FAILURE";
}

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
