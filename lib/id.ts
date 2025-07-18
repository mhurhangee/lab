import { nanoid } from 'nanoid'

export const generateId = (length = 12) => nanoid(length)
