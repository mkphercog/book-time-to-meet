export const ROUTES = {
  home: () => "/",
  auth: {
    signInMatchAll: () => "/sign-in(.*)",
    signUpMatchAll: () => "/sign-up(.*)",
  },
  events: {
    home: () => "/events",
    new: () => "/events/new",
    edit: (eventId: string) => `/events/${eventId}/edit`,
  },
  book: {
    home: () => "/book",
    eventDetails: (clerkUserId: string, eventId: string) =>
      `/book/${clerkUserId}/${eventId}`,
    allUserEvents: (clerkUserId: string) => `/book/${clerkUserId}`,
    succes: (clerkUserId: string, eventId: string, startTime: string) =>
      `/book/${clerkUserId}/${eventId}/success?startTime=${startTime}`,
    copyLink: (clerkUserId: string, eventId: string) =>
      `${location.origin}/book/${clerkUserId}/${eventId}`,
    matchAll: () => "/book(.*)",
  },
  schedule: {
    home: () => "/schedule",
  },
};
