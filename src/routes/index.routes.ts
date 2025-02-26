import getAuthRouter from './auth.routes';
import getUserRouter from './user.routes';
import getProductRouter from './product.routes';
import getOrderRouter from './order.routes';

export default async () => {
  const routes = await Promise.all([
    getAuthRouter(),
    getUserRouter(),
    getProductRouter(),
    getOrderRouter(),

  ]);
  return routes;
};
