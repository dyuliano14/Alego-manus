// src/components/ui/select.tsx
import React, { useState } from "react";

interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

interface SelectContextProps {
  value: string;
  setValue: (value: string) => void;
}

const SelectContext = React.createContext<SelectContextProps | null>(null);

export const Select: React.FC<SelectProps> = ({
  children,
  value,
  defaultValue = "",
  onValueChange,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const actualValue = value ?? internalValue;

  const handleChange = (val: string) => {
    setInternalValue(val);
    onValueChange?.(val);
  };

  return (
    <SelectContext.Provider
      value={{ value: actualValue, setValue: handleChange }}
    >
      <div className="relative w-full">{children}</div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const context = React.useContext(SelectContext);
  if (!context) return null;

  return (
    <div className="relative">
      <button
        className="w-full border border-input bg-background text-sm px-3 py-2 rounded-md"
        onClick={() => setOpen(!open)}
        type="button"
      >
        {children}
      </button>
      {open && <SelectContent onClose={() => setOpen(false)} />}
    </div>
  );
};

export const SelectValue: React.FC<{ placeholder: string }> = ({
  placeholder,
}) => {
  const context = React.useContext(SelectContext);
  if (!context) return null;
  return <span>{context.value || placeholder}</span>;
};

export const SelectContent: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  return (
    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
      <div className="flex flex-col">{onClose && <></>}</div>
    </div>
  );
};

export const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => {
  const context = React.useContext(SelectContext);
  if (!context) return null;

  return (
    <button
      className="text-left w-full px-3 py-2 hover:bg-gray-100 text-sm"
      onClick={() => context.setValue(value)}
    >
      {children}
    </button>
  );
};
