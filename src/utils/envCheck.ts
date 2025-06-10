export const checkEnvironmentVariables = () => {
  console.log('Checking environment variables...');
  console.log('All env variables:', import.meta.env);
  console.log('API Key exists:', !!import.meta.env.VITE_OPENROUTER_API_KEY);
  console.log('API Key length:', import.meta.env.VITE_OPENROUTER_API_KEY?.length);
  return {
    hasApiKey: !!import.meta.env.VITE_OPENROUTER_API_KEY,
    keyLength: import.meta.env.VITE_OPENROUTER_API_KEY?.length
  };
}; 