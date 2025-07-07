import React from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";

const FormularioGenerico = ({ fields, formData, onChange }) => {
  const handleChange = (id, value) => {
    if (typeof onChange === "function") {
      onChange(id, value);
    }
  };

  const handleOnlyNumberInput = (e, id) => {
    const value = e.target.value.replace(/\D/g, "");
    handleChange(id, value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-xl shadow-md w-full">
      {Array.isArray(fields) &&
        fields
          .filter((field) => field.visible !== false)
          .map((field) => (
            <div key={field.name} className={`p-field w-full ${field.colSize}`}>
              <label
                htmlFor={field.name}
                className="block text-sm font-semibold text-gray-700 mb-1">
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === "dropdown" && field.disabled ? (
                // Mostrar InputText cuando el dropdown está deshabilitado
                <InputText
                  value={
                    field.options?.find(
                      (opt) => opt.value === formData[field.name]
                    )?.label || ""
                  }
                  readOnly
                  className="w-full p-inputtext-sm"
                />
              ) : field.type === "dropdown" ? (
                <Dropdown
                  id={field.name}
                  value={formData[field.name]}
                  options={field.options}
                  onChange={(e) => handleChange(field.name, e.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full p-inputtext-sm"
                  disabled={field.disabled}
                />
              ) : field.type === "number" ? (
                <InputNumber
                  id={field.name}
                  value={formData[field.name]}
                  onValueChange={(e) => handleChange(field.name, e.value)}
                  mode={field.mode}
                  currency={field.currency}
                  locale={field.locale}
                  min={field.min}
                  step={field.step}
                  required={field.required}
                  className="w-full p-inputtext-sm"
                  disabled={field.disabled}
                  showButtons={field.showButtons || false}
                  buttonLayout="horizontal"
                />
              ) : field.type === "date" ? (
                <Calendar
                  id={field.name}
                  value={
                    formData[field.name] ? new Date(formData[field.name]) : null
                  }
                  onChange={(e) => handleChange(field.name, e.value)}
                  showIcon
                  required={field.required}
                  className="w-full p-inputtext-sm"
                  dateFormat="dd-mm-yy"
                  maxDate={new Date()}
                  minDate={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 180)
                    )
                  }
                  disabled={field.disabled}
                />
              ) : field.type === "onlyNumberText" ? (
                <InputText
                  id={field.name}
                  value={formData[field.name]}
                  onChange={(e) => handleOnlyNumberInput(e, field.name)}
                  required={field.required}
                  className="w-full p-inputtext-sm"
                />
              ) : field.type === "textarea" ? (
                <InputTextarea
                  id={field.name}
                  value={formData[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                  className="w-full p-inputtext-sm"
                  rows={field.rows || 4}
                  placeholder={field.placeholder}
                />
              ) : (
                <InputText
                  id={field.name}
                  value={formData[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                  className="w-full p-inputtext-sm"
                />
              )}
            </div>
          ))}
    </div>
  );
};

export default FormularioGenerico;
