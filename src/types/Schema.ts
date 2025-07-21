export type FieldType = "string" | 'number' | 'nested';

export interface SchemaType{
    id : string,
    key : string,
    type : FieldType,
    required : boolean,
    children?: SchemaType[];
}