import type { ComputedRef, Ref } from 'vue'

export type TFormValidationRuleName = 'required' | 'email' | 'phone' | 'taiwanId' | 'taxId'

export type TFormValidationRules = readonly TFormValidationRuleName[]

export type TFormValidationResult = string | undefined

export type TFormValidationTrigger = 'submit' | 'blur' | 'input'

export type TFormValidationFieldName<TState extends object> = {
  [TKey in keyof TState]-?: TState[TKey] extends string | undefined ? TKey : never
}[keyof TState] &
  string

export type TFormValidationSchema<TState extends object> = Partial<
  Record<TFormValidationFieldName<TState>, TFormValidationRules>
>

export type TFormValidationErrors<TState extends object> = Partial<
  Record<TFormValidationFieldName<TState>, string>
>

export type TUseFormValidationOptions<TState extends object> = {
  state: TState
  rules: TFormValidationSchema<TState>
  validateOn?: TFormValidationTrigger
}

export type TFormValidationControls<TState extends object> = {
  errors: ComputedRef<Readonly<TFormValidationErrors<TState>>>
  isSubmitted: Readonly<Ref<boolean>>
  isValid: ComputedRef<boolean>
  validate: () => boolean
  validateField: <TFieldName extends TFormValidationFieldName<TState>>(
    fieldName: TFieldName
  ) => TFormValidationResult
  handleFieldBlur: <TFieldName extends TFormValidationFieldName<TState>>(
    fieldName: TFieldName
  ) => void
  handleFieldInput: <TFieldName extends TFormValidationFieldName<TState>>(
    fieldName: TFieldName
  ) => void
  reset: () => void
}

type TFormFormatRuleName = Exclude<TFormValidationRuleName, 'required'>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^(?:09\d{2}[- ]?\d{3}[- ]?\d{3}|0(?!9)\d{1,2}[- ]?\d{6,8})$/
const TAIWAN_ID_PATTERN = /^[A-Z][12]\d{8}$/i
const TAX_ID_PATTERN = /^\d{8}$/

const VALIDATION_MESSAGES: Record<TFormValidationRuleName, string> = {
  required: '此欄位為必填',
  email: '請輸入有效的 Email 格式',
  phone: '請輸入有效的電話格式',
  taiwanId: '請輸入有效的身分證字號格式',
  taxId: '請輸入 8 碼統一編號',
}

const FORMAT_PATTERNS: Record<TFormFormatRuleName, RegExp> = {
  email: EMAIL_PATTERN,
  phone: PHONE_PATTERN,
  taiwanId: TAIWAN_ID_PATTERN,
  taxId: TAX_ID_PATTERN,
}

const normalizeValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '')

const validateValue = (
  value: unknown,
  rules: TFormValidationRules | undefined
): TFormValidationResult => {
  const normalizedValue = normalizeValue(value)

  for (const rule of rules ?? []) {
    if (rule === 'required') {
      if (!normalizedValue) {
        return VALIDATION_MESSAGES.required
      }

      continue
    }

    if (!normalizedValue) {
      continue
    }

    if (!FORMAT_PATTERNS[rule].test(normalizedValue)) {
      return VALIDATION_MESSAGES[rule]
    }
  }

  return undefined
}

export const useFormValidation = <TState extends object>(
  options: TUseFormValidationOptions<TState>
): TFormValidationControls<TState> => {
  const validateOn = options.validateOn ?? 'submit'
  const isSubmitted = ref(false)
  const validatedFields = reactive(new Set<string>())
  const fieldNames = computed(
    () => Object.keys(options.rules) as Array<TFormValidationFieldName<TState>>
  )

  const getFieldError = <TFieldName extends TFormValidationFieldName<TState>>(
    fieldName: TFieldName
  ): TFormValidationResult => validateValue(options.state[fieldName], options.rules[fieldName])

  const errors = computed<Readonly<TFormValidationErrors<TState>>>(() => {
    const nextErrors: TFormValidationErrors<TState> = {}

    fieldNames.value.forEach((fieldName) => {
      if (!isSubmitted.value && !validatedFields.has(fieldName)) {
        return
      }

      const error = getFieldError(fieldName)
      if (error) {
        nextErrors[fieldName] = error
      }
    })

    return nextErrors
  })

  const isValid = computed(() => fieldNames.value.every((fieldName) => !getFieldError(fieldName)))

  const validateField = <TFieldName extends TFormValidationFieldName<TState>>(
    fieldName: TFieldName
  ): TFormValidationResult => {
    validatedFields.add(fieldName)
    return getFieldError(fieldName)
  }

  const validate = (): boolean => {
    isSubmitted.value = true
    fieldNames.value.forEach((fieldName) => validatedFields.add(fieldName))

    return isValid.value
  }

  const handleFieldBlur = <TFieldName extends TFormValidationFieldName<TState>>(
    fieldName: TFieldName
  ): void => {
    if (validateOn === 'blur') {
      validateField(fieldName)
    }
  }

  const handleFieldInput = <TFieldName extends TFormValidationFieldName<TState>>(
    fieldName: TFieldName
  ): void => {
    if (validateOn === 'input' || isSubmitted.value || validatedFields.has(fieldName)) {
      validateField(fieldName)
    }
  }

  const reset = (): void => {
    isSubmitted.value = false
    validatedFields.clear()
  }

  return {
    errors,
    isSubmitted,
    isValid,
    validate,
    validateField,
    handleFieldBlur,
    handleFieldInput,
    reset,
  }
}
