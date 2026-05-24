import { z } from 'zod';
import { getTranslator } from '@rental-platform/i18n';

const t = getTranslator();

export const signUpSchema = z.object({
  name: z.string().min(1, { message: t('auth.validation.name.required') }),
  email: z.string().email({ message: t('auth.validation.email.invalid') }),
  password: z.string().min(8, { message: t('auth.validation.password.tooShort') }),
});

export type SignUpValues = z.infer<typeof signUpSchema>;
