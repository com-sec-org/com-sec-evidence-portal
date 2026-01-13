export interface Client {
  id: string;
  name: string;
  engagementType: string;
  engagementYear: number;
  status: "active" | "completed" | "in-progress";
}

export const mockClients: Client[] = [
  {
    id: "satoshi-energy",
    name: "Satoshi Energy",
    engagementType: "SOC 2 Type 1",
    engagementYear: 2025,
    status: "in-progress",
  },
  {
    id: "vheda-health",
    name: "Vheda Health",
    engagementType: "SOC 2 Type 1",
    engagementYear: 2025,
    status: "active",
  },
  {
    id: "client-a",
    name: "Client A",
    engagementType: "SOC 2 Type 1",
    engagementYear: 2025,
    status: "active",
  },
];
