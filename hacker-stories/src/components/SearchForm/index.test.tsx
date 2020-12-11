import renderer from "react-test-renderer";

import SearchForm from "./index";
import InputWithLabel from "../InputWithLabel";

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
