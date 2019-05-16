import React from "react";
import styles from "./../styles/forms.module.css";
import PropTypes from "prop-types";

class GameJoinForm extends React.Component {

    constructor(props) {
        super(props);
        this.name = new React.createRef();
        this.accessCode = new React.createRef();
    }

    cancel = () => {
        this.props.cancel();
    };

    execute = () => {
        this.props.execute(this.name.current.value, this.accessCode.current.value.trim());
    };

    render() {
        return (
            <div className={styles.form}>

                <h2>Join Game</h2>

                <input type={'text'} placeholder={'Enter your name'} className={styles.input} ref={this.name} />

                <input type={'text'} placeholder={'Enter your access code'} className={styles.input} ref={this.accessCode} />

                <div className={styles.buttonGroup}>

                    <button onClick={this.execute} className={styles.button}>Join</button>

                    <button onClick={this.cancel} className={styles.button}>Back</button>

                </div>

            </div>
        );
    }
}

GameJoinForm.propTypes = {
    cancel: PropTypes.func.isRequired,
    execute: PropTypes.func.isRequired
};

export default GameJoinForm;