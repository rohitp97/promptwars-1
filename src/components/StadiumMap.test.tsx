import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import { StadiumMap } from './StadiumMap'

test('StadiumMap correctly highlights and renders user section label', () => {
  render(<StadiumMap userSection="North" />)
  expect(screen.getByText('North')).toBeInTheDocument()
})
