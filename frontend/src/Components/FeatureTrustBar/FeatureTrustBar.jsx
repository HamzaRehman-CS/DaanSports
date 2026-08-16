import React from 'react';
import { Truck, Award, RotateCcw, Headphones } from 'lucide-react';
import './FeatureTrustBar.css';

const trustFeatures = [
  {
    icon: Truck,
    title: "FREE SHIPPING",
    subtitle: "On orders over $99"
  },
  {
    icon: Award,
    title: "PREMIUM QUALITY",
    subtitle: "100% quality guaranteed"
  },
  {
    icon: RotateCcw,
    title: "EASY RETURNS",
    subtitle: "30 days return policy"
  },
  {
    icon: Headphones,
    title: "CUSTOMER SUPPORT",
    subtitle: "24/7 dedicated support"
  }
];

export default function FeatureTrustBar() {
  return (
    <section className="trust-bar-section">
      <div className="trust-bar-container">
        <div className="trust-bar-grid">
          {trustFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="trust-bar-item">
                <div className="trust-bar-icon-wrap">
                  <Icon size={24} className="trust-bar-icon" />
                </div>
                <div className="trust-bar-text">
                  <h4 className="trust-bar-title">{feat.title}</h4>
                  <p className="trust-bar-subtitle">{feat.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
