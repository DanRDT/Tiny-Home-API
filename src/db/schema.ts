import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const TasksTable = pgTable('Tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskDescription: text('taskDescription').notNull(),
  createdDate: timestamp('createdDate', { withTimezone: false, mode: 'string' }).defaultNow().notNull(),
  dueDate: timestamp('dueDate', { withTimezone: false, mode: 'string' }).notNull(),
  completed: boolean('completed').notNull(),
})
