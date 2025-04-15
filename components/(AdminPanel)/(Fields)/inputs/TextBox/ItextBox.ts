interface ITextbox {
    name: string;
    type: string;
    label: string;
    SetWidth:string;
    SetMargin?:string;
    Flex?:string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
