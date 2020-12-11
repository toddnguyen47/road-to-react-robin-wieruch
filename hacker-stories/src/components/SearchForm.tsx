import React from "react";
import classnames from "classnames";

import styles from "../App.module.css";
import InputWithLabel from "./InputWithLabel";

type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

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
          className={classnames(styles["button"], styles["button__large"])}
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default SearchForm;
