import renderer from "react-test-renderer";

import { Item } from "./Item";

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

  it.skip("renders snapshot", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
