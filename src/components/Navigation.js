import {Link} from "react-router-dom";
import "./Navigation.css";

const Navigation = ({userObj}) => {
    const widthValue = window.screen.availWidth;

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/" className="Home"><i class="fab fa-twitter"></i></Link>
                </li>
                <li>
                    {widthValue > 426? (
                        <Link to="/profile" className="Profile"># {userObj.displayName}'s profile</Link>
                    ) : (
                        <Link to="/profile" className="Profile"><i class="fas fa-user-circle"></i></Link>
                    )}
                </li>
            </ul>
        </nav>
    )
};

export default Navigation;