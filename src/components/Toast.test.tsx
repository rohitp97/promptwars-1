import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import { Toast } from './Toast'

test('Toast correctly renders text and is visible', () => {
  render(<Toast message="Emergency Route Activated" visible={true} onClose={() => {}} />)
  expect(screen.getByText('Emergency Route Activated')).toBeInTheDocument()
})
