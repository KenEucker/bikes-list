# AdminJS

## Location
- Mounted in `apps/api` at `/`.
- Served by Fastify alongside the public API.

## Authentication
- Access is restricted to users with `ADMIN` or `SUPER_ADMIN` roles.
- The API session cookie (`bl_session`) is used to authorize requests.

## Resource grouping
- **Platform**: `City`, `SystemSetting`
- **Identity**: `User`, `RoleAssignment`
- **Moderation**: `MediaObject`, `ModerationAction`

## Moderation actions
- Media records include explicit approve/reject actions.
- Rejections require a reason before the action succeeds.
- All actions write to `ModerationAction` for audit history.

## Branding
- Company name: BikesList Admin
- Primary color palette is branded, but layout uses the default AdminJS UI.
