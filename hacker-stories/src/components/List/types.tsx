import { Story, Stories } from "../Stories";

type OnRemoveItem = (item: Story) => void;

type ListProps = {
  list: Stories;
  onRemoveItem: OnRemoveItem;
};

type ItemProps = {
  item: Story;
  onRemoveItem: OnRemoveItem;
};

export type { OnRemoveItem, ListProps, ItemProps };
