import React from "react";
import axios from "axios";

class Kayit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        alert('Gönderilen değer: ' + this.state.value);
        let val = this.state.value
        this.setState({value: ''});
        event.preventDefault();
        axios.post("http://localhost:8080/haber_gonder", val).then(res => {
            alert("Başarıyla kaydedildi.")
        }, err => {
            alert("Server rejected response with: " + err);
        })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h2>
                    Haber
                </h2>
                <textarea rows="8" value={this.state.value} onChange={this.handleChange}/>
                <div>
                    <input type="submit" value="Gönder"/>
                </div>
            </form>
        );
    }
}

export default Kayit