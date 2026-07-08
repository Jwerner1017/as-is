export type ChatMessageType = 
  | 'text' 
  | 'tip' 
  | 'system' 
  | 'rage_buy_triggered' 
  | 'all_mine_triggered';

export interface ChatMessage {
  id: string;
  streamId: string;
  userId: string;
  username: string;
  type: ChatMessageType;
  content: string;
  amount?: number;           // Used for tips
  isPublic?: boolean;        // For tips (public or private)
  timestamp: string;
}
