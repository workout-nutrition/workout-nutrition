import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default(isTest ? 'test' : 'development'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  SUPABASE_URL: z
    .string()
    .url()
    .default(
      process.env.SUPABASE_URL ||
      (isTest ? 'https://mock.supabase.co' : 'https://sopezjolczjazecengwl.supabase.co')
    ),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .default(
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      (isTest ? 'mock-service-role-key' : 'placeholder-service-role-key')
    ),
  RAZORPAY_KEY_ID: z
    .string()
    .default(
      process.env.RAZORPAY_KEY_ID ||
      (isTest ? 'rzp_test_mock_key_id' : 'rzp_test_placeholder_key_id')
    ),
  RAZORPAY_KEY_SECRET: z
    .string()
    .default(
      process.env.RAZORPAY_KEY_SECRET ||
      (isTest ? 'mock_razorpay_secret' : 'placeholder_razorpay_secret')
    ),
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().default(465),
  SMTP_SECURE: z.coerce.boolean().default(true),
  SMTP_USER: z.string().optional().default(process.env.SMTP_USER || ''),
  SMTP_PASS: z.string().optional().default(process.env.SMTP_PASS || ''),
  SMTP_FROM: z.string().optional().default(process.env.SMTP_FROM || 'Workout Nutrition <no-reply@workoutnutrition.com>'),
  ADMIN_NOTIFICATION_EMAIL: z.string().optional().default(process.env.ADMIN_NOTIFICATION_EMAIL || ''),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ FATAL: Invalid backend environment variables:');
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;

if (!isTest) {
  if (env.RAZORPAY_KEY_ID.includes('placeholder')) {
    console.warn('⚠️ WARNING: RAZORPAY_KEY_ID is using a placeholder. Set your rzp_test_... in server/.env');
  }
  if (env.SUPABASE_SERVICE_ROLE_KEY.includes('placeholder')) {
    console.warn('⚠️ WARNING: SUPABASE_SERVICE_ROLE_KEY is using a placeholder. Set your service_role secret in server/.env');
  }
}
