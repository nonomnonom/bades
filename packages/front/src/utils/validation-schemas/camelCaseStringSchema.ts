import camelCase from 'lodash.camelcase';
import { z } from 'zod';

export const camelCaseStringSchema = z
  .string()
  .refine((value) => camelCase(value) === value, {
    error: 'String harus menggunakan camel case',
  });
