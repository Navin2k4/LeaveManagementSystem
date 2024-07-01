import './layout.scss'
import Navbar from '../components/NavBar/navBar';
import {Outlet} from 'react-router-dom';

function Layout(){
    return(
        <div className="layout">
            <div className="navbar"><Navbar/></div>
            <div className="contents">
                <Outlet/>
            </div>
        </div>
    )
}

export default Layout;