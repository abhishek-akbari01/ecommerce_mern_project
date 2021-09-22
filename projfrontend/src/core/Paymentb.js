import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import { cartEmpty, loadCart } from './helper/cartHelper';
import { getmeToken, processPayment } from './helper/paymentHelper';
import {createOrder} from './helper/orderHelper'
import { isAuthenticated } from '../auth/helper';
import DropIn from 'braintree-web-drop-in-react'


const Paymentb = ({products, setReload = f => f, reload=undefined }) =>  {

    const [info, setInfo] = useState({
        laoding: false,
        success: false,
        clientToken: null,
        error: ""
    })

    const userId = isAuthenticated() && isAuthenticated().user._id
    const token = isAuthenticated() && isAuthenticated().token

    const getToken = (userId, token) => {
        getmeToken(userId, token).then(info => {
            console.log("Information", info);
            
            if(info.error)
            {
                setInfo({ ...info, error: info.error})
            }else{
                const clientToken = info.clientToken
                setInfo({clientToken})
            }
        })    
    }

    useEffect(() => {
        getToken(userId, token)
    }, [])

    return (
        <div>
            <h3>Payment test</h3>     
        </div>
    )
}
export default Paymentb;