import React, { useState } from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  const [activeTab, setActiveTab] = useState('specs');

  return (
    <div className='descriptionbox-b2b'>
      <div className="descriptionbox-navigator">
        <div
          className={`descriptionbox-nav-box ${activeTab === 'specs' ? 'active' : ''}`}
          onClick={() => setActiveTab('specs')}
        >
          Fabric & Technical Specs
        </div>
        <div
          className={`descriptionbox-nav-box ${activeTab === 'oem' ? 'active' : ''}`}
          onClick={() => setActiveTab('oem')}
        >
          OEM Customization & Branding
        </div>
        <div
          className={`descriptionbox-nav-box ${activeTab === 'shipping' ? 'active' : ''}`}
          onClick={() => setActiveTab('shipping')}
        >
          Shipping & Lead Times
        </div>
      </div>

      <div className="descriptionbox-content">
        {activeTab === 'specs' && (
          <div className="tab-pane">
            <h3>Manufacturing & Textile Specifications</h3>
            <ul className="specs-list">
              <li><strong>Material Mix:</strong> 80% Cotton Fleece / 20% Polyester (300 - 350 GSM Heavyweight)</li>
              <li><strong>Stitching:</strong> Double-needle reinforced flatlock seams for high strain durability</li>
              <li><strong>Finish & Treatment:</strong> Anti-pilling, pre-shrunk, moisture-wicking quick-dry treatment</li>
              <li><strong>Zippers & Hardware:</strong> YKK heavy-duty metal or customized branded rubber pulls</li>
              <li><strong>Packaging:</strong> Individual polybags, custom cardboard outer master cartons (50 pcs / box)</li>
            </ul>
          </div>
        )}

        {activeTab === 'oem' && (
          <div className="tab-pane">
            <h3>Private Label & Custom Branding Capabilities</h3>
            <p>
              DAAN Sports offers end-to-end original equipment manufacturing (OEM). We work directly from your vector tech-packs or physical prototypes to produce branded collections.
            </p>
            <div className="branding-grid">
              <div className="brand-capability">
                <strong>Woven Neck Labels:</strong> Custom high-density woven damask or satin care tags.
              </div>
              <div className="brand-capability">
                <strong>Logo Printing:</strong> Screen printing, puff print, high-build silicone, 3D embroidery, and DTF heat transfer.
              </div>
              <div className="brand-capability">
                <strong>Custom Packaging:</strong> Branded frosted ziplock polybags and customized hangtags.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="tab-pane">
            <h3>Global Logistics & Delivery Schedules</h3>
            <p>
              We ship worldwide via DHL Express, FedEx Freight, and Sea Cargo (FOB / DDP terms available).
            </p>
            <ul className="specs-list">
              <li><strong>Sample Production:</strong> 5 - 7 business days</li>
              <li><strong>Bulk Production (50 - 500 pcs):</strong> 12 - 18 business days after sample approval</li>
              <li><strong>Express Air Freight:</strong> 4 - 6 days door-to-door</li>
              <li><strong>Sea Cargo (FCL / LCL):</strong> 20 - 30 days worldwide</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default DescriptionBox
