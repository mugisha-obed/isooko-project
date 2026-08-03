export interface Testimonial {
  id: string
  quoteKey: string
  attribution: string
  roleKey: string
}

export const testimonials: Testimonial[] = [
  { id: 't1', quoteKey: 'testimonials.t1.quote', attribution: 'Mukandoli Marie',  roleKey: 'testimonials.t1.role' },
  { id: 't2', quoteKey: 'testimonials.t2.quote', attribution: 'Nsabimana Pierre', roleKey: 'testimonials.t2.role' },
  { id: 't3', quoteKey: 'testimonials.t3.quote', attribution: 'Umubyeyi Aline',   roleKey: 'testimonials.t3.role' },
]
