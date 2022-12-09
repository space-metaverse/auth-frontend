declare global {
  interface UserAnalyticsProps {
    id: () => string
    anonymousId: () => string
  }

  interface AnalyticsProps {
    user: () => UserAnalyticsProps
  }

  var analytics: AnalyticsProps; // eslint-disable-line
}

export {};
