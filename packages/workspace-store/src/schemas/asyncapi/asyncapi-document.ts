import { intersection, object, optional, record, string, unknown } from '@scalar/validation'

import { extensions } from '@/schemas/extensions'
import { WorkspaceManagedExtensions } from '@/schemas/extensions/document/workspace-managed-extensions'
import { XScalarIsDirty } from '@/schemas/extensions/document/x-scalar-is-dirty'
import { XScalarOriginalDocumentHash } from '@/schemas/extensions/document/x-scalar-original-document-hash'
import { XScalarRegistryMeta } from '@/schemas/extensions/document/x-scalar-registry-meta'

/**
 * Minimal AsyncAPI Info Object.
 *
 * Intentionally scoped to the fields we surface in the MVP. AsyncAPI's real Info Object
 * is a superset (contact, license, termsOfService, tags, externalDocs, ...) — we can
 * grow this as consumers need the extra fields.
 */
export const AsyncApiInfoObject = object(
  {
    title: string({ typeComment: 'REQUIRED. The title of the application.' }),
    version: string({
      typeComment: 'REQUIRED. Provides the version of the application API (not the AsyncAPI Specification version).',
    }),
    description: optional(
      string({
        typeComment:
          'A short description of the application. CommonMark syntax can be used for rich text representation.',
      }),
    ),
  },
  { typeName: 'AsyncApiInfoObject' },
)

export type AsyncApiInfoObject = {
  /** REQUIRED. The title of the application. */
  title: string
  /** REQUIRED. Provides the version of the application API (not the AsyncAPI Specification version). */
  version: string
  /** A short description of the application. CommonMark syntax can be used for rich text representation. */
  description?: string
}

/**
 * AsyncAPI-specific extensions. Store-managed metadata (source url, document
 * hash, dirty flag, registry meta) is shared with the OpenAPI side via the
 * dedicated extension modules so the two cannot drift apart.
 *
 * `x-original-aas-version` stays here because it is the AsyncAPI analog of
 * `x-original-oas-version` — different field names per spec, so unified
 * sharing is not a fit.
 */
export const AsyncApiExtensions = object(
  {
    'x-original-aas-version': optional(
      string({ typeComment: 'Original AsyncAPI Specification version the document was loaded with.' }),
    ),
  },
  { typeName: 'AsyncApiExtensions' },
)

export type AsyncApiExtensions = Partial<{
  /** Original AsyncAPI Specification version the document was loaded with. */
  'x-original-aas-version': string
}>

/**
 * Minimal AsyncAPI Message Object.
 *
 * MVP shape: just the fields the api-reference renderer surfaces. The real AsyncAPI 3.0
 * Message Object is much richer (headers, correlationId, schemaFormat, traits, bindings,
 * examples, tags, externalDocs, ...) — grow as the renderer learns to display them.
 *
 * `payload` stays `unknown` because AsyncAPI payloads can be either an inline Schema
 * Object or a `$ref` to one — the renderer narrows and dereferences manually.
 */
export const AsyncApiMessageObject = object(
  {
    name: optional(string({ typeComment: 'Machine-friendly name for the message.' })),
    title: optional(string({ typeComment: 'Human-friendly title for the message.' })),
    summary: optional(string({ typeComment: 'A short summary of what the message is about.' })),
    description: optional(
      string({
        typeComment: 'A longer description of the message. CommonMark syntax can be used for rich text representation.',
      }),
    ),
    contentType: optional(string({ typeComment: 'The content type to use when encoding/decoding a message payload.' })),
    payload: optional(
      unknown({ typeComment: 'Definition of the message payload. May be a Schema Object or a $ref to one.' }),
    ),
  },
  { typeName: 'AsyncApiMessageObject' },
)

export type AsyncApiMessageObject = {
  /** Machine-friendly name for the message. */
  name?: string
  /** Human-friendly title for the message. */
  title?: string
  /** A short summary of what the message is about. */
  summary?: string
  /** A longer description of the message. CommonMark syntax can be used for rich text representation. */
  description?: string
  /** The content type to use when encoding/decoding a message payload. */
  contentType?: string
  /** Definition of the message payload. May be a Schema Object or a $ref to one. */
  payload?: unknown
}

/**
 * AsyncAPI Components Object (MVP subset).
 *
 * Only carries `messages` and `schemas` for this slice — that is what the Messages section
 * needs to render. Channels, operations, servers, parameters, etc. can be added later.
 */
export const AsyncApiComponentsObject = object(
  {
    messages: optional(record(string(), AsyncApiMessageObject)),
    schemas: optional(record(string(), unknown())),
  },
  { typeName: 'AsyncApiComponentsObject' },
)

export type AsyncApiComponentsObject = {
  /** Map of reusable Message Objects keyed by name. */
  messages?: Record<string, AsyncApiMessageObject>
  /** Map of reusable Schema Objects keyed by name. The renderer narrows entries as needed. */
  schemas?: Record<string, unknown>
}

/**
 * Minimal AsyncAPI Document.
 *
 * MVP shape: the spec version discriminator, the minimal Info Object, and the shared
 * store-managed metadata extensions. Present on the discriminated {@link WorkspaceDocument}
 * union via the required `asyncapi` field.
 */
export const AsyncApiDocument = intersection(
  [
    object(
      {
        asyncapi: string({
          typeComment: 'REQUIRED. The AsyncAPI Specification version the document uses (for example "3.0.0").',
        }),
        info: AsyncApiInfoObject,
        components: optional(AsyncApiComponentsObject),
        [extensions.document.navigation]: optional(unknown()),
      },
      { typeName: 'AsyncApiDocumentCore' },
    ),
    AsyncApiExtensions,
    // Shared store-managed metadata. Composed from the same extension modules
    // the OpenAPI side uses so the two document shapes cannot drift apart.
    WorkspaceManagedExtensions,
    XScalarOriginalDocumentHash,
    XScalarIsDirty,
    XScalarRegistryMeta,
  ],
  {
    typeName: 'AsyncApiDocument',
    typeComment: 'Root AsyncAPI document including Scalar workspace extensions.',
  },
)

export type AsyncApiDocument = {
  /** REQUIRED. The AsyncAPI Specification version the document uses (for example "3.0.0"). */
  asyncapi: string
  /** REQUIRED. Provides metadata about the application. */
  info: AsyncApiInfoObject
  /** Reusable components: messages, schemas, etc. */
  components?: AsyncApiComponentsObject
  /**
   * Workspace-store-built navigation tree. Populated during ingestion. Typed as
   * `unknown` to keep the runtime schema's `Static<>` inference matching this TS
   * type; consumers narrow with the shared `TraversedDocument` type at access.
   */
  'x-scalar-navigation'?: unknown
} & AsyncApiExtensions &
  WorkspaceManagedExtensions &
  XScalarOriginalDocumentHash &
  XScalarIsDirty &
  XScalarRegistryMeta
