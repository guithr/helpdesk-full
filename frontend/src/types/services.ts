export type ServicesStatus = "TRUE" | "FALSE";

export interface Service {
  id: string;
  name: string;
  status: ServicesStatus;
  description: string | null;
  price: number;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
