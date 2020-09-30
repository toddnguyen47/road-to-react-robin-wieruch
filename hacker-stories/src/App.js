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
function List(props) {
  let listStories = props.list;
  return (
    <div>
      {listStories.map((item) => {
        /// Return a component for the particular `item`
        return (
          <div key={item.objectID}>
            <ul>
              <a href={item.url}>{item.title}</a>
              <li>Author: {item.author}</li>
              <li>Number of Comments: {item.num_comments}</li>
              <li>Points: {item.points}</li>
            </ul>
          </div>
        );
      })}
    </div>
  );
}

const Search = (props) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);

    // (B) Use the callback function
    props.onSearch(event);
  };

  return (
    <div>
      {/* <h1>Hello {title}</h1> */}
      <h1>
        {welcome.greeting} {welcome.title}
      </h1>

      <h1>Hello {getTitle("React")}</h1>

      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleInputChange} />

      <p>
        Searching for: '<strong>{searchTerm}</strong>'
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

  // (A) Introduce callback function. Pass this function via `props`
  const handleSearch = (event) => {
    // (C) Calls back to the place where it was introduced
    console.log(event.target.value);
  };

  return (
    <div>
      <hr />

      <Search onSearch={handleSearch} />

      <List list={stories} />
    </div>
  );
};

export default App;
