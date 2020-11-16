import React from "react";
// import { render } from "@testing-library/react";
import renderer from "react-test-renderer";
// import App, { Item } from "./StyledComponents/App.tsx";
import App, { InputWithLabel, Item, List, SearchForm } from "./App.tsx";

import axios from "axios";
import { promises } from "fs";
jest.mock("axios");

// test("renders learn react link", () => {
//   const { getByText } = render(<App />);
//   const linkElement = getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

describe("Item", () => {
  const mockItem = {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  };

  let component;
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

  it("Renders 2 Items. Note that the rendered objects are ITEMS, not LIST", () => {
    const component = renderer.create(<List list={mockList} />);
    expect(component.root.findAllByType(Item).length).toEqual(2);
  });
});

describe("SearchForm", () => {
  const searchFormProps = {
    searchTerm: "React",
    onSearchInput: jest.fn(),
    onSearchSubmit: jest.fn(),
  };

  let component;

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
  it("succeeds fetching data with a list", async () => {
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

    // Mock our returned promise from axios
    const returnedPromise = Promise.resolve({
      data: {
        hits: mockList,
      },
    });
    axios.get.mockImplementationOnce(() => returnedPromise);

    let component;
    await renderer.act(async () => {
      component = renderer.create(<App />);
    });

    expect(component.root.findByType(List).props.list).toEqual(mockList);
  });

  it("fails fetching data with a list, testing error message", async () => {
    const mockPromise = Promise.reject;
    axios.get.mockImplementationOnce(() => returnedPromise);

    let component;
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
