import { z } from 'zod';
import { getTranslator } from '@rental-platform/i18n';

const t = getTranslator();

export const resetPasswordSchema = z.object({
  password: z.string().min(8, { message: t('auth.validation.password.tooShort') }),
});

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
