import Nav from '@/pages/nav';
import { Outlet } from 'react-router-dom';

import './index.less';

function Home(props) {
  return (
    <div className='main'>
      <div className='mainLeft'>
        <Nav />
      </div>
      <div className='mainright'>
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
