import React from "react";
import classnames from "classnames";

import sharedStyles from "../shared/style.module.css";
import styles from "./style.module.css";

import InputWithLabel from "../InputWithLabel";
import { SearchFormProps } from "./types";

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}: SearchFormProps) => {
  return (
    <>
      <form onSubmit={onSearchSubmit} className={styles["searchForm"]}>
        <InputWithLabel
          id="search"
          value={searchTerm}
          onInputChanged={onSearchInput}
          isFocused={true}
          outputString="The Search Term is: "
        >
          <strong>Search: &nbsp;</strong>
        </InputWithLabel>

        <button
          type="submit"
          disabled={!searchTerm}
          className={classnames(
            sharedStyles["button"],
            sharedStyles["button__large"]
          )}
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default SearchForm;
