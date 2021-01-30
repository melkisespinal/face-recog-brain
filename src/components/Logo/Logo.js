import './Logo.css';
import Tilt from 'react-tilt';
import logoSvg from './logo.svg';

const Logo = () => {
    return(
        <div className='ma4 nt0'>
            <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 150, width: 150 }} >
                <div className="Tilt-inner pa3">
                    <img style={{ height: 100, width: 100, paddingTop: '10px' }} alt='logo' src={logoSvg}/>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;