import React from "react";

const title = "React";
const welcome = {
  greeting: "Hey",
  title: "React",
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

/**
 *
 * @param {String} title
 */
function getTitle(title) {
  return "| " + title + " |";
}

// const List = (props) => {
function List({ list, onRemoveItem }) {
  // let listStories = props.list;

  // {{list.map(({ objectID, ...item }) => {
  //   // list.map() uses `rest` operation
  //   // {...item} uses `spread` operation
  //   // Return a component for the particular `item`
  //   return <Item key={objectID} {...item} />;
  // })}}
  return (
    <div>
      {list.map((item) => {
        return <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />;
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
        <button type="button" onClick={() => onRemoveItem(item)}>Dismiss</button>
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
  // console.log("In Search Component");
  // console.log(props);
  // // Object destructuring
  // const { onSearch, searchTerm } = props;

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

/**
 * This is the `App` component.
 * Everything outside is the global space!
 */
const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    "searchKey",
    "React"
  );

  const [stories, setStories] = React.useState(initialStories_);

  // (1A) Introduce callback function. Pass this function via `props`
  const handleSearch = (event) => {
    // (1C) Calls back to the place where it was introduced
    setSearchTerm(event.target.value);
  };

  const handleRemoveStory = (item) => {
    const newStories = stories.filter(
      story => item.objectID != story.objectID
    );
    setStories(newStories);
  }

  const searchStories = stories.filter((story) => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

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

      <List list={searchStories} onRemoveItem={handleRemoveStory} />
    </div>
  );
};

export default App;
