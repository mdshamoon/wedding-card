export type InvitationVariant = "wedding" | "reception";

export const invitationVariants = {
  wedding: {
    eventIndexes: [0, 1],
    countdownTarget: "2027-03-24T11:00:00",
    sharePath: "",
  },
  reception: {
    eventIndexes: [1],
    countdownTarget: "2027-03-25T19:00:00",
    sharePath: "#/reception",
  },
} as const;

