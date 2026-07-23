export interface Option {
  value: string
  label: string
}

interface SelectFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  options: Option[]
  placeholder?: string
}

export default function SelectField({
  label, value, onChange, options, placeholder = 'اختر…',
}: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-charcoal mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-black/10 rounded-lg px-4 py-2.5 text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}