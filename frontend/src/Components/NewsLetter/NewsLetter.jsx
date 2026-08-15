import React from 'react'
import './NewsLetter.css'

const NewsLetter = () => {
  return (
    <div className='newsletter-b2b'>
      <h2>Get Weekly Wholesale Price Sheets & New Samples</h2>
      <p>Subscribe to receive DAAN Sports bulk catalog updates, fabric swatches, and factory pricing lists directly in your inbox.</p>
      <div className="newsletter-form">
        <input type="email" placeholder="Enter your business email address" />
        <button onClick={() => alert("Thank you for subscribing to DAAN Sports B2B Catalog updates!")}>
          Subscribe to Catalog
        </button>
      </div>
    </div>
  )
}

export default NewsLetter
