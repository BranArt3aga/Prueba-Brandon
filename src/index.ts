import { createApp } from './app';

const PORT = process.env['PORT'] ? parseInt(process.env['PORT']) : 3000;

const app = createApp();

app.listen(PORT, () => {
  console.log(`Task Management API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API base: http://localhost:${PORT}/api/v1`);
});
