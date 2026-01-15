import { IndexedEntity } from "./core-utils";
import type { User, Chat, ChatMessage, Dispute } from "@shared/types";
import { MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS, MOCK_DISPUTES } from "@shared/mock-data";
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
export class DisputeEntity extends IndexedEntity<Dispute> {
  static readonly entityName = "dispute";
  static readonly indexName = "disputes";
  static readonly initialState: Dispute = {
    id: "",
    patientName: "",
    patientHash: "",
    statute: "",
    cptCode: "",
    billedAmount: 0,
    fmvAmount: 0,
    variance: 0,
    variancePercent: 0,
    providerName: "",
    dateOfService: "",
    createdAt: 0,
  };
  static seedData = MOCK_DISPUTES;
}
export type ChatBoardState = Chat & { messages: ChatMessage[] };
const SEED_CHAT_BOARDS: ChatBoardState[] = MOCK_CHATS.map(c => ({
  ...c,
  messages: MOCK_CHAT_MESSAGES.filter(m => m.chatId === c.id),
}));
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  static seedData = SEED_CHAT_BOARDS;
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}