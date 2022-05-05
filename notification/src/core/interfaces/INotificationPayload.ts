export interface INotificationPayload {
  content: string;
  type: keyof typeof NotificationType;
  payload?: any;
  userId: number;
}

export enum NotificationType {
  POST_UPDATED = 'post-updated',
}
