const appUrl = process.env.APP_URL || 'http://localhost:3000'; // Replace with your default URL

export const DEFAULT_ROUTES = {
  auth: {
    login: {
      url: `${appUrl}/api/auth/sign-in`,
      method: 'POST',
    },
    register: {
      url: `${appUrl}/api/auth/sign-up`,
      method: 'POST',
    },
  },
  hotels: {
    get: {
      url: `${appUrl}/api/v1/hotels`,
      method: 'GET',
      params: {
        limit: 'number',
        page: 'number',
      },
    },
    create: {
      url: `${appUrl}/api/v1/hotels`,
      method: 'POST',
    },
  },
};
