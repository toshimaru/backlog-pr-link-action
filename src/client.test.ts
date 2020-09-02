import { Client } from './client'

const client = new Client('xxx.backlog.com', 'dummy_key')

test('containsBacklogUrl', () => {
  expect(client.containsBacklogUrl('')).toBe(false)
  expect(client.containsBacklogUrl('xxx.backlog.com')).toBe(false)
  expect(client.containsBacklogUrl('xxx.backlog.com/view/')).toBe(false)
  expect(client.containsBacklogUrl('https://xxx.backlog.com/view/')).toBe(false)
  expect(client.containsBacklogUrl('https://xxx.backlog.com/view/PROJECT')).toBe(false)
  expect(client.containsBacklogUrl('https://xxx.backlog.com/view/PROJECT')).toBe(false)
  expect(client.containsBacklogUrl('https://xxx.backlog.com/view/PROJECT1')).toBe(false)
  expect(client.containsBacklogUrl('https://xxx.backlog.com/view/PROJECT-')).toBe(false)
  expect(client.containsBacklogUrl('https://xxx.backlog.com/view/-1')).toBe(false)
  expect(client.containsBacklogUrl('https://xxx.backlog.com/view/1-X')).toBe(false)
  expect(client.containsBacklogUrl('https://xxx.backlog.com/view/1-1')).toBe(true)
  expect(client.containsBacklogUrl('https://xxx.backlog.com/view/PROJECT-1')).toBe(true)
})

test('parseBacklogUrl', () => {
  expect(client.parseBacklogUrl('')).toStrictEqual([])
  const url = 'https://xxx.backlog.com/view/PROJECT-1'
  expect(client.parseBacklogUrl(`URL: ${url} `)).toStrictEqual([url, 'PROJECT', 'PROJECT-1'])
})

test('validateProject', async () => {
  const isValid = await client.validateProject('')
  expect(isValid).toBe(false)
})

test('updateIssuePrField', async () => {
  const result = await client.updateIssuePrField('PROJECT-1', 1, 'https://github.com/xxx/pull/1')
  expect(result).toBe(false)
})
