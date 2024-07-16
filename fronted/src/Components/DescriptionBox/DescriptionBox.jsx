import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Review(120)</div>
        </div>
        <div className="discriptionbox-description">
            <p>An e-commerce website is an online platform where you can buy and sell products or services over the internet. It works like an online store where customers can browse through various items, read descriptions, see pictures, and add what they want to a virtual shopping cart. Once they've chosen everything they want to buy, they go to the checkout, where they can pay for their items using different payment methods. The website then arranges for the items to be delivered to the customer’s address. Additionally, e-commerce websites often have features like customer reviews, wish lists, and customer service to help with any questions or issues.</p>
        </div>
    </div>
  )
}

export default DescriptionBox