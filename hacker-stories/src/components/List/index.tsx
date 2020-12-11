import React from "react";

import styles from "./style.module.css";
import { ListProps } from "./types";
import { Item } from "./Item";

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
