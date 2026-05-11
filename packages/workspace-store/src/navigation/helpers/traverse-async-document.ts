import { type NavigationOptions, getNavigationOptions } from '@/navigation/get-navigation-options'
import type { AsyncApiDocument } from '@/schemas/asyncapi/asyncapi-document'
import type { TraversedDocument, TraversedEntry } from '@/schemas/navigation'

import { traverseAsyncMessages } from './traverse-async-messages'

/**
 * Build the navigation tree for an AsyncAPI document.
 *
 * MVP scope: only the `components.messages` container. Channels, operations,
 * servers, and bindings are still unrendered and get no sidebar entries.
 */
export const traverseAsyncDocument = (
  documentName: string,
  document: AsyncApiDocument,
  options?: NavigationOptions,
): TraversedDocument => {
  const { generateId } = getNavigationOptions(documentName, options)

  const documentId = generateId({
    type: 'document',
    info: document.info,
    name: documentName,
  })

  const entries: TraversedEntry[] = []

  const messages = traverseAsyncMessages({ document, generateId, documentId })
  if (messages.length) {
    entries.push({
      type: 'messages',
      id: generateId({ type: 'messages', parentId: documentId }),
      title: 'Messages',
      name: 'Messages',
      children: messages,
    })
  }

  const documentTitle = document.info?.title?.trim() || 'Untitled Document'

  return {
    id: documentId,
    type: 'document',
    title: documentTitle,
    name: documentName,
    children: entries,
  }
}
