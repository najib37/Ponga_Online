import { StateType } from "../types/StateType";

export class Notification {
  id: string;
  type: string;
  content: string;
  state: StateType;
  senderId?: string;
  recipientId?: string;
}
