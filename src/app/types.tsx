export type Muammo = {
  id: string;
  title: string;
  description: string;
  status: "kutilmoqda" | "tekshirilyapti" | "bajarildi";
  imageUrl?: string;
  location?: string;
  createdAt?: any;
  ownerId: string;
};
