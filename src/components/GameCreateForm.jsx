import React from "react";
import PropTypes from 'prop-types';
import styles from "./../styles/forms.module.css";

class GameCreateForm extends React.Component {
    constructor(props) {
        super(props);
        this.name = React.createRef();
        this.round = React.createRef();
    }

    cancel = () => {
        this.props.cancel();
    };

    execute = () => {
        this.props.execute(this.name.current.value, this.round.current.value);
    };

    render() {
        return (
            <div className={styles.form}>
                <h2>Create a new game</h2>

                <input type={'text'} placeholder={'Enter your name'} className={styles.input} ref={this.name} />

                <input type={'text'} placeholder={'Round length (minutes)'} className={styles.input} ref={this.round} />

                <div className={styles.buttonGroup}>

                    <button onClick={this.execute} className={styles.button}>Create</button>

                    <button onClick={this.cancel} className={styles.button}>Back</button>

                </div>

            </div>
        );
    }
}

GameCreateForm.propTypes = {
    cancel: PropTypes.func.isRequired,
    execute: PropTypes.func.isRequired
};

export default GameCreateForm;