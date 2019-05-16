import React, { Component } from "react";

import styles from "./../styles/home.module.css";
import forms from "./../styles/forms.module.css";
import GameJoinForm from "../components/GameJoinForm";
import GameCreateForm from "../components/GameCreateForm";
import Game from "./game";

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            config: {
                gameLength: null,
                id: null
            },
            type: null,
            activeView: 0,
        }
    }

    back = () => {
        this.setState({
            activeView: 0
        });
    };

    join = (name, id) => {
        this.setState({
            name: name,
            type: 'join',
            config: {
                id: id
            },
            activeView: 3
        });
    };

    create = (name, length) => {
        this.setState({
            name: name,
            type: 'create',
            config: {
                gameLength: length
            },
            activeView: 3
        });
    };

    render() {
        let view;
        switch (this.state.activeView) {
            default:
            case 0: {
                view =
                    <div className={forms.buttonGroup}>
                        <button className={forms.button} onClick={() => this.setState({activeView: 1})}>Join Game</button>
                        <button className={forms.button} onClick={() => this.setState({activeView: 2})}>Create Game</button>
                    </div>;
                break;
            }
            case 1: {
                view = <GameJoinForm execute={this.join} cancel={this.back} />;
                break;
            }
            case 2: {
                view = <GameCreateForm execute={this.create} cancel={this.back} />;
                break;
            }
            case 3: {
                view = <Game type={this.state.type} name={this.state.name} config={this.state.config} />;
            }
        }
        return (
            <div className={styles.join}>
                <h1>Spyfall</h1>
                {view}
            </div>
        )
    }

}

export default Home;