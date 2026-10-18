import { describe, expect, it } from 'vitest'
import { createDefaultSettings, normalizeSettings } from './settings'

describe('settings defaults', () => {
  it('createDefaultSettings returns theme system and empty output folder', () => {
    expect(createDefaultSettings()).toEqual({
      theme: 'system',
      outputFolder: ''
    })
  })

  it('normalizeSettings fills missing fields from defaults', () => {
    expect(normalizeSettings({})).toEqual(createDefaultSettings())
    expect(normalizeSettings(null)).toEqual(createDefaultSettings())
  })

  it('normalizeSettings keeps valid partial updates', () => {
    expect(normalizeSettings({ theme: 'dark' })).toEqual({
      theme: 'dark',
      outputFolder: ''
    })
    expect(normalizeSettings({ outputFolder: '/tmp/out' })).toEqual({
      theme: 'system',
      outputFolder: '/tmp/out'
    })
  })

  it('normalizeSettings rejects invalid theme values', () => {
    expect(normalizeSettings({ theme: 'neon' })).toEqual(createDefaultSettings())
  })
})
