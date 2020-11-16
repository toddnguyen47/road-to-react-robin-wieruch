import React from "react";
// import { render } from "@testing-library/react";
import renderer from "react-test-renderer";
// import App, { Item } from "./StyledComponents/App.tsx";
import App, { Item, List } from "./App.tsx";

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
