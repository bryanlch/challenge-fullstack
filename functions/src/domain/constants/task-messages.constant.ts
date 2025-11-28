export const TaskMessages = {
   VALIDATION: {
      AUTH_REQUIRED: 'User not authenticated',
      DATA_REQUIRED: 'Title and Description are required',
      ID_REQUIRED: 'Task ID is required',
   },
   ERROR: {
      CREATE_FAILED: 'Error creating task',
      GET_FAILED: 'Error getting tasks',
      UPDATE_FAILED: 'Error updating task',
      DELETE_FAILED: 'Error deleting task',
   },
   SUCCESS: {
      UPDATED: 'Task updated successfully',
      DELETED: 'Task deleted successfully',
   }
} as const;