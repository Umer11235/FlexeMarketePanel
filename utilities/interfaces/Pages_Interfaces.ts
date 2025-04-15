export interface ICategoryAttribute {
  id:string;
  name: string;
  categoryId?: string;
  placeholder: string;
  type?: number;
  valueType: string;
  markForVariant?:boolean;
  sortOrder?: number;
}
  