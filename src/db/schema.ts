import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('Tasks', {
  id: uuid().defaultRandom().primaryKey(),
  taskDescription: text().notNull(),
  createdDate: timestamp().defaultNow().notNull(),
  dueDate: timestamp().notNull(),
  completed: boolean().notNull(),
})
