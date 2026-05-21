import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/cn'

describe('cn', () => {
  it('merges class names with space separator', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('skips falsy values', () => {
    expect(cn('foo', false, undefined, null, 0, 'bar')).toBe('foo bar')
  })

  it('flattens conditional class objects', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active')
  })
})
