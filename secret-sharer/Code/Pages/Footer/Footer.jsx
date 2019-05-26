import React from "react"

export default function Footer(props) {

    return (
        <footer className="page-footer blue-grey darken-3">
            <div className="container">
                <div className="row">
                    <div className="col l6 s12">
                        <h6 className="white-text">What is this?</h6>
                        <p className="white-text">
                            This webapp implements Shamir's scheme for secret sharing
                            together with AES.
                        </p>
                    </div>
                    <div className="col l4 offset-l2 s12">
                        <h6 className="white-text">Authors</h6>
                        <ul className="browser-default" style={{fontSize: "1.1rem"}}>
                            <a href="https://github.com/alaneos777" target="_blank">
                                <li className="white-text">
                                    alaneos777
                                </li>
                            </a>
                        </ul>

                    </div>
                </div>
            </div>
            
            <div className="footer-copyright blue-grey darken-4">
                <div className="container">
                    Made by CompilandoConocimiento. Making the world a happier place
                </div>
            </div>
        </footer>
    )
}