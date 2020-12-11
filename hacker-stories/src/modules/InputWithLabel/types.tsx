type InputWithLabelProps = {
  id: string;
  type?: string;
  value: string;
  onInputChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
  outputString: string;
  isFocused?: boolean;
  children: React.ReactNode;
};

export type { InputWithLabelProps };
