import React, { Component } from 'react';

class addAula extends Component {
    
    state = {
        
        x_nombre: null,
        x_capacidad: null
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.state);
        this.props.addAula(this.state);
    }
    render(){
        return(
            // <div className="aula" key={id}>
            <div className="aula">
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="x_name">Nombre Aula:</label>
                    <input type="text" id="x_name" onChange={this.handleChange} />
                    <label htmlFor="x_capacidad">Capacidad:</label>
                    <input type="text" id="x_capacidad" onChange={this.handleChange} />
                </form>
            </div>
        )
    }
}
export default addAula;