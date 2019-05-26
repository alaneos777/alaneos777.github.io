import React from "react"
import {Link} from "react-router-dom"

export default function Header(props) {
    return (
        <React.Fragment>
            <div className="navbar-fixed blue-grey darken-3">
                <nav className="blue-grey darken-3">
                    <div className="nav-wrapper blue-grey darken-3 container">
                        <a className="brand-logo center hide-on-small-only" style={{fontSize: "1.9rem"}}>
                            Secret Sharer
                        </a>
                        <a className="brand-logo center hide-on-med-and-up" style={{fontSize: "1.1rem"}}>
                            Secret Sharer
                        </a>
                        <a href="" data-target="SideNav" className="sidenav-trigger show-on-large">
                            <i className="material-icons white-text">menu</i>
                        </a>
                        <Link to="/" className="right" style={{height: "100%"}}>
                            <i className="material-icons">home</i>
                        </Link>
                    </div>
                </nav>
            </div>

            <ul id="SideNav" className="sidenav">
                <li className="center">
                    <br />
                    <h5 style={{fontWeight: 200, fontSize: "1.9rem"}}>
                    Secret Sharer
                    </h5>
                </li>
				<br />
                <React.Fragment>
                    <li><div className="divider"></div></li>
                    <li><a className="subheader">Actions</a></li>
                    <li>
                        <Link className="waves-effect" to="/Encrypt/">
                            Encryption
                        </Link>
                    </li>
                    <li>
                        <Link className="waves-effect" to="/Decrypt/">
                            Decryption
                        </Link>
                    </li>
                </React.Fragment>
                <React.Fragment>
                    <li><div className="divider"></div></li>
                    <li><a className="subheader">Help</a></li>
                    <li>
                        <Link className="waves-effect" to="/About/">
                            About
                        </Link>
                    </li>
                </React.Fragment>
            </ul>
        </React.Fragment>
    )
}
