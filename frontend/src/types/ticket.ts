export type TicketStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";

export interface CreateTicketInput {
  title: string;
  description?: string;
  service: string[];
}

// Adicione este novo type
export interface CreateTicketFormInput {
  title: string;
  description?: string;
  serviceId: string;
}

export interface Ticket {
  id: string;
  status: TicketStatus;
  description: string;
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
