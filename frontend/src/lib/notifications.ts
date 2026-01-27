// Simple notification utility (can be enhanced with toast library later)
export const notifications = {
  success: (message: string) => {
    console.log('✅ Success:', message);
    // TODO: Add toast notification
  },
  error: (message: string) => {
    console.error('❌ Error:', message);
    // TODO: Add toast notification
  },
  info: (message: string) => {
    console.info('ℹ️ Info:', message);
    // TODO: Add toast notification
  },
};
