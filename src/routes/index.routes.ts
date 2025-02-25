import getAuthRouter from './auth.routes';
import getUserRouter from './user.routes';
import getProductRouter from './product.routes';

export default async () => {
  const routes = await Promise.all([
    getAuthRouter(),
    getUserRouter(),
    getProductRouter(),

  ]);
  return routes;
};
