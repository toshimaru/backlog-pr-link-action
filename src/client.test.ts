import { Client } from './client'

const client = new Client('xxx.backlog.com', 'dummy_key')

test('containsBacklogUrl', () => {
  expect(client.containsBacklogUrl('')).toBe(false)
  expect(client.containsBacklogUrl('xxx.backlog.com')).toBe(false)
  expect(client.containsBacklogUrl('xxx.backlog.com/view/')).toBe(false)
  expect(client.containsBacklogUrl('https://xxx.backlog.com/view/')).toBe(true)
  expect(client.containsBacklogUrl('https://xxx.backlog.com/view/PROJECT')).toBe(true)
  expect(client.containsBacklogUrl('https://xxx.backlog.com/view/PROJECT-1')).toBe(true)
})

// test('parseBacklogUrl', () => {
// })

test('validateProject', async () => {
  const isValid = await client.validateProject('')
  expect(isValid).toBe(false)
})
