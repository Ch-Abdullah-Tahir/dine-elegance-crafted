export const OAK_ROOM_CAPACITY = 16;
export const CELLAR_CAPACITY = 32;
export type BookingType = "Private Dining" | "Main Hall";
export type RoomPreference = "Oak Room" | "Cellar" | "Main Hall";

export function reservationRoom(type: BookingType, guests: number, preferred: RoomPreference) {
  if (type === "Main Hall") return "Main Hall";
  if (guests > CELLAR_CAPACITY) return null;
  if (guests > OAK_ROOM_CAPACITY) return "Cellar";
  return preferred === "Cellar" ? "Cellar" : "Oak Room";
}

export const privateCapacityMessage = `Private rooms hold up to ${CELLAR_CAPACITY} guests. Choose Main Hall or reduce your group size.`;
