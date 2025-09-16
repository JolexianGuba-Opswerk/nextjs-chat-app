import { RealtimeChannel } from "@supabase/supabase-js";

export function realtimeStatusHandler(
  status: string,
  subscription: RealtimeChannel | null,
  retryCallback: () => void
) {
  switch (status) {
    case "SUBSCRIBED":
      console.log("Successfully subscribed");
      break;
    case "CHANNEL_ERROR":
      console.error("Channel error - retrying in 5 seconds");
      setTimeout(() => {
        subscription?.unsubscribe();
        retryCallback();
      }, 5000);
      break;
    case "TIMED_OUT":
      console.error("Subscription timed out - retrying immediately");
      subscription?.unsubscribe();
      retryCallback();
      break;
    case "CLOSED":
      console.log("Subscription closed");
      break;
    default:
      console.warn("Unknown subscription status:", status);
  }
}
