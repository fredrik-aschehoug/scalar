<script setup lang="ts">
import type { ApiReferenceConfigurationRaw } from '@scalar/types/api-reference'
import type { WorkspaceEventBus } from '@scalar/workspace-store/events'
import type {
  AsyncApiDocument,
  AsyncApiMessageObject,
} from '@scalar/workspace-store/schemas/asyncapi/asyncapi-document'
import type { SchemaObject } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document'
import { computed, useTemplateRef } from 'vue'

import { useIntersection } from '@/hooks/use-intersection'

import ClassicLayout from './components/ClassicLayout.vue'
import ModernLayout from './components/ModernLayout.vue'

const SCHEMA_REF_PREFIX = '#/components/schemas/'

const { message, document, id, options, eventBus } = defineProps<{
  id: string
  name: string
  message: AsyncApiMessageObject
  document: AsyncApiDocument
  isCollapsed: boolean
  options: Pick<
    ApiReferenceConfigurationRaw,
    | 'layout'
    | 'orderRequiredPropertiesFirst'
    | 'orderSchemaPropertiesBy'
    | 'hideModels'
  >
  eventBus: WorkspaceEventBus
}>()

const section = useTemplateRef<HTMLElement>('section')

useIntersection(section, () => eventBus?.emit('intersecting:nav-item', { id }))

/**
 * AsyncAPI message payloads can be either an inline Schema Object or a `$ref` pointing
 * into `components.schemas`. The AsyncAPI ingestion path skips `$ref` bundling, so the
 * payload arrives at the renderer unresolved. We dereference manually here; nested
 * `$ref`s inside the resolved schema still render as `$ref` strings (acceptable for MVP).
 */
const payloadSchema = computed<SchemaObject | undefined>(() => {
  const payload = message.payload

  if (!payload || typeof payload !== 'object') {
    return undefined
  }

  const ref = (payload as { $ref?: unknown }).$ref
  if (typeof ref === 'string' && ref.startsWith(SCHEMA_REF_PREFIX)) {
    const name = ref.slice(SCHEMA_REF_PREFIX.length)
    return document.components?.schemas?.[name] as SchemaObject | undefined
  }

  return payload as SchemaObject
})
</script>
<template>
  <div ref="section">
    <ClassicLayout
      v-if="options.layout === 'classic'"
      :id
      :eventBus
      :isCollapsed
      :message
      :name
      :options
      :payloadSchema />
    <ModernLayout
      v-else
      :id
      :eventBus
      :isCollapsed
      :message
      :name
      :options
      :payloadSchema />
  </div>
</template>
