<script setup lang="ts">
import type { ApiReferenceConfigurationRaw } from '@scalar/types/api-reference'
import type { WorkspaceEventBus } from '@scalar/workspace-store/events'
import type { AsyncApiDocument } from '@scalar/workspace-store/schemas/asyncapi/asyncapi-document'
import { computed } from 'vue'

import { Section, SectionHeader } from '@/components/Section'
import SectionContainer from '@/components/Section/SectionContainer.vue'
import SectionContainerAccordion from '@/components/Section/SectionContainerAccordion.vue'
import SectionHeaderTag from '@/components/Section/SectionHeaderTag.vue'

import Message from './Message.vue'

const { document, options } = defineProps<{
  document: AsyncApiDocument
  eventBus: WorkspaceEventBus
  options: Pick<
    ApiReferenceConfigurationRaw,
    | 'layout'
    | 'orderRequiredPropertiesFirst'
    | 'orderSchemaPropertiesBy'
    | 'hideModels'
  >
}>()

/** Stable id used for the section anchor. Sidebar wiring can target this later. */
const sectionId = 'messages'

const messageEntries = computed(() =>
  Object.entries(document.components?.messages ?? {}),
)

const messageId = (name: string) => `message/${name}`
</script>
<template>
  <SectionContainer
    v-if="options.layout !== 'classic'"
    :id="sectionId">
    <Section
      :id="sectionId"
      aria-label="Messages">
      <SectionHeader>
        <SectionHeaderTag :level="2">Messages</SectionHeaderTag>
      </SectionHeader>
      <Message
        v-for="[name, message] in messageEntries"
        :key="name"
        :document
        :eventBus
        :id="messageId(name)"
        :isCollapsed="false"
        :message
        :name
        :options />
    </Section>
  </SectionContainer>
  <SectionContainerAccordion
    v-else
    aria-label="Messages"
    class="pb-12"
    :modelValue="true">
    <template #title>
      <SectionHeader :level="2">Messages</SectionHeader>
    </template>
    <Message
      v-for="[name, message] in messageEntries"
      :key="name"
      :document
      :eventBus
      :id="messageId(name)"
      :isCollapsed="false"
      :message
      :name
      :options />
  </SectionContainerAccordion>
</template>
