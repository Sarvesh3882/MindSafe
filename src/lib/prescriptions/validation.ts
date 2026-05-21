// Prescription validation schemas
// Author: MindSafe India Development Team

import { z } from 'zod';

// Frequency options
export const frequencyOptions = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'As needed',
  'Other',
] as const;

// Base prescription schema
export const prescriptionSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  medicationName: z
    .string()
    .min(2, 'Medication name must be at least 2 characters')
    .max(200, 'Medication name must not exceed 200 characters'),
  dosage: z
    .string()
    .min(1, 'Dosage is required')
    .max(100, 'Dosage must not exceed 100 characters'),
  frequency: z.enum(frequencyOptions),
  duration: z
    .string()
    .min(1, 'Duration is required')
    .max(50, 'Duration must not exceed 50 characters'),
  notes: z
    .string()
    .max(2000, 'Notes must not exceed 2000 characters')
    .optional(),
  wellnessTips: z
    .string()
    .max(2000, 'Wellness tips must not exceed 2000 characters')
    .optional(),
});

// Suggestion schema (can be linked to parent or standalone)
export const suggestionSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  parentPrescriptionId: z.string().uuid('Invalid prescription ID').optional(),
  medicationName: z
    .string()
    .min(2, 'Medication name must be at least 2 characters')
    .max(200, 'Medication name must not exceed 200 characters'),
  dosage: z
    .string()
    .min(1, 'Dosage is required')
    .max(100, 'Dosage must not exceed 100 characters'),
  frequency: z.enum(frequencyOptions),
  duration: z
    .string()
    .min(1, 'Duration is required')
    .max(50, 'Duration must not exceed 50 characters'),
  notes: z
    .string()
    .max(2000, 'Notes must not exceed 2000 characters')
    .optional(),
});

// Update prescription schema (all fields optional)
export const updatePrescriptionSchema = z.object({
  medicationName: z
    .string()
    .min(2, 'Medication name must be at least 2 characters')
    .max(200, 'Medication name must not exceed 200 characters')
    .optional(),
  dosage: z
    .string()
    .min(1, 'Dosage is required')
    .max(100, 'Dosage must not exceed 100 characters')
    .optional(),
  frequency: z.enum(frequencyOptions).optional(),
  duration: z
    .string()
    .min(1, 'Duration is required')
    .max(50, 'Duration must not exceed 50 characters')
    .optional(),
  notes: z
    .string()
    .max(2000, 'Notes must not exceed 2000 characters')
    .optional(),
  wellnessTips: z
    .string()
    .max(2000, 'Wellness tips must not exceed 2000 characters')
    .optional(),
});

// Message schema
export const messageSchema = z.object({
  prescriptionId: z.string().uuid('Invalid prescription ID'),
  messageText: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must not exceed 1000 characters')
    .transform((val) => val.trim()),
  parentMessageId: z.string().uuid('Invalid message ID').optional(),
});

// Edit message schema
export const editMessageSchema = z.object({
  messageText: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must not exceed 1000 characters')
    .transform((val) => val.trim()),
});

// Query parameters schema
export const prescriptionQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional().nullable(),
  dateRange: z.enum(['7d', '30d', '90d', 'all']).optional().nullable().default('all'),
});

// Helper function to validate and return errors
export function validatePrescriptionForm(data: unknown) {
  try {
    prescriptionSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors,
      };
    }
    return {
      success: false,
      errors: { _form: ['Validation failed'] },
    };
  }
}

// Helper function to validate message
export function validateMessage(data: unknown) {
  try {
    messageSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors,
      };
    }
    return {
      success: false,
      errors: { _form: ['Validation failed'] },
    };
  }
}
