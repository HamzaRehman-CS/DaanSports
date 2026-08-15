import React from 'react'
import './Offers.css'
import { Link } from 'react-router-dom'

const Offers = () => {
  return (
    <div className='offers-b2b'>
      <div className="offers-content">
        <span className="offers-badge">FREE SAMPLE FOR LARGE ORDERS</span>
        <h2>Need Custom Logo & Private Label Branding?</h2>
        <p>
          We offer complete OEM & ODM manufacturing. Add your custom woven neck labels, screen printed logos, embroidery, and custom tech-pack packaging.
        </p>

        <div className="offers-tiers">
          <div className="tier-box">
            <span className="tier-qty">50 - 100 Pcs</span>
            <span className="tier-disc">Standard Wholesale</span>
          </div>
          <div className="tier-box highlight">
            <span className="tier-qty">100 - 500 Pcs</span>
            <span className="tier-disc">15% Volume Discount</span>
          </div>
          <div className="tier-box">
            <span className="tier-qty">500+ Pcs</span>
            <span className="tier-disc">Custom Contract Rate</span>
          </div>
        </div>

        <Link to="/tracksuits">
          <button className="offers-cta-btn">
            Request Factory Quotation ➔
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Offers
