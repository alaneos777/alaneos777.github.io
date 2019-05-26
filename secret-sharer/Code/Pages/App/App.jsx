// ======================================================================
// ============          WEB APP IN REACT           =====================
// ======================================================================

import React from "react"
import ReactDOM from "react-dom"
import M from "materialize-css"
import { HashRouter, Switch, Route, Link } from 'react-router-dom'

import Header from "../Header/Header.jsx"
import Footer from "../Footer/Footer.jsx"

import Encrypt from "../Encrypt/Encrypt.jsx"
import Decrypt from "../Decrypt/Decrypt.jsx"
import About from "../About/About.jsx"

import style from "./App.css"


function Home(props) {

    return (
        <div className="row">
            <div className="col s12 m8 offset-m2 l6 offset-l3">
                <div className="card-panel white">

                    <h4 className="blue-grey-text text-darken-2 center"> Select one option: </h4>
                    <br />
                    <React.Fragment>
                        <div className="row"> 
                            <Link 
                                className={`col s10 offset-s1 btn-large waves-effect indigo lighten-2`}
                                to={"/Encrypt/"}>
                                Encryption
                            </Link>
                        </div>
                        <div className="row"> 
                            <Link 
                                className={`col s10 offset-s1 btn-large waves-effect cyan lighten-1`}
                                to={"/Decrypt/"}>
                                Decryption
                            </Link>
                        </div>
                    </React.Fragment>
                </div> 
            </div>
        </div>
    )
}

class App extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            SideMenu: null
        }
    }

    componentDidMount() {
        let DOMNode = document.getElementById('SideNav')
        let SideMenu = M.Sidenav.init(DOMNode, {})

        this.setState({SideMenu}) 
    }

    render() {

        return (
            <React.Fragment>
                <Header />

                <main>
                    <br />
                    <Switch>
                        <Route
                            exact  = {true}
                            path   = '/' 
                            render = {(props) =>  <Home {...props} />}
                        />
                        <Route
                            exact  = {false}
                            path   = '/Encrypt/'
                            render = {(props) =>  <Encrypt {...props} />}
                        />
                        <Route
                            exact  = {false}
                            path   = '/Decrypt/' 
                            render = {(props) =>  <Decrypt {...props} />}
                        />
                        <Route
                            exact  = {false}
                            path   = '/About/' 
                            render = {(props) =>  <About {...props} />}
                        />
                    </Switch>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </main>

                <Footer />
            </React.Fragment>
        )
    }
    
}


ReactDOM.render(<HashRouter><App /></HashRouter>, document.getElementById("ReactApp"))