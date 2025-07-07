import React from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";

const FormularioAsignarRuta = ({ fields, formData, onChange }) => {
  const handleChange = (id, value) => {
    if (typeof onChange === "function") {
      onChange(id, value);
    }
  };

  const handleOnlyNumberInput = (e, id) => {
    const value = e.target.value.replace(/\D/g, ""); // Quita todo lo que no sea dígito
    handleChange(id, value);
  };

  return (
    <div className="grid gap-4 mt-4">
      {Array.isArray(fields) &&
        fields.map((field) => (
          <div key={field.id} className="p-field">
            <label htmlFor={field.id} className="block font-semibold">
              {field.label} {field.required && "*"}
            </label>

            {field.type === "dropdown" ? (
              <Dropdown
                id={field.id}
                value={formData[field.id]}
                options={field.options}
                onChange={(e) => {
                  handleChange(field.id, e.value);
                  if (field.onChange) {
                    field.onChange(e.value);
                  }
                }}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full"
                data-testid={`form-field-${field.id}`}
              />
            ) : field.type === "number" ? (
              <InputNumber
                id={field.id}
                value={formData[field.id]}
                onChange={(e) => handleChange(field.id, e.value)}
                mode={field.mode}
                currency={field.currency}
                locale={field.locale}
                min={field.min}
                required={field.required}
                className="w-full"
                data-testid={`form-field-${field.id}`}
              />
            ) : field.type === "date" ? (
              <Calendar
                id={field.id}
                value={formData[field.id] ? new Date(formData[field.id]) : null}
                onChange={(e) => handleChange(field.id, e.value)}
                showIcon
                required={field.required}
                className="w-full p-inputtext-sm"
                dateFormat="dd/mm/yy"
                minDate={
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 180)
                  )
                }
                disabled={field.disabled}
                data-testid={`form-field-${field.id}`}
              />
            ) : field.type === "onlyNumberText" ? (
              <InputText
                id={field.id}
                value={formData[field.id]}
                onChange={(e) => handleOnlyNumberInput(e, field.id)}
                required={field.required}
                className="w-full"
                data-testid={`form-field-${field.id}`}
              />
            ) : (
              <InputText
                id={field.id}
                value={formData[field.id]}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className="w-full"
                data-testid={`form-field-${field.id}`}
              />
            )}
          </div>
        ))}
    </div>
  );
};

export default FormularioAsignarRuta;
