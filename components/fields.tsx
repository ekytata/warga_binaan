const inputClass =
  "w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-black shadow-sm outline-none transition focus:border-black/40 dark:border-white/20 dark:bg-white/5 dark:text-white dark:focus:border-white/40";

const labelClass = "mb-1 block text-xs font-medium text-black/70 dark:text-white/70";

export function TextField({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  placeholder,
  error,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  required?: boolean;
  type?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? undefined}
        required={required}
        placeholder={placeholder}
        className={inputClass}
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
        className={inputClass}
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
      <div className="flex gap-4 pt-1">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-1.5 text-sm">
            <input
              type="radio"
              name={name}
              value={opt.value}
              defaultChecked={defaultValue === opt.value}
              className="accent-black dark:accent-white"
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
    <fieldset className="rounded-lg border border-black/10 p-4 dark:border-white/10">
      <legend className="px-1 text-sm font-semibold">{title}</legend>
      <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </fieldset>
  );
}
