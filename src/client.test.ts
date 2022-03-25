import { Client } from './client'

const client = new Client('xxx.backlog.com', 'dummy_key')

describe('containsBacklogUrl', () => {
  it.concurrent.each([
    '',
    'xxx.backlog.com',
    'xxx.backlog.com/view/',
    'https://xxx.backlog.com/view/',
    'https://xxx.backlog.com/view/PROJECT',
    'https://xxx.backlog.com/view/PROJECT',
    'https://xxx.backlog.com/view/PROJECT1',
    'https://xxx.backlog.com/view/PROJECT-',
    'https://xxx.backlog.com/view/-1',
    'https://xxx.backlog.com/view/1-X'
  ])('does not contain Backlog URL', (invalidUrl) => {
    expect(client.containsBacklogUrl(invalidUrl)).toBe(false)
  })

  it('contains Backlog URL', () => {
    expect(client.containsBacklogUrl('https://xxx.backlog.com/view/1-1')).toBe(true)
    expect(client.containsBacklogUrl('https://xxx.backlog.com/view/PROJECT-1')).toBe(true)
  })
})

describe('parseBacklogUrl', () => {
  test('single URL', () => {
    expect(client.parseBacklogUrl('')).toStrictEqual([])
    const url = 'https://xxx.backlog.com/view/PROJECT-1'
    expect(client.parseBacklogUrl(`URL: ${url} `)).toStrictEqual([url, 'PROJECT', 'PROJECT-1'])
  })
})

describe('validateProject', () => {
  test('invalid project', async () => {
    expect(await client.validateProject('')).toBe(false)
    expect(await client.validateProject('INVALID')).toBe(false)
  })
})

describe('updateIssuePrField', () => {
  it('failed to update', async () => {
    const result = await client.updateIssuePrField('PROJECT-1', 1, 'https://github.com/xxx/pull/1')
    expect(result).toBe(false)
  })
})
