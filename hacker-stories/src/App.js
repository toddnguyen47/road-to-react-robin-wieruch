import React from "react";
import axios from "axios";

// CONSTANTS
const TypeSetEnum = {
  // Do not start enum at 0 because of JavaScript's strange equality comparison
  // when it comes to 0
  REMOVE_STORIES: 1,
  STORIES_FETCH_INIT: 2,
  STORIES_FETCH_SUCCESS: 3,
  STORIES_FETCH_FAILURE: 4,
};

const title = "React";
const welcome = {
  greeting: "Hey",
  title: title,
};

/**
 *
 * @param {String} title
 */
function getTitle(title) {
  return "| " + title + " |";
}

// const List = (props) => {
function List({ list, onRemoveItem }) {
  return (
    <div>
      {list.map((item) => {
        return (
          <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
        );
      })}
    </div>
  );
}

const Item = ({ item, onRemoveItem }) => {
  return (
    <>
      <ul>
        <a href={item.url}>{item.title}</a>
        <li>Author: {item.author}</li>
        <li>Number of Comments: {item.num_comments}</li>
        <li>Points: {item.points}</li>
      </ul>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </>
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
}) => {
  // (2A) create an inputRef
  const inputRef = React.useRef();

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
      <label htmlFor={id}>{children}</label>
      <input
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
 * @param {String} key
 * @param {*} initialState
 * @returns [String, Function]
 */
const useSemiPersistentState = (key, initialState) => {
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

const storiesReducer = (state, action) => {
  switch (action.type) {
    case TypeSetEnum.REMOVE_STORIES:
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    case TypeSetEnum.STORIES_FETCH_INIT:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case TypeSetEnum.STORIES_FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case TypeSetEnum.STORIES_FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
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

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  /** Make a new `url` state and a function to update it */
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: TypeSetEnum.REMOVE_STORIES,
      payload: item,
    });
  };

  const handleFetchStories = React.useCallback(() => {
    // This check isn't needed technically as the button is disabled,
    // but it does not hurt to check
    if (!url) return;

    dispatchStories({ type: TypeSetEnum.STORIES_FETCH_INIT });
    axios
      .get(url)
      .then((result) => {
        dispatchStories({
          type: TypeSetEnum.STORIES_FETCH_SUCCESS,
          payload: result.data.hits,
        });
      })
      .catch(() => {
        dispatchStories({ type: TypeSetEnum.STORIES_FETCH_FAILURE });
      });
  }, [url]); // (4E) when `searchTerm` changes

  React.useEffect(() => {
    handleFetchStories(); // (4C) invoke the callback using the useEffect() hook
  }, [handleFetchStories]); // (4D) dependency array: depends on any re-defined function handleFetchStories

  return (
    <div>
      <h1>
        {welcome.greeting} {welcome.title}
      </h1>

      <h1>Hello {getTitle("React")}</h1>
      <hr />

      <InputWithLabel
        id="search"
        value={searchTerm}
        onInputChanged={handleSearchInput}
        isFocused={true}
        outputString="The Search Term is: "
      >
        <strong>Search: &nbsp;</strong>
      </InputWithLabel>

      <button type="button" disabled={!searchTerm} onClick={handleSearchSubmit}>
        Submit
      </button>

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
