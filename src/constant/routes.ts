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
    'Get Hotels': {
      url: `${appUrl}/api/v1/hotels`,
      method: 'GET',
      'Query Params': {
        limit: 'number',
        page: 'number',
      },
    },
    'Get Single Hotel': {
      url: `${appUrl}/api/v1/hotels/:id`,
      method: 'GET',
      params: {
        id: 'string',
      },
    },
    create: {
      url: `${appUrl}/api/v1/hotels`,
      method: 'POST',
    },
  },
};
