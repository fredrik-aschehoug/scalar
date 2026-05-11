---
'@scalar/workspace-store': minor
'@scalar/api-reference': minor
---

feat(api-reference): render an AsyncAPI "Messages" section in the document body when the active document is AsyncAPI. Extends `AsyncApiDocument` with optional `components.messages` and `components.schemas`. Sidebar navigation, search indexing, and channel/operation rendering remain out of scope for this slice.
