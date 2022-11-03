import React, { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { addToDb, deleteShoppingCart, getStoredCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';

const Shop = () => {

    // const { products, count } = useLoaderData();
    const [products , setProduct] = useState([]);
    const [count , setCount] = useState(0);
    const [cart, setCart] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    useEffect(()=>{
        const url = `http://localhost:5000/products?page=${page}&size=${size}`;
        fetch(url)
        .then(res=>res.json())
        .then(data=>{
            setCount(data.count);
            setProduct(data.products);
        });
    } ,[page , size])


    const pages = Math.ceil(count / size);

    const clearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }

    useEffect(() => {
        const storedCart = getStoredCart();
        const savedCart = [];
        const ids = Object.keys;
        fetch('http://localhost:3000/productsByIds',{
            method: 'POST',
            headers: {
                'content-type' : 'application/json'
            },
            body: JSON.stringify(ids)
        })
        .then(res=>res.json())
        .then(data => {

        })
        // for (const id in storedCart) {
        //     const addedProduct = products.find(product => product._id === id);
        //     if (addedProduct) {
        //         const quantity = storedCart[id];
        //         addedProduct.quantity = quantity;
        //         savedCart.push(addedProduct);
        //     }
        // }
        // setCart(savedCart);
    }, [products])

    const handleAddToCart = (selectedProduct) => {
        console.log(selectedProduct);
        let newCart = [];
        const exists = cart.find(product => product._id === selectedProduct._id);
        if (!exists) {
            selectedProduct.quantity = 1;
            newCart = [...cart, selectedProduct];
        }
        else {
            const rest = cart.filter(product => product._id !== selectedProduct._id);
            exists.quantity = exists.quantity + 1;
            newCart = [...rest, exists];
        }

        setCart(newCart);
        addToDb(selectedProduct._id);
    }

    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart clearCart={clearCart} cart={cart}>
                    <Link to='/orders'>
                        <button>Review Order</button>
                    </Link>
                </Cart>
            </div>
            <div className="pagination">
                <p>Currently selected Page: {page} and {size}</p>
                {
                    [...Array(pages).keys()].map(number => <button 
                    key={number} 
                    className={page === number && 'selected'}
                    onClick={()=>setPage(number)}
                    >{number+1}</button>)
                }
                <select onChange={event => setSize(event.target.value)} name="" id="">
                    <option value="5">5</option>
                    <option value="10" selected>10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                </select>
            </div>
        </div>
    );
};

export default Shop;