import React, { useState } from 'react'
import Base from '../core/Base'
import {Link} from 'react-router-dom'
import {signup} from '../auth/helper'



const Signup = () => { 

    const [values, setvalues] = useState({
        name: "",
        email: "",
        password: "",
        error: "",
        success: false
    });
    
    const {name,email,password,error,success} = values 

    const handleChange = name => event => {
        setvalues({...values, error:false, [name]: event.target.value })
    }

    const onSubmit = event => {
        event.preventDefault()

        setvalues({...values,error:false})
        signup({name, email, password})
        .then(data => {
            if(data.error){
                setvalues({...values, error: data.error, success:false})
            }else{
                setvalues({...values,name:"",email:"",password:"",error:"",success:true} )
            }
        })
        .catch(console.log("Error in signup"))
        
    }

    const signUpForm = () => (
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <form>
                        <div className="form-group">
                            <label className="text-light">Name</label>
                            <input type="text" className="form-control" onChange={handleChange("name")} value={name}/>
                        </div>
                        <div className="form-group">
                            <label className="text-light">Email</label>
                            <input type="email" className="form-control"  onChange={handleChange("email")} value={email}/>
                        </div>
                        <div className="form-group">
                            <label className="text-light" >Password</label>
                            <input type="password" className="form-control"  onChange={handleChange("password")} value={password}/>
                        </div>
                        <div className="form-group pt-3">
                            <button className="btn btn-success btn-block" onClick={onSubmit}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    
    const successMessage = () => {
        return(
        <div className="row">
            <div className="col-md-6 offset-sm-3 text-left">
            
                <div className="alert alert-success" style={{display: success ? "" : "none"}}>
                    New account was created successfully. Please <Link to='/signin'>Login Here</Link> 
                </div>
            </div>
        </div>    
        )
    }
    const errorMessage = () => {
        return(
        <div className="row">
            <div className="col-md-6 offset-sm-3 text-left">
                <div className="alert alert-danger" style={{display: error ? "" : "none"}}>
                    {error}
                </div>
            </div>
        </div>
        )
    }

    return(
        <Base title="Sign Up Page" description="A page for user to sign up!">
            {successMessage()}
            {errorMessage()}
            {signUpForm()}
            <p className="text-center text-white">{JSON.stringify(values)}</p>
        </Base>
    );
};

export default Signup;