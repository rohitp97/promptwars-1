import { render, screen, fireEvent } from '@testing-library/react'
import { test, expect, vi } from 'vitest'
import LandingPage from './page'

// Mock next/navigation dynamically
vi.mock('next/navigation', () => ({
  useRouter() {
    return { push: vi.fn() };
  },
}));

// Mock dynamic import for JourneyMap to avoid canvas errors
vi.mock('next/dynamic', () => ({
  default: () => () => <div data-testid="mock-journey-map">Map</div>,
}));

test('LandingPage form validation rejects invalid PNR', () => {
  render(<LandingPage />)
  
  const input = screen.getByPlaceholderText('e.g. RCB123')
  fireEvent.change(input, { target: { value: 'BADPNR' } })
  
  const submitButton = screen.getByRole('button', { name: /Enter Stadium/i })
  fireEvent.click(submitButton)
  
  expect(screen.getByText(/Invalid PNR/i)).toBeInTheDocument()
})
