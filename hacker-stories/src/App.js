import React from "react";

const title = "React";
const welcome = {
  greeting: "Hey",
  title: "React",
};

/**
 *
 * @param {String} title
 */
function getTitle(title) {
  return "| " + title + " |";
}

// const List = (props) => {
function List({ list }) {
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
        return <Item key={item.objectID} item={item} />;
      })}
    </div>
  );
}

const Item = ({ item }) => {
  return (
    <ul>
      <a href={item.url}>{item.title}</a>
      <li>Author: {item.author}</li>
      <li>Number of Comments: {item.num_comments}</li>
      <li>Points: {item.points}</li>
    </ul>
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
  children,
}) => {
  // console.log("In Search Component");
  // console.log(props);

  // // Object destructuring
  // const { onSearch, searchTerm } = props;

  // (B) Use the callback function
  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input id={id} type={type} onChange={onChangeHandler} value={value} />

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
  const stories = [
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

  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    "searchKey",
    "React"
  );

  // (A) Introduce callback function. Pass this function via `props`
  const handleSearch = (event) => {
    // (C) Calls back to the place where it was introduced
    setSearchTerm(event.target.value);
  };

  const searchStories = stories.filter((story) => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      {/* <h1>Hello {title}</h1> */}
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
      >
        <strong>Search: &nbsp;</strong>
      </InputWithLabel>

      <List list={searchStories} />
    </div>
  );
};

export default App;
