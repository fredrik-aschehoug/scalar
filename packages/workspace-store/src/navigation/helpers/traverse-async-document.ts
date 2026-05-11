import { type NavigationOptions, getNavigationOptions } from '@/navigation/get-navigation-options'
import { traverseDescription } from '@/navigation/helpers/traverse-description'
import type { AsyncApiDocument } from '@/schemas/asyncapi/asyncapi-document'
import type { TraversedDocument, TraversedEntry } from '@/schemas/navigation'
import type { InfoObject } from '@/schemas/v3.1/strict/info'

import { traverseAsyncMessages } from './traverse-async-messages'

/**
 * Build the navigation tree for an AsyncAPI document.
 *
 * MVP scope: introduction + info.description headings (via the shared
 * `traverseDescription`) followed by the `components.messages` container.
 * Channels, operations, servers, and bindings are still unrendered and get
 * no sidebar entries.
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

  // `traverseDescription` is typed against the OpenAPI Info Object. AsyncAPI's
  // is a structural subset (title, version, description) and the helper only
  // reads `description`, so the cast is safe.
  const entries: TraversedEntry[] = traverseDescription({
    generateId,
    parentId: documentId,
    info: document.info as unknown as InfoObject,
  })

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
