interface Icheckbtn {
    id: string;
    label: string;
    checked: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }