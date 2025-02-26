import getAuthRouter from './auth.routes';
import getUserRouter from './user.routes';
import getProductRouter from './product.routes';
import getOrderRouter from './order.routes';
import getDashBoardRouter from './dashboard.routes';

export default async () => {
  const routes = await Promise.all([
    getAuthRouter(),
    getUserRouter(),
    getProductRouter(),
    getOrderRouter(),
    getDashBoardRouter(),

  ]);
  return routes;
};
