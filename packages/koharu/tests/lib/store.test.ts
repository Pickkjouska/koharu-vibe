import { describe, expect, it } from 'vitest'

import { receiveCanvas, receiveDownload, useKoharuStore } from '@/lib/store'

describe('editor state', () => {
  it('retains failed downloads until they are dismissed', () => {
    useKoharuStore.setState({ downloads: {} })
    receiveDownload({
      state: 'failed',
      id: 9,
      name: 'weights.bin',
      completed: 0,
      total: 0,
      error: 'network unavailable',
    })
    expect(useKoharuStore.getState().downloads[9]).toMatchObject({
      state: 'failed',
      name: 'weights.bin',
    })

    useKoharuStore.getState().dismissDownload(9)
    expect(useKoharuStore.getState().downloads[9]).toBeUndefined()
  })

  it('defaults paint brush color to pure white (#FFFFFF)', () => {
    expect(useKoharuStore.getState().brush.color).toBe('#FFFFFF')
  })

  it('keeps text diagnostics on the layer that produced them', () => {
    receiveCanvas({
      page: null,
      revision: null,
      generation: 0,
      size: [0, 0],
      element_frames: [],
      text_diagnostics: [
        { layer: 'layer-a', kind: 'collapsed', font_size: null, minimum_font_size: null },
        {
          layer: 'layer-a',
          kind: 'belowReadableSize',
          font_size: 6,
          minimum_font_size: 9,
        },
        { layer: 'layer-b', kind: 'overflow', font_size: null, minimum_font_size: null },
      ],
    })

    const diagnostics = useKoharuStore.getState().textDiagnostics
    expect(diagnostics['layer-a']?.map((diagnostic) => diagnostic.kind)).toEqual([
      'collapsed',
      'belowReadableSize',
    ])
    expect(diagnostics['layer-b']?.map((diagnostic) => diagnostic.kind)).toEqual(['overflow'])
  })
})
