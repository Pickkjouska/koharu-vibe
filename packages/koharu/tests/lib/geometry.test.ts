import { describe, expect, it } from 'vitest'

import { minimumTextFrameSize, resizeFrame, rotateFrame } from '@/lib/geometry'
import type { Frame } from '@koharu/bridge/protocol'

const frame: Frame = { x: 10, y: 20, width: 100, height: 50, angle_degrees: 0 }

describe('selection control geometry', () => {
  it('resizes from a handle while keeping the opposite edge fixed', () => {
    expect(resizeFrame(frame, 'e', { x: 140, y: 45 }, 1)).toEqual({
      ...frame,
      width: 130,
    })
    expect(resizeFrame(frame, 'nw', { x: 0, y: 10 }, 1)).toEqual({
      ...frame,
      x: 0,
      y: 10,
      width: 110,
      height: 60,
    })
  })

  it('resizes in the frame local axes when it is rotated', () => {
    const result = resizeFrame({ ...frame, angle_degrees: 90 }, 'e', { x: 60, y: 125 }, 1)
    expect(result.x).toBeCloseTo(-5)
    expect(result.y).toBeCloseTo(35)
    expect(result.width).toBeCloseTo(130)
    expect(result.height).toBe(50)
  })

  it('never shrinks a text frame below the layout inset floor', () => {
    // Dragging an edge past the opposite one used to rely on the sub-pixel clamp.
    // Text frames need the renderer's 4px inset per side to keep a layout area.
    expect(resizeFrame(frame, 'e', { x: 0, y: 45 }, minimumTextFrameSize).width).toBe(
      minimumTextFrameSize,
    )
    expect(resizeFrame(frame, 'w', { x: 400, y: 45 }, minimumTextFrameSize).width).toBe(
      minimumTextFrameSize,
    )
    expect(resizeFrame(frame, 's', { x: 60, y: 0 }, minimumTextFrameSize).height).toBe(
      minimumTextFrameSize,
    )
  })

  it('rotates around the frame center', () => {
    expect(rotateFrame(frame, { x: 60, y: -5 }, { x: 110, y: 45 })).toEqual({
      ...frame,
      angle_degrees: 90,
    })
  })
})
