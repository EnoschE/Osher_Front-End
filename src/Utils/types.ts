// Defines the structure of a text snippet
export interface TextSnippet {
  _id: string;
  key: string;
  value: string;
  description: string;
  name: string;
  modifiedAt: Date;
  changed?: boolean;
}

export interface FormOnChange {
  name: string;
  value: string | number | any;
}

export interface DropDownOptionProps {
  text: string;
  value: string | number;
  disabled?: boolean;
  picture?: string;
}

export interface PageDetailsField {
  key: string;
  text: string;
  customComponent?: (props: any) => any;
  type?: "date";
}

export type UserRoleType = "Admin" | "Brand" | "Ad" | "Post" | "Influencer";
