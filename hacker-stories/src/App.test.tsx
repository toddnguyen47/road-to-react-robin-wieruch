import React from "react";
// import { render } from "@testing-library/react";
import renderer from "react-test-renderer";

import App from "./App";

import List from "./components/List";

import axios from "axios";
// import { promises } from "fs";
jest.mock("axios");

// test("renders learn react link", () => {
//   const { getByText } = render(<App />);
//   const linkElement = getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

describe("App", () => {
  const _mockList = [
    {
      objectID: 0,
      url: "https://reactjs.org/",
      title: "React",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
    },
    {
      objectID: 1,
      url: "https://redux.js.org/",
      title: "Redux",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
    },
  ];

  const _mockedAxios = axios as jest.Mocked<typeof axios>;

  it("succeeds fetching data with a list", async () => {
    // Mock our returned promise from axios
    const returnedPromise = Promise.resolve({
      data: {
        hits: _mockList,
      },
    });
    _mockedAxios.get.mockImplementationOnce(() => returnedPromise);

    let component: any;
    await renderer.act(async () => {
      component = renderer.create(<App />);
    });

    expect(component.root.findByType(List).props.list).toEqual(_mockList);
  });

  it("fails fetching data with a list, testing error message", async () => {
    const rejectedPromise = Promise.reject();
    _mockedAxios.get.mockImplementationOnce(() => rejectedPromise);

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
