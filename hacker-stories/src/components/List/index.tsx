import React from "react";

import styles from "./style.module.css";
import sharedStyles from "../shared/style.module.css";
import { ItemProps, ListProps } from "./types";

const Item = ({ item, onRemoveItem }: ItemProps) => {
  return (
    <div className={styles["item"]}>
      <span style={{ width: "40%" }}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{ width: "30%" }}>{item.author}</span>
      <span style={{ width: "10%" }}>{item.num_comments}</span>
      <span style={{ width: "10%" }}>{item.points}</span>
      <span style={{ width: "10%" }}>
        <button
          type="button"
          className={`${sharedStyles["button"]} ${sharedStyles["button__small"]}`}
          onClick={() => onRemoveItem(item)}
        >
          Dismiss
        </button>
      </span>
    </div>
  );
};

// const List = (props) => {
function List({ list, onRemoveItem }: ListProps) {
  return (
    <>
      <div className={styles["item"]}>
        <span style={{ width: "40%" }}>URL</span>
        <span style={{ width: "30%" }}>Author</span>
        <span style={{ width: "10%" }}># Comments</span>
        <span style={{ width: "10%" }}>Points</span>
        <span style={{ width: "10%" }}></span>
      </div>

      <div>
        {list.map((item) => {
          return (
            <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
          );
        })}
      </div>
    </>
  );
}

export default List;
