import { createHashRouter } from 'react-router-dom';
// import Framework from './Framework';
import Error from './Error';
import Home from '@/pages/home';
import Gui from '@/pages/gui';
import Uv from '@/pages/uv';
import Texture from '@/pages/texture';
import Iridescent from '@/pages/iridescent'
import Gsap from '@/pages/gsap'
import Point from '@/pages/point'
import Particle from '@/pages/particle';
import Galaxy from '@/pages/galaxy';
import Shader from '@/pages/shader';

const router = createHashRouter([
  {
    path: '/',
    errorElement: <Error />,
    element: <Home />,
    children: [
      {
        path: '/gui',
        element: <Gui />,
      },
      {
        path: '/uv',
        element: <Uv />,
      },
      {
        path: '/texture',
        element: <Texture />,
      },
      {
        path: '/iridescent',
        element: <Iridescent />
      },
      {
        path: '/gsap',
        element: <Gsap />,
      },
      {
        path: '/point',
        element: <Point />
      },
      {
        path: '/particle',
        element: <Particle />
      },
      {
        path: '/galaxy',
        element: <Galaxy />
      },
      {
        path: '/shader',
        element: <Shader />
      }
    ],
  },
]);

export default router;
