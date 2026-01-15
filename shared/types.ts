export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
}
export interface Dispute {
  id: string;
  patientName: string;
  patientHash: string; // Case reference or ID
  statute: string;     // Legal reference (e.g., No Surprises Act)
  cptCode: string;
  billedAmount: number;
  fmvAmount: number;   // Fair Market Value benchmark
  variance: number;    // Computed: billed - fmv
  variancePercent: number;
  providerName: string;
  dateOfService: string;
  createdAt: number;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}