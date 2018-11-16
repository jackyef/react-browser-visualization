import Loadable from 'react-loadable';

export const HomeView = Loadable({
  loader: () => import(/* webpackChunkName: "home-view" */ './View'),
  loading: () => null,
});
