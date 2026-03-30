"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onSearch?: (value: string) => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, placeholder = "Buscar...", onSearch, defaultValue, value: externalValue, onChange, ...props }, ref) => {
    const [value, setValue] = React.useState(defaultValue?.toString() || externalValue?.toString() || "");

    React.useEffect(() => {
      if (defaultValue !== undefined) {
        setValue(defaultValue.toString());
      }
    }, [defaultValue]);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    // Merge de refs (externo + interno)
    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const handleSearch = () => {
      onSearch?.(value);
    };

    const handleClear = () => {
      setValue("");
      onSearch?.("");
      inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };

    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border border-transparent bg-(--primary-soft-gray-light) h-12 transition-colors duration-200 pr-4",
          "hover:not-focus-within:border-input-hover",
          "focus-within:border-input-focus",
          className
        )}
      >
        <input
          ref={setRefs}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onChange?.(e);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-4 py-0 text-body-sm h-full text-foreground placeholder:text-(--grey-300) outline-none w-full"
          {...props}
        />

        {/* Botón de limpiar — solo visible cuando hay texto */}
        {value.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center justify-center text-(--grey-300) hover:text-(--grey-600) transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X />
          </button>
        )}

        {/* Botón de búsqueda */}
        <button
          type="button"
          onClick={handleSearch}
          className="flex items-center justify-center text-gray-900 hover:text-foreground transition-colors"
          aria-label="Buscar"
        >
          <Search size={24} strokeWidth={1.75} />
        </button>
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput };

