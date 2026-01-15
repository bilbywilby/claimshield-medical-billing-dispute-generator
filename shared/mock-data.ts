import type { User, Chat, ChatMessage, Dispute } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'User A' },
  { id: 'u2', name: 'User B' }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'General' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Hello', ts: Date.now() },
];
export const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'disp_1',
    patientName: 'Jane Doe',
    patientHash: 'REF-8821-X',
    statute: 'No Surprises Act (45 CFR § 149.410)',
    cptCode: '99214',
    billedAmount: 450.00,
    fmvAmount: 185.50,
    variance: 264.50,
    variancePercent: 142.5,
    providerName: 'Metropolitan General Hospital',
    dateOfService: '2024-03-15',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'disp_2',
    patientName: 'John Smith',
    patientHash: 'ACC-4492-Z',
    statute: 'Texas Health & Safety Code § 146.002',
    cptCode: '70450',
    billedAmount: 1200.00,
    fmvAmount: 350.00,
    variance: 850.00,
    variancePercent: 242.8,
    providerName: 'Bayside Imaging Center',
    dateOfService: '2024-04-01',
    createdAt: Date.now() - 86400000,
  }
];