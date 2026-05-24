import { z } from 'zod';
import { getTranslator } from '@rental-platform/i18n';

const t = getTranslator();

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: t('auth.validation.email.invalid') }),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
