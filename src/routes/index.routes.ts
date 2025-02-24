import getAuthRouter from './auth.routes';
import getUserRouter from './user.routes';

export default async () => {
  const routes = await Promise.all([
    getAuthRouter(),
    getUserRouter(),

  ]);
  return routes;
};
