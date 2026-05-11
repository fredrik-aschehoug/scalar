---
'@scalar/workspace-store': minor
'@scalar/api-reference': minor
---

feat(api-reference): add a sidebar "Messages" entry for AsyncAPI documents. The workspace-store now builds an `x-scalar-navigation` tree for AsyncAPI documents (one `TraversedMessages` container with a `TraversedMessage` child per entry in `components.messages`), and the api-reference Messages section is driven by that tree so sidebar clicks scroll to matching body anchors. Search indexing, dedicated sidebar icon, channel/operation rendering, and a `hideMessages` config option remain out of scope for this slice.
