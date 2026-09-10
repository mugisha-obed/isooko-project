import type { BookContent } from './types'
import { novels } from './novels'
import { education } from './education'
import { childrens } from './children'
import { others } from './other'

export const bookContent: Record<string, BookContent> = {
  ...novels,
  ...education,
  ...childrens,
  ...others,
}

export function getBookContent(id: string): BookContent | undefined {
  return bookContent[id]
}

export type { BookContent, Chapter } from './types'