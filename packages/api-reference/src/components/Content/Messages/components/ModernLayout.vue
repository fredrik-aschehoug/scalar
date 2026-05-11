<script setup lang="ts">
import { ScalarErrorBoundary, ScalarMarkdown } from '@scalar/components'
import type { WorkspaceEventBus } from '@scalar/workspace-store/events'
import type { AsyncApiMessageObject } from '@scalar/workspace-store/schemas/asyncapi/asyncapi-document'
import type { SchemaObject } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document'

import { CompactSection, SectionHeaderTag } from '@/components/Section'

import { Schema } from '../../Schema'

const { message, options } = defineProps<{
  id: string
  name: string
  message: AsyncApiMessageObject
  payloadSchema: SchemaObject | undefined
  isCollapsed: boolean
  eventBus: WorkspaceEventBus
  options: {
    orderRequiredPropertiesFirst: boolean | undefined
    orderSchemaPropertiesBy: 'alpha' | 'preserve' | undefined
    hideModels: boolean | undefined
  }
}>()
</script>
<template>
  <CompactSection
    :id="id"
    :key="name"
    :label="message.title ?? message.name ?? name"
    :modelValue="!isCollapsed"
    @copyAnchorUrl="() => eventBus?.emit('copy-url:nav-item', { id })"
    @update:modelValue="
      (value) => eventBus?.emit('toggle:nav-item', { id, open: value })
    ">
    <template #heading>
      <SectionHeaderTag :level="3">
        <span class="message-heading">
          {{ message.title ?? message.name ?? name }}
        </span>
      </SectionHeaderTag>
    </template>

    <div class="message-meta">
      <p
        v-if="message.summary"
        class="message-summary">
        {{ message.summary }}
      </p>
      <code
        v-if="message.contentType"
        class="message-content-type">
        {{ message.contentType }}
      </code>
    </div>

    <ScalarMarkdown
      v-if="message.description"
      class="message-description"
      :value="message.description" />

    <ScalarErrorBoundary v-if="payloadSchema">
      <Schema
        :eventBus
        :hideModelNames="options.hideModels"
        hideHeading
        :level="1"
        noncollapsible
        :options="options"
        :schema="payloadSchema" />
    </ScalarErrorBoundary>
  </CompactSection>
</template>

<style scoped>
.message-heading {
  font-family: var(--scalar-font-code);
  color: var(--scalar-color-1);
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.message-summary {
  color: var(--scalar-color-2);
  margin: 0;
}

.message-content-type {
  background: var(--scalar-background-2);
  border-radius: var(--scalar-radius);
  color: var(--scalar-color-2);
  font-size: var(--scalar-mini);
  padding: 2px 6px;
}

.message-description {
  margin-bottom: 12px;
}
</style>
