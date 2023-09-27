import { useNavigate } from 'react-router-dom';
import './index.less'
const Nav = () => {
  const navgate = useNavigate();
  const toLink = (url: string) => {
    navgate(url)
  }
  return <div >
    <div className='nav' onClick={() => { toLink('gui') }} >Gui</div>
    <div className='nav' onClick={() => { toLink('uv') }} >Uv</div>
    <div className='nav' onClick={() => { toLink('texture') }} >贴图</div>
    <div className='nav' onClick={() => { toLink('iridescent') }} >虹彩效应</div>
    <div className='nav' onClick={() => { toLink('gsap') }} >gsap动画</div>
    <div className='nav' onClick={() => { toLink('point') }} >点光源</div>
    <div className='nav' onClick={() => { toLink('particle') }} >粒子</div>
    <div className='nav' onClick={() => { toLink('galaxy') }} >星系</div>
    <div className='nav' onClick={() => { toLink('shader') }} >着色器材质</div>
  </div>
}
export default Nav;