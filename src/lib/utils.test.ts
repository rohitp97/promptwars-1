import { expect, test } from 'vitest'
import { cn } from './utils'

test('cn safely merges valid tailwind classes', () => {
  expect(cn('p-2', 'p-4')).toBe('p-4')
  expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white')
})
