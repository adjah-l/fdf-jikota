import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock Supabase auth endpoints
  http.post('*/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      user: {
        id: 'mock-user-id',
        email: 'test@example.com',
      },
    })
  }),

  // Mock Supabase REST endpoints
  http.get('*/rest/v1/*', () => {
    return HttpResponse.json({ data: [], error: null })
  }),

  http.post('*/rest/v1/*', () => {
    return HttpResponse.json({ data: {}, error: null })
  }),
]