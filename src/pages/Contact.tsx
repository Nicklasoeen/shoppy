import { useRef, useState } from 'react'
import './Contact.css'

interface FormValues {
  fullName: string
  subject: string
  email: string
  message: string
}

type FormField = keyof FormValues
type FieldErrors = Partial<Record<FormField, string>>

const initialValues: FormValues = {
  fullName: '',
  subject: '',
  email: '',
  message: '',
}

const fieldOrder: FormField[] = ['fullName', 'subject', 'email', 'message']

function validateContactForm(values: FormValues): FieldErrors {
  const errors: FieldErrors = {}

  if (values.fullName.trim().length < 3) {
    errors.fullName = 'Enter your full name using at least 3 characters.'
  }
  if (values.subject.trim().length < 3) {
    errors.subject = 'Enter a subject using at least 3 characters.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter an email address in a valid format.'
  }
  if (values.message.trim().length < 10) {
    errors.message = 'Enter a message using at least 10 characters.'
  }

  return errors
}

function Contact() {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [validatedFields, setValidatedFields] = useState<
    Partial<Record<FormField, true>>
  >({})
  const [status, setStatus] = useState('')
  const fieldRefs = useRef<
    Record<FormField, HTMLInputElement | HTMLTextAreaElement | null>
  >({
    fullName: null,
    subject: null,
    email: null,
    message: null,
  })

  function handleChange(field: FormField, value: string) {
    const nextValues = { ...values, [field]: value }
    setValues(nextValues)
    setStatus('')

    if (validatedFields[field]) {
      setErrors(validateContactForm(nextValues))
    }
  }

  function handleBlur(field: FormField) {
    setValidatedFields((current) => ({ ...current, [field]: true }))
    setErrors(validateContactForm(values))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateContactForm(values)
    setErrors(nextErrors)
    setValidatedFields({
      fullName: true,
      subject: true,
      email: true,
      message: true,
    })

    const firstInvalidField = fieldOrder.find((field) => nextErrors[field])
    if (firstInvalidField) {
      fieldRefs.current[firstInvalidField]?.focus()
      return
    }

    setValues(initialValues)
    setErrors({})
    setValidatedFields({})
    setStatus('Demo submission complete. No message was sent.')
  }

  return (
    <section aria-labelledby="contact-heading" className="contact">
      <h1 id="contact-heading">Contact Shoppy</h1>
      <p className="contact__intro">
        This is a demo form. Messages are not sent.
      </p>

      <form className="contact-form" noValidate onSubmit={handleSubmit}>
        <p className="contact-form__required-note">All fields are required.</p>

        <div className="contact-form__field">
          <label htmlFor="contact-full-name">
            Full Name <span aria-hidden="true">*</span>
          </label>
          <input
            ref={(element) => {
              fieldRefs.current.fullName = element
            }}
            aria-describedby={
              validatedFields.fullName && errors.fullName
                ? 'contact-full-name-error'
                : undefined
            }
            aria-invalid={Boolean(validatedFields.fullName && errors.fullName)}
            autoComplete="name"
            id="contact-full-name"
            name="fullName"
            onBlur={() => handleBlur('fullName')}
            onChange={(event) =>
              handleChange('fullName', event.currentTarget.value)
            }
            required
            type="text"
            value={values.fullName}
          />
          {validatedFields.fullName && errors.fullName && (
            <p className="contact-form__error" id="contact-full-name-error">
              {errors.fullName}
            </p>
          )}
        </div>

        <div className="contact-form__field">
          <label htmlFor="contact-subject">
            Subject <span aria-hidden="true">*</span>
          </label>
          <input
            ref={(element) => {
              fieldRefs.current.subject = element
            }}
            aria-describedby={
              validatedFields.subject && errors.subject
                ? 'contact-subject-error'
                : undefined
            }
            aria-invalid={Boolean(validatedFields.subject && errors.subject)}
            id="contact-subject"
            name="subject"
            onBlur={() => handleBlur('subject')}
            onChange={(event) =>
              handleChange('subject', event.currentTarget.value)
            }
            required
            type="text"
            value={values.subject}
          />
          {validatedFields.subject && errors.subject && (
            <p className="contact-form__error" id="contact-subject-error">
              {errors.subject}
            </p>
          )}
        </div>

        <div className="contact-form__field">
          <label htmlFor="contact-email">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            ref={(element) => {
              fieldRefs.current.email = element
            }}
            aria-describedby={
              validatedFields.email && errors.email
                ? 'contact-email-error'
                : undefined
            }
            aria-invalid={Boolean(validatedFields.email && errors.email)}
            autoComplete="email"
            id="contact-email"
            name="email"
            onBlur={() => handleBlur('email')}
            onChange={(event) =>
              handleChange('email', event.currentTarget.value)
            }
            required
            type="email"
            value={values.email}
          />
          {validatedFields.email && errors.email && (
            <p className="contact-form__error" id="contact-email-error">
              {errors.email}
            </p>
          )}
        </div>

        <div className="contact-form__field">
          <label htmlFor="contact-message">
            Message <span aria-hidden="true">*</span>
          </label>
          <textarea
            ref={(element) => {
              fieldRefs.current.message = element
            }}
            aria-describedby={
              validatedFields.message && errors.message
                ? 'contact-message-error'
                : undefined
            }
            aria-invalid={Boolean(validatedFields.message && errors.message)}
            id="contact-message"
            name="message"
            onBlur={() => handleBlur('message')}
            onChange={(event) =>
              handleChange('message', event.currentTarget.value)
            }
            required
            rows={6}
            value={values.message}
          />
          {validatedFields.message && errors.message && (
            <p className="contact-form__error" id="contact-message-error">
              {errors.message}
            </p>
          )}
        </div>

        <button className="contact-form__submit" type="submit">
          Send message
        </button>
        <p aria-atomic="true" aria-live="polite" className="contact-form__status">
          {status}
        </p>
      </form>
    </section>
  )
}

export default Contact
