import React, { useState } from "react";

interface SelectProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  defaultValue,
  value,
  onValueChange,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue || "");
  const current = value ?? internal;

  const handleItemClick = (val: string) => {
    if (value === undefined) setInternal(val);
    onValueChange?.(val);
    setOpen(false);
  };

  return (
    <div className="relative inline-block w-full">
      <div onClick={() => setOpen((o) => !o)}>
        {React.Children.toArray(children).find(
          (c: any) => c.type === SelectTrigger,
        )}
      </div>

      {open && (
        <div className="absolute mt-1 w-full z-50">
          {React.Children.map(children, (c: any) =>
            c.type === SelectContent
              ? React.cloneElement(c, {
                  children: React.Children.map(c.props.children, (item: any) =>
                    React.cloneElement(item, {
                      onClick: () => handleItemClick(item.props.value),
                    }),
                  ),
                })
              : null,
          )}
        </div>
      )}
    </div>
  );
};

export const SelectTrigger: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <button
    type="button"
    className={`flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm ${className}`}
  >
    {children}
  </button>
);

export const SelectContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="rounded-md border bg-popover">{children}</div>;

export const SelectItem: React.FC<
  React.PropsWithChildren<{ value: string }>
> = ({ children, ...props }) => (
  <div
    className="px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
    {...props}
  >
    {children}
  </div>
);

export const SelectValue: React.FC<{ placeholder?: string }> = ({
  placeholder,
}) => <span>{placeholder}</span>;
