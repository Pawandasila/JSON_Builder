import type { SchemaType } from "@/types/Schema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FormField from "./FormField";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { v4 as uuid4 } from "uuid";
import { GenerateJsonFromSchema } from "@/utils/GenerateJson";

const JsonSchema = () => {
  const [fields, setFields] = useState<SchemaType[]>([
    { id: "1", key: "", type: "string", required: true },
  ]);

  const updateField = (
    prevField: SchemaType[],
    id: string,
    updates: any
  ): SchemaType[] => {
    return prevField.map((field) => {
      if (field.id === id) {
        return { ...field, ...updates };
      }
      if (field.children) {
        return {
          ...field,
          children: updateField(field.children, id, updates),
        };
      }
      return field;
    });
  };

  const addnewChild = (fieldList: SchemaType[], parentId: string):SchemaType[] => {
    return fieldList.map((field) => {
      if (field.id === parentId && field.type === "nested") {
        const newField: SchemaType = {
          id: uuid4(),
          key: "",
          type: "string",
          required: false,
        };
        console.log(fieldList);
        return {
          ...field,
          children: [...(field.children || []), newField],
        };
      }
      if(field.children){
        return{
            ...field,
            children : addnewChild(field.children , parentId)
        }
      }
      return field;
    });
  };

  const onDelete = (prevField : SchemaType[] , id : string) : SchemaType[]=>{
    const filtered =  prevField.filter((fields) => fields.id !== id )
    return filtered.map((field)=>{
        if(field.children){
            return{
                ...field,
                children : onDelete(field.children , id)
            }
        }
        return field;
    })

  }

  const { handleSubmit } = useForm();

  const handleAddChild = (parentId: string) => {
    setFields((prevField) => addnewChild(prevField, parentId));
  };

  const handleDelete = (id: string) => {
    setFields((prevField) => onDelete(prevField , id))
  };

  const handleUpdate = (id: string, updated: any) => {
    setFields((prevFields) => updateField(prevFields, id, updated));
  };

  const addNewField = () => {
    const newField: SchemaType = {
      id: uuid4(),
      key: "",
      type: "string",
      required: false,
    };
    setFields((prevField) => [...prevField, newField]);
  };

  const onSubmit= ()=>{
    const schema = GenerateJsonFromSchema(fields);
    console.log(schema);
  }

  const jsonPreview = GenerateJsonFromSchema(fields);

  return (
    <div className="container p-4 rounded-lg shadow-md mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  field={field}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  onAddChild={handleAddChild}
                  dept={0}
                />
              ))}
            </div>

            <Button
              className="flex items-center justify-center w-full py-2"
              type="button"
              onClick={addNewField}
            >
              <Plus size={16} />
              Add field
            </Button>
            <Button type="submit" className="mt-4 ">Submit</Button>
          </form>
        </div>

        <div>{Object.keys(jsonPreview).length > 0 ? (
            <pre>{JSON.stringify(jsonPreview , null , 2)}</pre>
        ): (
            <p>output screen</p>
        )}</div>
      </div>

    </div>
  );
};

export default JsonSchema;
