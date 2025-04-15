interface IDropdownProps {
    label: string;
    options: { value: string; label: string }[];
    selectedValue?: string|number;
    Setwidth?:string
    onChange: (value: string) => void;
    placeholder?: string;
  }