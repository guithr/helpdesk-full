export type TicketStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";

export interface Ticket {
  id: string;
  status: TicketStatus;
  title: string;
  totalPrice: string | null;
  updatedAt: string;
  customer: {
    user: {
      name: string;
      avatarUrl: string | null;
      isActive: boolean;
    };
  };
  technician: {
    temporaryPassword: boolean;
    user: {
      name: string;
      avatarUrl: string | null;
    };
  };
  ticketServices: Array<{
    service: {
      name: string;
    };
  }>;
}
