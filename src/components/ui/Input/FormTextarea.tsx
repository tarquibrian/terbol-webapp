"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ValidationRule, ValidationState } from "./FormInput";
import "./FormInput.css";

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

export interface FormTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  /** Label displayed above the textarea */
  label: string;
  /** Optional hint text shown below label */
  hint?: string;
  /** Validation rules evaluated on blur */
  rules?: ValidationRule[];
  /** Show a success checkmark when valid and touched */
  showSuccess?: boolean;
  /** Maximum character length — shows a character counter */
  maxChars?: number;
  /** External validation error (controlled) */
  error?: string;
  /** Override internal validation with a "success" state */
  success?: boolean;
  /** Helper text shown below the textarea (replaced by error when invalid) */
  helperText?: string;
  /** Controlled onChange */
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /** Minimum number of visible rows (default: 4) */
  minRows?: number;
  /** Whether the textarea should auto-resize to fit its content */
  autoResize?: boolean;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      label,
      hint,
      rules = [],
      showSuccess = true,
      maxChars,
      error: externalError,
      success: externalSuccess,
      helperText,
      className,
      onChange,
      onBlur,
      id,
      minRows = 4,
      autoResize = false,
      style,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    const [touched, setTouched] = React.useState(false);
    const [internalError, setInternalError] = React.useState<string | null>(null);
    const [internalValue, setInternalValue] = React.useState(
      (props.value as string) ?? (props.defaultValue as string) ?? ""
    );
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        textareaRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const adjustHeight = React.useCallback(() => {
      if (!autoResize || !textareaRef.current) return;
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }, [autoResize]);

    React.useEffect(() => {
      adjustHeight();
    }, [internalValue, adjustHeight]);

    const validate = React.useCallback(
      (value: string) => {
        if (rules.length === 0) return;
        const err = runValidations(value, rules);
        setInternalError(err);
      },
      [rules]
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setInternalValue(val);
      if (touched) validate(val);
      onChange?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setTouched(true);
      validate(internalValue);
      onBlur?.(e);
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

        {/* Hint under label */}
        {hint && (
          <span id={hintId} className="form-input__hint-label">
            {hint}
          </span>
        )}

        {/* Textarea wrapper */}
        <div
          className={cn(
            "form-input__wrapper form-input__wrapper--textarea",
            validationState === "error" && "form-input__wrapper--error",
            validationState === "success" && "form-input__wrapper--success"
          )}
        >
          <textarea
            ref={setRefs}
            id={inputId}
            rows={minRows}
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
            className="form-input__textarea"
            style={{
              resize: autoResize ? "none" : "vertical",
              ...style,
            }}
            {...props}
          />

          {/* Validation icon in top-right corner */}
          <span className="form-input__textarea-icon">
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
          </span>
        </div>

        {/* Bottom row */}
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
            <span
              className={cn(
                "form-input__char-counter",
                internalValue.length >= maxChars &&
                  "form-input__char-counter--limit",
                internalValue.length >= maxChars * 0.85 &&
                  internalValue.length < maxChars &&
                  "form-input__char-counter--warning"
              )}
            >
              {internalValue.length}/{maxChars}
            </span>
          )}
        </div>
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";

export { FormTextarea };
