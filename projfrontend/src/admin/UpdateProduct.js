import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth/helper'
import Base from '../core/Base'
import { getProduct, getCategories, updateProduct } from './helper/adminapicall'




const UpdateProduct = ({match}) => {

    const {user, token} = isAuthenticated()

    const [values, setValues] = useState({
        name:"",
        description:"",
        price:"",
        stock:"",
        photo: "",
        categories: [],
        category: "",
        loading: false,
        error:"",
        createdProduct: "",
        getRedirect: false,
        formData: ""
    })

    const {name,description,price,stock,photo,categories,category,loading,error,createdProduct,getRedirect,formData} = values

    const preload = (productId) => {
        getProduct(productId).then(data => {
            if(data.error){
                setValues({...values,error: data.error})
            }else{
                setValues({...values, 
                    name: data.name, 
                    description: data.description,
                    price: data.price,
                    category: data.category.name,
                    stock: data.stock,
                    formData: new FormData(),
                })
                preloadCategories()
                console.log(categories)
            }
        })
    }

    const preloadCategories = () => {
        getCategories().then(data => {
            if(data.error)
            {
                setValues({...values,error: data.error})
            }else{
                setValues({
                    categories: data,
                    formData: new FormData()
                })
            }
        })
    }

    useEffect(() => {
        preload(match.params.productId);
    }, [])

    const onSubmit = (event) => {
        event.preventDefault()
        setValues({...values, error:"", loading:true})
        
        updateProduct(match.params.productId, user._id, token, formData)
        .then(data => {
            if(data.error){
                setValues({...values, error: data.error})
            }else{
                setValues({...values, name:"", description:"", price:"", photo:"",stock:"",loading:false,createdProduct: data.name})
            }
        })
    }

    const successMessage = () => {
        return(
            <div className="alert alert-success mt-3" style={{display: createdProduct ? "" : "none" }}>
                <h4>{createdProduct} updated successfully</h4>
            </div>
        )
    }

    const errorMessage = () => {
        return(
            <div className="alert alert-success mt-3" style={{display: error ? "" : "none" }}>
                <h4>{error}</h4>
            </div>
        )
    }

    const handleChange = name => event => {
        const value = name === "photo" ? event.target.files[0] : event.target.value
        
        formData.set(name, value)
        setValues({...values, [name]: value })
    }

    const createProductForm = () => (
        <form >
          <span className="m-2">Post photo</span>
          <div className="form-group m-2">
            <label className="btn btn-block btn-success">
              <input
                onChange={handleChange("photo")}
                type="file"
                name="photo"
                accept="image"
                placeholder="choose a file"
              />
            </label>
          </div>
          <div className="form-group m-2">
            <input
              onChange={handleChange("name")}
              name="photo"
              className="form-control"
              placeholder="Name"
              value={name}
            />
          </div>
          <div className="form-group m-2">
            <textarea
              onChange={handleChange("description")}
              name="photo"
              className="form-control"
              placeholder="Description"
              value={description}
            />
          </div>
          <div className="form-group m-2">
            <input
              onChange={handleChange("price")}
              type="number"
              className="form-control"
              placeholder="Price"
              value={price}
            />
          </div>
          <div className="form-group m-2">
            <select
              onChange={handleChange("category")}
              className="form-control"
              placeholder="Category"
            >
              <option>{category}</option>
              {categories && categories.map((cat,index) => (
                    <option key={index} value={cat._id}>{cat.name}</option>
              ))}
              
            </select>
          </div>
          <div className="form-group m-2">
            <input
              onChange={handleChange("stock")}
              type="number"
              className="form-control"
              placeholder="Quantity"
              value={stock}
            />
          </div>
          
          <button type="submit" onClick={onSubmit} className="btn btn-outline-success m-2">
            Update Product
          </button>

        </form>
      );

    return (
        <Base title="Add Products" description="Welcome to create product here!!" className="container bg-success p-4">
            <Link className="btn btn-md btn-dark mb-3" to="/admin/dashboard">Admin Home</Link>
            <div className="row bg-dark text-white rounded">
                <div className="col-md-8 offset-md-2">
                {successMessage()}
                {errorMessage()}
                {createProductForm()}
                </div>
            </div>
        </Base>
    )
}

export default UpdateProduct