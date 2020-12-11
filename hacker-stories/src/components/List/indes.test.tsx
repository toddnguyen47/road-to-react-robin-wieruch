import renderer from "react-test-renderer";

import List from "./index";
import { Item } from "./Item";

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
