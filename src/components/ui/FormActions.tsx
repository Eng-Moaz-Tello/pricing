interface FormActionsProps {
  onCancel: () => void
  saving: boolean
  disabled?: boolean
}

export default function FormActions({ onCancel, saving, disabled }: FormActionsProps) {
  return (
    <div className="flex gap-3 justify-end mt-2">
      <button
        type="button"
        onClick={onCancel}
        className="px-5 py-2.5 rounded-lg text-sm font-medium text-charcoal hover:bg-mint transition"
      >
        إلغاء
      </button>
      <button
        type="submit"
        disabled={saving || disabled}
        className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-50"
      >
        {saving ? 'جاري الحفظ…' : 'حفظ'}
      </button>
    </div>
  )
}