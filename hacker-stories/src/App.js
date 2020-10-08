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
  return (
    <div>
      {list.map(({ objectID, ...item }) => {
        // list.map() uses `rest` operation
        // {...item} uses `spread` operation
        // Return a component for the particular `item`
        return <Item key={objectID} {...item} />;
      })}
    </div>
  );
}

const Item = ({ title, url, author, num_comments, points }) => {
  return (
    <ul>
      <a href={url}>{title}</a>
      <li>Author: {author}</li>
      <li>Number of Comments: {num_comments}</li>
      <li>Points: {points}</li>
    </ul>
  );
};

// /** Passing in a full props javascript object */
// const Search = (props) => {

/** Destructuring in the function parameter! */
const Search = ({ onSearch, searchTerm }) => {
  // console.log("In Search Component");
  // console.log(props);

  // // Object destructuring
  // const { onSearch, searchTerm } = props;

  // (B) Use the callback function
  return (
    <div>
      {/* <h1>Hello {title}</h1> */}
      <h1>
        {welcome.greeting} {welcome.title}
      </h1>

      <h1>Hello {getTitle("React")}</h1>

      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={onSearch} value={searchTerm} />

      <p>
        The Search Term is: <strong>'{searchTerm}'</strong>
      </p>
    </div>
  );
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

  const [searchTerm, setSearchTerm] = React.useState("React");

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
      <hr />

      <Search onSearch={handleSearch} searchTerm={searchTerm} />

      <List list={searchStories} />
    </div>
  );
};

export default App;
