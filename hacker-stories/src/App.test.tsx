import React from "react";
// import { render } from "@testing-library/react";
import renderer from "react-test-renderer";

import App from "./App";

import { Item } from "./components/List/Item";
import List from "./components/List";

import SearchForm from "./components/SearchForm";
import InputWithLabel from "./components/InputWithLabel";

import axios from "axios";
// import { promises } from "fs";
jest.mock("axios");

// test("renders learn react link", () => {
//   const { getByText } = render(<App />);
//   const linkElement = getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

describe("Item", () => {
  const mockItem = {
    objectID: 0,
    url: "https://reactjs.org/",
    title: "React",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
  };

  let component: any;
  const handleRemoveItem = jest.fn(); // Create a mock function

  beforeEach(() => {
    renderer.act(() => {
      component = renderer.create(
        <Item item={mockItem} onRemoveItem={handleRemoveItem} />
      );
    });
  });

  it("renders all properties", () => {
    // expect(component.root.findByType("a").props.href).toEqual(
    //   "https://reactjs.org/"
    // );
    expect(
      component.root.findAllByProps({ href: "https://reactjs.org/" }).length
    ).toEqual(1);

    // expect(component.root.findAllByType("div")[2].props.children).toEqual(
    //   "Jordan Walke"
    // );
    expect(
      component.root.findAllByProps({ children: "Jordan Walke" }).length
    ).toEqual(1);
  });

  it("calls onRemoveItem() on button click", () => {
    component.root.findByType("button").props.onClick();

    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    expect(handleRemoveItem).toHaveBeenCalledWith(mockItem);

    expect(component.root.findAllByType(Item).length).toEqual(1);
  });

  it("renders snapshot", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("List", () => {
  const mockList = [
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

  const handleRemoveItem = jest.fn(); // Create a mock function
  it("Renders 2 Items. Note that the rendered objects are ITEMS, not LIST", () => {
    const component = renderer.create(
      <List list={mockList} onRemoveItem={handleRemoveItem} />
    );
    expect(component.root.findAllByType(Item).length).toEqual(2);
  });
});

describe("SearchForm", () => {
  const searchFormProps = {
    searchTerm: "React",
    onSearchInput: jest.fn(),
    onSearchSubmit: jest.fn(),
  };

  let component: any;

  beforeEach(() => {
    component = renderer.create(<SearchForm {...searchFormProps} />);
  });

  it("renders the input value with its field", () => {
    const value = component.root.findByType(InputWithLabel).props.value;
    // const value = component.root.findByType("input").props.value;
    expect(value).toEqual("React");
  });

  it("changes the input field", () => {
    const pseudoEvent = { target: "Redux" };
    component.root.findByType("input").props.onChange(pseudoEvent);

    expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
    expect(searchFormProps.onSearchInput).toHaveBeenCalledWith(pseudoEvent);
  });

  it("submits the form", () => {
    const pseudoEvent = {};
    component.root.findByType("form").props.onSubmit(pseudoEvent);

    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledWith(pseudoEvent);
  });

  it("disables button and prevents submit on empty search term", () => {
    const emptySearchTerm = "";
    component.update(
      <SearchForm {...searchFormProps} searchTerm={emptySearchTerm} />
    );
    expect(component.root.findByType("button").props.disabled).toBeTruthy();
  });
});

describe("App", () => {
  const _mockList = [
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

  // Mock our returned promise from axios
  const _returnedPromise = Promise.resolve({
    data: {
      hits: _mockList,
    },
  });

  const _rejectedPromise = Promise.reject();
  const _mockedAxios = axios as jest.Mocked<typeof axios>;

  it("succeeds fetching data with a list", async () => {
    _mockedAxios.get.mockImplementationOnce(() => _returnedPromise);

    let component: any;
    await renderer.act(async () => {
      component = renderer.create(<App />);
    });

    expect(component.root.findByType(List).props.list).toEqual(_mockList);
  });

  it("fails fetching data with a list, testing error message", async () => {
    _mockedAxios.get.mockImplementationOnce(() => _rejectedPromise);

    let component: any;
    await renderer.act(async () => {
      component = renderer.create(<App />);
    });

    expect(
      component.root.findAllByProps({
        children: "Cannot retrieve stories data.",
      }).length
    ).toEqual(1);
  });
});
