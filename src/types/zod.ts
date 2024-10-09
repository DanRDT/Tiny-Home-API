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
