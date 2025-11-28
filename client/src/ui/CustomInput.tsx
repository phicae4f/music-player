import type { InputHTMLAttributes } from "react";

interface CustomInputProps extends InputHTMLAttributes<HTMLElement> {
    labelText: string,
    placeholder: string,
    id: string,
    type: string,
    error?: string | null
}

export const CustomInput = ({labelText, placeholder, id, type, error=null, ...inputProps}:CustomInputProps) => {
  return (
    <div className="custom-input">
      <label className="custom-input__label" htmlFor={id}>
        {labelText}
      </label>
      <input
        className="custom-input__field"
        type={type}
        placeholder={placeholder}
        id={id}
        {...inputProps}
      />
      {error && <span className="custom-input__error">{error}</span>}
    </div>
  );
};
