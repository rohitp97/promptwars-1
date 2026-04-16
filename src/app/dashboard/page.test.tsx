import { render, screen, fireEvent, act } from '@testing-library/react'
import { test, expect, vi } from 'vitest'
import Dashboard from './page'
import { collection, onSnapshot } from 'firebase/firestore'

// Mock Firebase
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  onSnapshot: vi.fn((_, callback) => {
    callback({
      docs: [
        {
          id: '1',
          data: () => ({ name: 'Concourse Washroom - Gate 2', type: 'washroom', waitTime: 4, statusColor: 'green' })
        }
      ]
    })
    return vi.fn() // mock unsubscribe
  }),
}))

vi.mock('@/lib/firebase', () => ({
  db: {}
}))

// Mock dynamic import
vi.mock('@/components/StadiumMap', () => ({
  StadiumMap: () => <div data-testid="stadium-map-mock">MockMap</div>
}))

test('Dashboard renders and filters amenities cleanly', async () => {
  render(<Dashboard />)
  
  // Test basic header renders
  expect(screen.getByText('RCB vs MI')).toBeInTheDocument()
  
  // Test Washroom click triggers state filter
  const washroomButton = screen.getByText('Washroom')
  await act(async () => {
    fireEvent.click(washroomButton)
  })
  
  // The mocked washroom 'Concourse Washroom - Gate 2' should appear
  expect(screen.getByText('Concourse Washroom - Gate 2')).toBeInTheDocument()
})
