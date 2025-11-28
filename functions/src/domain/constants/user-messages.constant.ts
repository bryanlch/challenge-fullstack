export const UserMessages = {
   VALIDATION: {
      EMAIL_REQUIRED: 'Email is required',
      AUTH_REQUIRED: 'User not authenticated',
      DATA_REQUIRED: 'Name, Lastname and Email are required',
      SEARCH_TERM_REQUIRED: 'Search term is required',
   },
   ERROR: {
      ALREADY_EXISTS: 'User already exists',
      NOT_FOUND: 'User not found',
      CHECK_FAILED: 'Error checking user',
      CREATE_FAILED: 'Error creating user',
      PROFILE_FAILED: 'Error retrieving user profile',
      SEARCH_FAILED: 'Error searching users',
      GET_ALL_FAILED: 'Error retrieving users',
   },
   SUCCESS: {
      CREATED: 'User created successfully',
   }
} as const;