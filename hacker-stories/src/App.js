import React from "react";

// CONSTANTS
const TYPE_SET_STORIES = 0;
const TYPE_REMOVE_STORIES = 1;

const title = "React";
const welcome = {
  greeting: "Hey",
  title: title,
};

const initialStories_ = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const getAsyncStories = () => {
  const sleep_milliseconds = 2000;
  console.log(`Sleeping for ${sleep_milliseconds} milliseconds`);
  return new Promise((resolve) => {
    return setTimeout(
      () => resolve({ data: { stories: initialStories_ } }),
      sleep_milliseconds
    );
  });
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
  onChangeHandler,
  value,
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
        onChange={onChangeHandler}
        value={value}
      />

      <p>
        {outputString} <strong>'{value}'</strong>
      </p>
    </>
  );
};

/**
 *
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
    case TYPE_SET_STORIES:
      return action.payload;
    case TYPE_REMOVE_STORIES:
      return state.filter(
        (story) => action.payload.objectID !== story.objectID
      );
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

  /** Due to empty dependency array, the side-effect only runs once the component
   * renders for the first time.
   */
  // const [stories, setStories] = React.useState([]);
  const [stories, dispatchStories] = React.useReducer(storiesReducer, []);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);

    getAsyncStories()
      .then((result) => {
        dispatchStories({
          type: TYPE_SET_STORIES,
          /** In the payload, pass in data */
          payload: result.data.stories,
        });
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
      });
  }, []);

  // (1A) Introduce callback function. Pass this function via `props`
  const handleSearch = (event) => {
    // (1C) Calls back to the place where it was introduced
    setSearchTerm(event.target.value);
  };

  const searchStories = stories.filter((story) => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: TYPE_REMOVE_STORIES,
      payload: item,
    });
  };

  return (
    <div>
      <h1>
        {welcome.greeting} {welcome.title}
      </h1>

      <h1>Hello {getTitle("React")}</h1>
      <hr />

      <InputWithLabel
        id="search"
        onChangeHandler={handleSearch}
        value={searchTerm}
        outputString="The Search Term is: "
        isFocused={true}
      >
        <strong>Search: &nbsp;</strong>
      </InputWithLabel>

      {isError && <p>Cannot retrieve stories data.</p>}

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={searchStories} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

export default App;
