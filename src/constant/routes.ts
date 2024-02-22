const appUrl = process.env.APP_URL || 'http://localhost:3000'; // Replace with your default URL

export const DEFAULT_ROUTES = {
  auth: {
    register: {
      url: `${appUrl}/api/auth/sign-up`,
      method: 'POST',
    },
    login: {
      credential: {
        url: `${appUrl}/api/auth/sign-in`,
        method: 'POST',
      },
    },
    session: {
      url: `${appUrl}/api/auth/session`,
      method: 'GET',
    },
    logout: {
      url: `${appUrl}/api/auth`,
      method: 'POST, PATCH, DELETE',
    },
  },
  hotels: {
    create: {
      url: `${appUrl}/api/v1/hotels`,
      method: 'POST',
      fields: {
        name: 'required',
        description: 'optional',
        address: 'required',
        phone_number: 'required',
        website: 'optional',
        images: 'array of image url',
        rating: 'optional',
        amenities: 'array of amenities',
      },
    },
    'Get Hotels': {
      url: `${appUrl}/api/v1/hotels`,
      method: 'GET',
      'Query Params': {
        q: 'text',
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
  },
};
