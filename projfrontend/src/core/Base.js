import React from 'react'
import Menu from './Menu'


const Base = ({
    title = "My title",
    description = "My description",
    className = "text-white p-4",
    children
}) => {

    
    
    return (
        <div>
            <Menu/>
            
            <div className="container-fluid">
                <div className="jumbotron  text-white text-center mb-5 pb-5">
                    <h2 className="display-4">{title}</h2>
                    <p className="lead">{description}</p>
                </div>
                <div className={className}>{children}</div>
            </div>
            <footer className="footer mt-auto py-3">
                <div className="container-fluid bg-success text-white text-center py-3">
                    <h4>If you have any question, feel free to reach out!</h4>
                    <button className="btn btn-warning btn-lg">Contact Us</button>
                </div>
                <div className="container">
                    <span className="text-muted">
                        An amazing <span className="text-white">Tshirt</span> Store!
                    </span>
                </div>
            </footer>
        </div>
    )
}

export default Base;
