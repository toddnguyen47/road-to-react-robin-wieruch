import React from "react";
// import { render } from "@testing-library/react";
import renderer from "react-test-renderer";
import App, { Item } from "./StyledComponents/App";

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
    objectID: 0
  };

  it("renders all properties", () => {
    const component = renderer.create(<Item item={mockItem} />);

    expect(component.root.findByType("a").props.href).toEqual(
      "https://reactjs.org/"
    );
  });
});
