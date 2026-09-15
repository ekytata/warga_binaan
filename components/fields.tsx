export const inputClass =
  "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-foreground shadow-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15";

export const labelClass = "mb-1.5 block text-xs font-medium text-muted";

export function TextField({
  label,
  name,
  defaultValue,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
  autoComplete,
  error,
  className = "",
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className={labelClass} htmlFor={name}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        {...(value !== undefined
          ? { value, onChange }
          : { defaultValue: defaultValue ?? undefined })}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={inputClass}
        aria-invalid={error ? true : undefined}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function SelectField({
  label,
  name,
  defaultValue,
  required,
  options,
  placeholder = "Pilih…",
  error,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  options: string[];
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22none%22 stroke=%22%2371717a%22 stroke-width=%221.5%22><path d=%22M5 7.5 10 12.5 15 7.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-[right_0.75rem_center] bg-no-repeat pr-9`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function RadioField({
  label,
  name,
  defaultValue = "false",
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { label: string; value: string }[];
}) {
  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="flex gap-4 pt-1.5">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-1.5 text-sm">
            <input
              type="radio"
              name={name}
              value={opt.value}
              defaultChecked={defaultValue === opt.value}
              className="h-4 w-4 accent-accent"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export function FieldSet({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-black/[.02] sm:p-6 dark:shadow-none">
      <legend className="px-1 text-sm font-semibold">{title}</legend>
      <div className="grid grid-cols-1 gap-4 pt-3 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </fieldset>
  );
}
