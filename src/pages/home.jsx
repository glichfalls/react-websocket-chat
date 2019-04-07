import React, { Component } from "react";

import styles from "./../styles/home.module.css";
import {NavLink} from "react-router-dom";

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: ''
        }
    }

    render() {
        return (
            <div>

                <div className={styles.join}>

                    <input type="text" onChange={e => this.setState({username: e.target.value})} value={this.state.username} />

                    <NavLink to={`/chat/${this.state.username}`}>Join</NavLink>

                </div>

            </div>
        );
    }

}

export default Home;