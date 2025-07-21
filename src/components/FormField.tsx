import type { SchemaType } from "@/types/Schema";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Plus, X } from "lucide-react";
import { Switch } from "./ui/switch";

interface FormFieldProps {
  field: SchemaType;
  onUpdate: (id: string, updated: any) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string) => void;
  dept?: number;
}

const FormField: React.FC<FormFieldProps> = ({
  field,
  onUpdate,
  onAddChild,
  onDelete,
  dept = 0,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(field.id, { key: e.target.value });
  };

  const handleAddChild = () => {
    onAddChild(field.id);
  };

  const handleValueChange = (value: string) => {
    onUpdate(field.id, { type: value });
  };

  return (
    <div style={{ marginLeft: dept * 20 }}>
      <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-white shadow-sm mb-2">
        <input
          type="text"
          value={field.key}
          onChange={handleChange}
          placeholder="Field name"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <Select value={field.type} onValueChange={handleValueChange}>
          <SelectTrigger className="w-[120px] h-10">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="string">String</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="nested">Object</SelectItem>
          </SelectContent>
        </Select>

        <Switch checked={field.required} onCheckedChange={(checked)=> onUpdate(field.id , {required : checked})} />


        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => onDelete(field.id)}
          className="h-10 w-10 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <X size={14} />
        </Button>
      </div>

      {field.type === "nested" && (
        <div className="ml-4 border-l-2 mb-2 border-gray-200 pl-4 mt-2">
          {field.children &&
            field.children.map((child) => (
              <FormField
                key={child.id}
                field={child}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onAddChild={onAddChild}
                dept={dept + 1}
              />
            ))}

          <Button
            variant="outline"
            size="sm"
            type="button"
            className="mt-2  mb-2 w-full bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300"
            onClick={handleAddChild}
          >
            <Plus size={14} className="mr-1" />
            Add nested field
          </Button>
        </div>
      )}
    </div>
  );
};

export default FormField;
