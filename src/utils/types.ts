interface IEventLocation {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface IEvent {
  id: number;
  eventName: string;
  eventDate: string;
  organizer: string;
  email: string;
  phone: string;
  location: IEventLocation;
  createdAt: string;
  updatedAt: string;
}

export interface IFilterData
  extends Omit<IEvent, "id" | "location">,
    IEventLocation {}
