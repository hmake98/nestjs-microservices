export interface IMailPayload {
  template: keyof typeof EmailTemplates;
  payload: PaylaodType;
}

enum EmailTemplates {
  POST_UPDATED = 'post-updated',
}

interface PaylaodType {
  emails: string[];
  subject: string;
  data: any;
}
