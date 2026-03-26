"use client";

import * as React from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle2, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import "./FormInput.css";

// ─── Country Dial Codes ────────────────────────────────────────────────────────

export interface CountryCode {
  code: string;   // ISO 3166-1 alpha-2 (e.g. "VE")
  dial: string;   // dial prefix (e.g. "+58")
  flag: string;   // emoji flag
  name: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: "AR", dial: "+54", flag: "🇦🇷", name: "Argentina" },
  { code: "BO", dial: "+591", flag: "🇧🇴", name: "Bolivia" },
  { code: "BR", dial: "+55", flag: "🇧🇷", name: "Brasil" },
  { code: "CL", dial: "+56", flag: "🇨🇱", name: "Chile" },
  { code: "CO", dial: "+57", flag: "🇨🇴", name: "Colombia" },
  { code: "CR", dial: "+506", flag: "🇨🇷", name: "Costa Rica" },
  { code: "CU", dial: "+53", flag: "🇨🇺", name: "Cuba" },
  { code: "DO", dial: "+1", flag: "🇩🇴", name: "Rep. Dominicana" },
  { code: "EC", dial: "+593", flag: "🇪🇨", name: "Ecuador" },
  { code: "SV", dial: "+503", flag: "🇸🇻", name: "El Salvador" },
  { code: "GT", dial: "+502", flag: "🇬🇹", name: "Guatemala" },
  { code: "HN", dial: "+504", flag: "🇭🇳", name: "Honduras" },
  { code: "MX", dial: "+52", flag: "🇲🇽", name: "México" },
  { code: "NI", dial: "+505", flag: "🇳🇮", name: "Nicaragua" },
  { code: "PA", dial: "+507", flag: "🇵🇦", name: "Panamá" },
  { code: "PY", dial: "+595", flag: "🇵🇾", name: "Paraguay" },
  { code: "PE", dial: "+51", flag: "🇵🇪", name: "Perú" },
  { code: "PR", dial: "+1", flag: "🇵🇷", name: "Puerto Rico" },
  { code: "UY", dial: "+598", flag: "🇺🇾", name: "Uruguay" },
  { code: "VE", dial: "+58", flag: "🇻🇪", name: "Venezuela" },
  { code: "ES", dial: "+34", flag: "🇪🇸", name: "España" },
  { code: "US", dial: "+1", flag: "🇺🇸", name: "Estados Unidos" },
];

// ─── Validation Types ──────────────────────────────────────────────────────────

export type ValidationRule =
  | { type: "required"; message?: string }
  | { type: "minLength"; value: number; message?: string }
  | { type: "maxLength"; value: number; message?: string }
  | { type: "pattern"; value: RegExp; message?: string }
  | { type: "email"; message?: string }
  | { type: "custom"; validate: (v: string) => boolean; message: string };

export type ValidationState = "idle" | "error" | "success";

function runValidations(value: string, rules: ValidationRule[]): string | null {
  for (const rule of rules) {
    switch (rule.type) {
      case "required":
        if (!value.trim())
          return rule.message ?? "Este campo es obligatorio.";
        break;
      case "minLength":
        if (value.length < rule.value)
          return rule.message ?? `Mínimo ${rule.value} caracteres.`;
        break;
      case "maxLength":
        if (value.length > rule.value)
          return rule.message ?? `Máximo ${rule.value} caracteres.`;
        break;
      case "pattern":
        if (!rule.value.test(value))
          return rule.message ?? "Formato inválido.";
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return rule.message ?? "Correo electrónico inválido.";
        break;
      case "custom":
        if (!rule.validate(value))
          return rule.message;
        break;
    }
  }
  return null;
}

// ─── Phone Input Sub-component ─────────────────────────────────────────────────

interface PhoneDialSelectorProps {
  selected: CountryCode;
  options: CountryCode[];
  disabled?: boolean;
  onChange: (c: CountryCode) => void;
}

const PhoneDialSelector: React.FC<PhoneDialSelectorProps> = ({
  selected,
  options,
  disabled,
  onChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="form-input__dial-root">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={cn(
          "form-input__dial-trigger",
          disabled && "form-input__dial-trigger--disabled"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="form-input__dial-flag">{selected.flag}</span>
        <span className="form-input__dial-code">{selected.dial}</span>
        {!disabled && (
          <svg
            className={cn(
              "form-input__dial-chevron",
              open && "form-input__dial-chevron--open"
            )}
            viewBox="0 0 20 20"
            fill="currentColor"
            width="12"
            height="12"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.084l3.71-3.755a.75.75 0 111.08 1.04l-4.25 4.3a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {disabled && (
          <Flag
            size={10}
            strokeWidth={1.5}
            className="form-input__dial-lock"
          />
        )}
      </button>

      {open && (
        <ul
          role="listbox"
          className="form-input__dial-dropdown"
        >
          {options.map((c) => (
            <li
              key={c.code}
              role="option"
              aria-selected={c.code === selected.code}
              className={cn(
                "form-input__dial-option",
                c.code === selected.code && "form-input__dial-option--active"
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(c);
                setOpen(false);
              }}
            >
              <span>{c.flag}</span>
              <span className="form-input__dial-option-name">{c.name}</span>
              <span className="form-input__dial-option-code">{c.dial}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ─── Character Counter ─────────────────────────────────────────────────────────

interface CharCounterProps {
  current: number;
  max: number;
}

const CharCounter: React.FC<CharCounterProps> = ({ current, max }) => {
  const isNearLimit = current >= max * 0.85;
  const isAtLimit = current >= max;
  return (
    <span
      className={cn(
        "form-input__char-counter",
        isAtLimit && "form-input__char-counter--limit",
        !isAtLimit && isNearLimit && "form-input__char-counter--warning"
      )}
    >
      {current}/{max}
    </span>
  );
};

// ─── FormInput Props ───────────────────────────────────────────────────────────

export interface FormInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Label displayed above the input */
  label: string;
  /** Optional hint text below label */
  hint?: string;
  /** Input type. Use "phone" to include country code picker. */
  type?: "text" | "email" | "password" | "phone" | "number" | "url" | "search";
  /** Validation rules evaluated on blur and on change (after first blur) */
  rules?: ValidationRule[];
  /** Show a success checkmark when valid and touched */
  showSuccess?: boolean;
  /** Optional trailing (right) element inside the input  */
  trailingElement?: React.ReactNode;
  /** Optional leading (left) element inside the input (ignored for phone) */
  leadingElement?: React.ReactNode;
  /** For phone inputs: list of selectable country codes */
  countryCodes?: CountryCode[];
  /** For phone inputs: default selected country */
  defaultCountry?: string;
  /**
   * For phone inputs: lock the country code selector so users
   * cannot change the prefix (useful for single-country apps).
   */
  dialLocked?: boolean;
  /**
   * Callback fired when the full phone value changes.
   * Returns `{ dial, number, full }` where `full = dial + number`.
   */
  onPhoneChange?: (value: { dial: string; number: string; full: string }) => void;
  /** Maximum character length — shows a character counter */
  maxChars?: number;
  /** External validation error (controlled) */
  error?: string;
  /** Override internal validation with a "success" state */
  success?: boolean;
  /** Helper text shown below the input (replaced by error when invalid) */
  helperText?: string;
}

// ─── FormInput Component ───────────────────────────────────────────────────────

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      hint,
      type = "text",
      rules = [],
      showSuccess = true,
      trailingElement,
      leadingElement,
      countryCodes = COUNTRY_CODES,
      defaultCountry = "VE",
      dialLocked = false,
      onPhoneChange,
      maxChars,
      error: externalError,
      success: externalSuccess,
      helperText,
      className,
      onChange,
      onBlur,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? React.useId();
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    // Password visibility
    const [showPassword, setShowPassword] = React.useState(false);

    // Validation state
    const [touched, setTouched] = React.useState(false);
    const [internalError, setInternalError] = React.useState<string | null>(null);
    const [internalValue, setInternalValue] = React.useState(
      (props.value as string) ?? (props.defaultValue as string) ?? ""
    );

    // Phone state
    const defaultCountryObj =
      countryCodes.find((c) => c.code === defaultCountry) ?? countryCodes[0];
    const [selectedCountry, setSelectedCountry] =
      React.useState<CountryCode>(defaultCountryObj);

    const validate = React.useCallback(
      (value: string) => {
        if (rules.length === 0) return;
        const err = runValidations(value, rules);
        setInternalError(err);
      },
      [rules]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInternalValue(val);

      if (touched) validate(val);

      if (type === "phone") {
        onPhoneChange?.({
          dial: selectedCountry.dial,
          number: val,
          full: `${selectedCountry.dial}${val}`,
        });
      }

      onChange?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true);
      validate(internalValue);
      onBlur?.(e);
    };

    const handleCountryChange = (country: CountryCode) => {
      setSelectedCountry(country);
      onPhoneChange?.({
        dial: country.dial,
        number: internalValue,
        full: `${country.dial}${internalValue}`,
      });
    };

    const resolvedError = externalError ?? internalError ?? null;
    const isError = !!resolvedError;
    const isSuccess =
      externalSuccess ??
      (showSuccess && touched && !isError && internalValue.length > 0);

    const validationState: ValidationState = isError
      ? "error"
      : isSuccess
        ? "success"
        : "idle";

    // Resolve input type for <input> element
    const resolvedType =
      type === "phone"
        ? "tel"
        : type === "password"
          ? showPassword
            ? "text"
            : "password"
          : type;

    const hasPrefix = type !== "phone" && !!leadingElement;

    return (
      <div className={cn("form-input__root", className)}>
        {/* Label */}
        <label htmlFor={inputId} className="form-input__label">
          {label}
          {rules.some((r) => r.type === "required") && (
            <span className="form-input__required" aria-hidden="true">
              *
            </span>
          )}
        </label>

        {/* Optional hint under label */}
        {hint && (
          <span id={hintId} className="form-input__hint-label">
            {hint}
          </span>
        )}

        {/* Input wrapper */}
        <div
          className={cn(
            "form-input__wrapper bg-primary-white",
            validationState === "error" && "form-input__wrapper--error",
            validationState === "success" && "form-input__wrapper--success",
            "bg-primary-orange"
          )}
        >
          {/* Phone: country dial selector */}
          {type === "phone" && (
            <>
              <PhoneDialSelector
                selected={selectedCountry}
                options={countryCodes}
                disabled={dialLocked}
                onChange={handleCountryChange}
              />
              <div className="form-input__phone-divider" />
            </>
          )}

          {/* Left leading element */}
          {hasPrefix && (
            <span className="form-input__prefix">{leadingElement}</span>
          )}

          {/* Native input */}
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            value={props.value !== undefined ? props.value : internalValue}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={isError}
            aria-describedby={
              [isError ? errorId : null, hint ? hintId : null]
                .filter(Boolean)
                .join(" ") || undefined
            }
            maxLength={maxChars}
            inputMode={type === "phone" ? "numeric" : undefined}
            className={cn(
              "form-input__field",
              hasPrefix && "form-input__field--has-prefix",
              type === "phone" && "form-input__field--phone"
            )}
            {...props}
          />

          {/* Right: char counter / password toggle / validation icon / custom suffix */}
          <div className="form-input__trailing">
            {/* Trailing element slot */}
            {trailingElement && (
              <span className="form-input__suffix">{trailingElement}</span>
            )}

            {/* Password toggle */}
            {type === "password" && (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="form-input__password-toggle"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={1.75} />
                ) : (
                  <Eye size={18} strokeWidth={1.75} />
                )}
              </button>
            )}

            {/* Validation state icon */}
            {validationState === "error" && (
              <AlertCircle
                size={16}
                strokeWidth={2}
                className="form-input__icon form-input__icon--error"
              />
            )}
            {validationState === "success" && (
              <CheckCircle2
                size={16}
                strokeWidth={2}
                className="form-input__icon form-input__icon--success"
              />
            )}
          </div>
        </div>

        {/* Bottom row: error / helper text + char counter */}
        <div className="form-input__bottom">
          <span>
            {isError ? (
              <span id={errorId} role="alert" className="form-input__error-text">
                {resolvedError}
              </span>
            ) : helperText ? (
              <span className="form-input__helper-text">{helperText}</span>
            ) : null}
          </span>
          {maxChars !== undefined && (
            <CharCounter current={internalValue.length} max={maxChars} />
          )}
        </div>
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export { FormInput };
