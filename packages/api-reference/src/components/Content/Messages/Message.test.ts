import type { WorkspaceEventBus } from '@scalar/workspace-store/events'
import type { AsyncApiDocument } from '@scalar/workspace-store/schemas/asyncapi/asyncapi-document'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import Message from './Message.vue'

const eventBus: WorkspaceEventBus = {
  on: vi.fn(),
  once: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(() => null),
}

const baseOptions = {
  layout: 'modern' as const,
  orderRequiredPropertiesFirst: undefined,
  orderSchemaPropertiesBy: undefined,
  hideModels: undefined,
}

const documentWithSchema = (schema: Record<string, unknown>): AsyncApiDocument => ({
  asyncapi: '3.0.0',
  info: { title: 'Test', version: '1.0.0' },
  components: { schemas: { LightEvent: schema } },
  'x-scalar-original-document-hash': '',
})

describe('Message', () => {
  it('renders the title, summary, and content type', () => {
    const wrapper = mount(Message, {
      props: {
        id: 'message/LightOn',
        name: 'LightOn',
        message: {
          title: 'Light On Event',
          summary: 'A streetlight turned on.',
          contentType: 'application/json',
        },
        document: documentWithSchema({}),
        isCollapsed: false,
        options: baseOptions,
        eventBus,
      },
    })

    expect(wrapper.text()).toContain('Light On Event')
    expect(wrapper.text()).toContain('A streetlight turned on.')
    expect(wrapper.text()).toContain('application/json')
  })

  it('falls back to the entry name when title and message.name are missing', () => {
    const wrapper = mount(Message, {
      props: {
        id: 'message/LightOn',
        name: 'LightOn',
        message: {},
        document: documentWithSchema({}),
        isCollapsed: false,
        options: baseOptions,
        eventBus,
      },
    })

    expect(wrapper.text()).toContain('LightOn')
  })

  it('renders without throwing when payload is missing', () => {
    const wrapper = mount(Message, {
      props: {
        id: 'message/LightOn',
        name: 'LightOn',
        message: { title: 'Light On Event' },
        document: documentWithSchema({}),
        isCollapsed: false,
        options: baseOptions,
        eventBus,
      },
    })

    expect(wrapper.text()).toContain('Light On Event')
  })

  it('renders the payload schema in the classic layout too', () => {
    const wrapper = mount(Message, {
      props: {
        id: 'message/LightOn',
        name: 'LightOn',
        message: {
          title: 'Light On Event',
          payload: { $ref: '#/components/schemas/LightEvent' },
        },
        document: documentWithSchema({
          type: 'object',
          properties: { id: { type: 'string' } },
        }),
        isCollapsed: false,
        options: { ...baseOptions, layout: 'classic' },
        eventBus,
      },
    })

    expect(wrapper.text()).toContain('Light On Event')
  })
})
