import { z } from 'zod';
import { getTranslator } from '@rental-platform/i18n';

const t = getTranslator();

export const signInSchema = z.object({
  email: z.string().email({ message: t('auth.validation.email.invalid') }),
  password: z.string().min(1, { message: t('auth.validation.password.required') }),
});

export type SignInValues = z.infer<typeof signInSchema>;
