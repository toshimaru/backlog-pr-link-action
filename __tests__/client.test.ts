import { Client } from '../src/client'

const client = new Client('xxx.backlog.com', 'dummy_key')

describe('containsBacklogUrl', () => {
  test.concurrent.each([
    '',
    'xxx.backlog.com',
    'xxx.backlog.com/view/',
    'https://xxx.backlog.com/view/',
    'https://xxx.backlog.com/view/PROJECT',
    'https://xxx.backlog.com/view/PROJECT',
    'https://xxx.backlog.com/view/PROJECT1',
    'https://xxx.backlog.com/view/PROJECT-',
    'https://xxx.backlog.com/view/-1',
    'https://xxx.backlog.com/view/1-X',
    'https://xxx.backlog.com/view/X-X'
  ])('%s does NOT contain Backlog URL', (invalidUrl) => {
    expect(client.containsBacklogUrl(invalidUrl)).toBe(false)
  })

  test.concurrent.each([
    'https://xxx.backlog.com/view/1-1',
    'https://xxx.backlog.com/view/PROJECT-1',
    ' https://xxx.backlog.com/view/PROJECT-1 ',
    '\nhttps://xxx.backlog.com/view/PROJECT-1\n'
  ])('%s contains Backlog URL', (validUrl) => {
    expect(client.containsBacklogUrl(validUrl)).toBe(true)
    expect(client.containsBacklogUrl(validUrl)).toBe(true)
  })
})

describe('parseBacklogUrl', () => {
  test.concurrent.each([
    '',
    '\n',
    'https://xxx.backlog.com/view'
  ])('invalid URL %#', (body) => {
    expect(client.parseBacklogUrl(body)).toStrictEqual([])
  })

  test.concurrent.each([
    ['URL: https://xxx.backlog.com/view/PROJECT-1 ', 'https://xxx.backlog.com/view/PROJECT-1', 'PROJECT', 'PROJECT-1'],
    [' hhttps://xxx.backlog.com/view/PROJECT-1x ', 'https://xxx.backlog.com/view/PROJECT-1', 'PROJECT', 'PROJECT-1'],
    ['\nhttps://xxx.backlog.com/view/PJ-2\n', 'https://xxx.backlog.com/view/PJ-2', 'PJ', 'PJ-2']
  ])('Single URL %#', (body, url, projectId, issueId) => {
    expect(client.parseBacklogUrl(body)).toStrictEqual([[url, projectId, issueId]])
  })

  test.concurrent.each([
    ['https://xxx.backlog.com/view/PROJECT-1 https://xxx.backlog.com/view/PJ-2', 'https://xxx.backlog.com/view/PROJECT-1', 'PROJECT', 'PROJECT-1', 'https://xxx.backlog.com/view/PJ-2', 'PJ', 'PJ-2'],
    ['https://xxx.backlog.com/view/PROJECT-1\nhttps://xxx.backlog.com/view/PJ-2', 'https://xxx.backlog.com/view/PROJECT-1', 'PROJECT', 'PROJECT-1', 'https://xxx.backlog.com/view/PJ-2', 'PJ', 'PJ-2'],
    [' https://xxx.backlog.com/view/PROJECT-1https://xxx.backlog.com/view/PJ-2 ', 'https://xxx.backlog.com/view/PROJECT-1', 'PROJECT', 'PROJECT-1', 'https://xxx.backlog.com/view/PJ-2', 'PJ', 'PJ-2']
  ])('multiple URLs %#', (body, url1, projectId1, issueId1, url2, projectId2, issueId2) => {
    expect(client.parseBacklogUrl(body)).toStrictEqual([[url1, projectId1, issueId1], [url2, projectId2, issueId2]])
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
