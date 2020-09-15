import React, { useEffect } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
} from "@material-ui/core";
import "./navbar.scss";
import { Link } from "react-router-dom";

import { logOut } from '../../redux/actions/actions'

import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

const NavBar = () => {
    const dispatch = useDispatch()
    const isLoggedIn = useSelector(state => state.isLoggedIn)
    const history = useHistory()

    const handleLogout = () => {
        dispatch(logOut(history))
    }
    //checks if the user is logged in

    return (
        <div className='app-bar-container'>
            <AppBar position="static" id="app-bar" color="secondary">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" id="icon">
                        <Link className="nav-link" to="/">
                            Family Promise
                     </Link>
                    </IconButton>
                    {
                        isLoggedIn
                            ?
                            <div id="nav-links">
                                <Button color="inherit">
                                    <Link className="nav-link" to="/">
                                        View Profile
                                </Link>
                                </Button>
                                <Button color="inherit" position="end" onClick={handleLogout}>
                                    Logout
                            </Button>
                            </div>

                            :
                            <div id="nav-links">
                                <Button color="inherit" position="end" onClick={() => history.push('/login')}>
                                    Login
                            </Button>
                                <Button color="inherit" onClick={() => history.push('/register')}>
                                    Register
                            </Button>
                            </div>
                    }

                </Toolbar>
            </AppBar>
        </div>
      
    );
};

export default NavBar;