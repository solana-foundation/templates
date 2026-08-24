export function isNotificationNewerThanSnapshot(notificationSlot: bigint, snapshotSlot: bigint) {
  return notificationSlot > snapshotSlot
}
