import { Link } from "react-router-dom";
import "./NavBar.scss";
import { useState } from "react";

function Navbar() {
    const [open, setOpen] = useState(false);
    return (
        <nav className="navbar">
            <div className="left">
                <a href="/" className="logo">
                    <img src="https://upload.wikimedia.org/wikipedia/ta/d/d0/Vcet_logo.jpg" alt="VCET Logo" />
                    <span>Velammal College of Engineering and Technology</span>
                </a>
            </div>
            <div className="right hidden lg:flex">
                <a href="/">Home</a>
                <a href="/studentdashboard">Dashboard</a>
                <Link to="/login" className="user-login">
                    <div className="user">
                        <img
                            src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            alt="User"
                        />
                        <span>John Doe</span>
                    </div>
                </Link>
                <div className="menuicon lg:hidden">
                    <img    
                        src="/menu.png"
                        alt=""
                        onClick={() => setOpen((prev) => !prev)}
                    />
                </div>
                <div className={open ? "menu active" : "menu"}>
                    <div className="topics">
                        <a href="/">Home</a><br /><br />
                        <a href="/">Dashboard</a>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
