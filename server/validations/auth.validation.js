export const registerSchema = {
    body: {
      type: 'object',
      required: ['email', 'password', 'role'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 },
        role: { type: 'string', enum: ['CUSTOMER', 'OWNER', 'ADMIN', 'COOK', 'WAITER', 'CASHIER'] },
        name: { type: 'string', minLength: 1, nullable: true },
        phone: { type: 'string', minLength: 1, nullable: true },
      },
      additionalProperties: false,
    },
  };
  
  export const loginSchema = {
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 },
      },
      additionalProperties: false,
    },
  };
  
  export const refreshTokenSchema = {
    body: {
      type: 'object',
      required: ['refreshToken'],
      properties: {
        refreshToken: { type: 'string', minLength: 1 },
      },
      additionalProperties: false,
    },
  };