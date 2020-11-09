import React from "react";
// import { render } from "@testing-library/react";
import renderer from "react-test-renderer";
// import App, { Item } from "./StyledComponents/App.tsx";
import App, { Item } from "./App.tsx";

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

  it("renders all properties", () => {
    let component;
    renderer.act(() => {
      component = renderer.create(<Item item={mockItem} />);
    });

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
});
