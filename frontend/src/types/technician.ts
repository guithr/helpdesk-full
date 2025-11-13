export interface Technician {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  technician: {
    availableHours: string[];
  } | null;
}
