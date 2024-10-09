import z from 'zod'

export const id_schema = z.string().uuid()

export const new_task_schema = z.object({
  taskDescription: z.string(),
  dueDate: z.string().datetime(),
  completed: z.boolean(),
})

export const task_schema = new_task_schema.extend({
  id: id_schema,
  createdDate: z.string().datetime(),
})

export const string_boolean_schema = z.enum(['true', 'false'])
export const sort_by_schema = z.optional(z.enum(['+createdDate', '-createdDate', '+dueDate', '-dueDate']))
