import { type Option } from './SelectField'

interface Props {
  label: string
  value: string
  onChange: (v: string) => void
  options: Option[]
  onCreate: () => void
  placeholder?: string
}

export default function SelectWithCreate({
  label, value, onChange, options, onCreate, placeholder = 'اختر…',
}: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-charcoal mb-1.5">{label}</label>
      <div className="flex gap-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 border border-black/10 rounded-lg px-4 py-2.5 text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={onCreate}
          className="shrink-0 border border-primary text-primary hover:bg-mint text-sm font-medium px-3 rounded-lg transition"
        >
          + جديد
        </button>
      </div>
    </div>
  )
}