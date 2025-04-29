
//for SearchFilter

 interface FilterOption {
  key: string;
  value: string | number;
}

export interface ISearchFiltersFields{
  filters: {
    name: string;
    type: "text" | "select";
    options?: FilterOption[]; // Options for select filters
    placeholder?: string; // Placeholder for text filters
  }[];
} 


export interface ISearchFiltersProps {
  filters: ISearchFiltersFields["filters"];
  onApply: (filterValues: Record<string, any>) => void;
  onReset: () => void;
  bgColor?: string;
}

//-------------for SearchFilter--------------



export interface Column {
    key?: any;
    label?: any;
  }
  
  
  export interface UserListComponentProps<T> {
    apiEndpoint: string;
    apiVersion?: string;
    deleteApie?: string;
    columns: Column[];
    itemsPerPage?: number;
    bgColor?: string;
    Action?: string | "";
    removeListId?: string;
    // token: string;
    onEdit?:(id:string, item:T)=>void;
    onDelete?:(guid:string, id?:string)=>void;
    onCancel?:(id:string)=>void;
    onView?:(id:string)=>string;
    isModalOpen?:boolean;
    setIsModalOpen?:(value:boolean)=>void;
    onItemsPerPageChange?: (newItemsPerPage: number) => void;
    filterss?:ISearchFiltersFields["filters"];

  }
  


  export interface UpdateProductListProps {
    apiEndpoint: string;
    columns: Column[];
    sharedList?: any[];
    onListChange?: (list: any[]) => void;
    deleteApie?: string;
  }


  ///CommonListV2 Component
  export interface ColumnV2<T> {
    key: keyof T;
    label: string;
    render?: (value: any, record: T) => React.ReactNode;
  
  }
  
  export interface CommonListPropsV2<T> {
    apiEndpoint: string;
    columns: ColumnV2<T>[];
    sharedList?: T[];
    onListChange?: (updatedList: T[]) => void;
    onView?:(id:string)=>string;
    onEdit?: (id: string, updatedData: T) => void;
    onDelete?:(id:string)=>void;
    onSetValue?:(id:string)=>void;
    deleteApi?: string;
    payloads?: any;
    attributesColumn?: {
      header: string;
      render?: (id: string) => React.ReactNode;
      
    };

    bgColor?: string;
    filtersPatterns?:ISearchFiltersFields["filters"];
  }
  