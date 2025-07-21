import type { SchemaType } from "@/types/Schema";

export const GenerateJsonFromSchema = (field : SchemaType[]) : Record<string , any> =>{
  const result: Record<string,any> = {};

  field.forEach(field=>{
    if(!field.key.trim()) return;

    if(field.type === 'string'){
      result[field.key] = "String"
    }else if(field.type === 'number'){
      result[field.key] = 'Number'
    }else if(field.type === 'nested'){
      if(field.children && field.children.length > 0){
        result[field.key] = GenerateJsonFromSchema(field.children)
      }else{
        result[field.key] = {}
      }
    }else{
      result[field.key] = "String"
    }
  })

  return result;
}