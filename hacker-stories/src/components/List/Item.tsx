import { ItemProps } from "./types";

import sharedStyles from "../shared/style.module.css";
import styles from "./style.module.css";

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

export { Item };
