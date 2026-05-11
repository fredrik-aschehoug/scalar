<script setup lang="ts">
import { ScalarErrorBoundary, ScalarMarkdown } from '@scalar/components'
import type { ApiReferenceConfigurationRaw } from '@scalar/types/api-reference'
import type { WorkspaceEventBus } from '@scalar/workspace-store/events'
import type { AsyncApiMessageObject } from '@scalar/workspace-store/schemas/asyncapi/asyncapi-document'
import type { SchemaObject } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document'

import { Anchor } from '@/components/Anchor'
import { SectionAccordion, SectionHeaderTag } from '@/components/Section'

import { Schema } from '../../Schema'

const { eventBus, id, message } = defineProps<{
  id: string
  name: string
  message: AsyncApiMessageObject
  payloadSchema: SchemaObject | undefined
  isCollapsed: boolean
  eventBus: WorkspaceEventBus
  options: Pick<
    ApiReferenceConfigurationRaw,
    'orderRequiredPropertiesFirst' | 'orderSchemaPropertiesBy' | 'hideModels'
  >
}>()
</script>
<template>
  <SectionAccordion
    :id="id"
    :aria-label="message.title ?? message.name ?? name"
    :modelValue="!isCollapsed"
    @update:modelValue="
      (value) => eventBus?.emit('toggle:nav-item', { id, open: value })
    ">
    <template #title>
      <Anchor
        class="reference-messages-anchor"
        :eventBus="eventBus"
        @copyAnchorUrl="() => eventBus?.emit('copy-url:nav-item', { id })">
        <SectionHeaderTag :level="3">
          <span class="reference-messages-label message-heading">
            {{ message.title ?? message.name ?? name }}
          </span>
        </SectionHeaderTag>
      </Anchor>
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
        :options
        :schema="payloadSchema" />
    </ScalarErrorBoundary>
  </SectionAccordion>
</template>
<style scoped>
.reference-messages-anchor {
  display: flex;
  align-items: center;
  font-size: 20px;
  padding-left: 6px;
  color: var(--scalar-color-1);
}

.reference-messages-label {
  display: block;
  font-size: var(--scalar-mini);
}

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
