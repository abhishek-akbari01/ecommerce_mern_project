import React,{useState} from 'react'
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/helper';
import Base from '../core/Base';
import { createCategory } from './helper/adminapicall';




const AddCategory = () => {

    const [name, setName] = useState("")
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    const {user,token} = isAuthenticated()

    const goBack = () => {
        return(
            <div className="mt-5">
                <Link className="btn btn-sm btn-success mb-3 " to="/admin/dashboard">Admin Home</Link>
            </div>
        )
    }

    const handleChange = event => {
        setError("")
        setName(event.target.value)
    }

    const onSubmit = (event) => {
        event.preventDefault()
        setError("")
        setSuccess(false)

        createCategory(user._id, token, {name} )
        .then(data => {
            if(data.error){
                setError(true)
            }else{
                setError("")
                setSuccess(true)
                setName("")
            }
        })
    }

    const successMessage = () => {
        if(success){
            return <h4 className="text-success">Category created successfully</h4>
        }
    }

    const errorMessage = () => {
        if(error){
            return <h4 className="text-success">Failed to created category</h4>
        }
    }

    const myCategoryForm = () => {
        return(
            <form action="" className="mb">
                <div className="form-group " >
                    <p className="lead">Enter the category</p>
                    <input type="text" onChange={handleChange} value={name} className="form-control my-3" autoFocus required placeholder="For eg. Summer"/>
                    <button onClick={onSubmit} className="btn btn-outline-info ">Create Category</button>
                </div>
            </form>
        )
    }


    return (
        <Base title="Create a Category" description="Add a new category for new tshirts" className="container bg-success p-4">
            <div className="row bg-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {errorMessage()}
                    {myCategoryForm()}
                    {goBack()}
                </div>
            </div>
        </Base>
    )
}

export default AddCategory;
