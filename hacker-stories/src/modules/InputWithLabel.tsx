import React from "react";

import styles from "../App.module.css";

type InputWithLabelProps = {
  id: string;
  type?: string;
  value: string;
  onInputChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
  outputString: string;
  isFocused?: boolean;
  children: React.ReactNode;
};

const InputWithLabel = ({
  id,
  type = "text",
  value,
  onInputChanged,
  outputString,
  isFocused,
  children,
}: InputWithLabelProps) => {
  // (2A) create an inputRef
  const inputRef = React.useRef<HTMLInputElement>(null!);

  // (2C) Go into React's lifecycle. Perform the focus when the element renders or
  // when its dependencies change
  React.useEffect(() => {
    // Check if the `.current` property exists
    if (isFocused && inputRef.current) {
      // (2D) Since `inputRef` is passed into the `input` element as the `ref` attribute,
      // `.current` property gives us access to that `input` element
      inputRef.current.focus();
      console.log("Focusing!");
    }
  }, [isFocused]);

  // (1B) Use the callback function
  return (
    <>
      <label htmlFor={id} className={styles["label"]}>
        {children}
      </label>
      <input
        /** (2B) The `inputRef` variable is passed to JSX's reserved `ref` attribute.
         * The element instance is assigned to the mutable `current` property
         */
        ref={inputRef}
        id={id}
        type={type}
        onChange={onInputChanged}
        value={value}
        className={styles["input"]}
      />

      <p>
        {outputString} <strong>'{value}'</strong>
      </p>
    </>
  );
};

export default InputWithLabel;
