import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_TITLE = "DAAN Sports — #1 B2B Wholesale Apparel & Custom OEM Sportswear Manufacturer";
const DEFAULT_DESCRIPTION = "Direct factory manufacturer of premium wholesale tracksuits, heavyweight 350 GSM hoodies, gym activewear, athletic jerseys, and outerwear. Low MOQ 50 pcs, custom OEM private labeling, and fast worldwide express shipping.";
const DEFAULT_KEYWORDS = "wholesale sportswear, bulk tracksuits, custom athletic apparel, OEM clothing manufacturer, heavyweight fleece hoodies, gym activewear supplier, private label sports apparel, B2B sportswear export";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop";
const SITE_URL = typeof window !== 'undefined' ? window.location.origin : "http://localhost:3001";

export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = "website",
  product,
  breadcrumbs,
  faqItems,
}) {
  const location = useLocation();

  const finalTitle = title 
    ? (title.includes("DAAN Sports") ? title : `${title} | DAAN Sports B2B Wholesale`)
    : DEFAULT_TITLE;
  const finalDescription = description || DEFAULT_DESCRIPTION;
  const finalKeywords = keywords || DEFAULT_KEYWORDS;
  const finalImage = ogImage || DEFAULT_IMAGE;
  const currentUrl = canonical || `${SITE_URL}${location.pathname}${location.search}`;

  useEffect(() => {
    // 1. Set document title
    document.title = finalTitle;

    // Helper to create or update meta tag
    const setMeta = (attr, key, content) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to create or update link tag
    const setLink = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Standard SEO Tags
    setMeta('name', 'description', finalDescription);
    setMeta('name', 'keywords', finalKeywords);
    setMeta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMeta('name', 'author', 'DAAN Sports OEM Manufacturing');
    setMeta('name', 'publisher', 'DAAN Sports B2B Global');
    setLink('canonical', currentUrl);

    // OpenGraph Tags
    setMeta('property', 'og:title', finalTitle);
    setMeta('property', 'og:description', finalDescription);
    setMeta('property', 'og:url', currentUrl);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:site_name', 'DAAN Sports');
    setMeta('property', 'og:image', finalImage);
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '675');
    setMeta('property', 'og:image:alt', finalTitle);
    setMeta('property', 'og:locale', 'en_US');

    // Twitter Card Tags
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:site', '@DAANSports');
    setMeta('name', 'twitter:title', finalTitle);
    setMeta('name', 'twitter:description', finalDescription);
    setMeta('name', 'twitter:image', finalImage);

    // Structured Data: Dynamic Schema Injection
    const schemaScriptId = 'daan-dynamic-schema';
    let schemaScript = document.getElementById(schemaScriptId);
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = schemaScriptId;
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const schemas = [];

    // 1. Organization & Wholesale Store Schema
    schemas.push({
      "@context": "https://schema.org",
      "@type": "SportsActivityLocation",
      "name": "DAAN Sports",
      "alternateName": "DAAN Sports B2B Wholesale & OEM Manufacturing",
      "url": SITE_URL,
      "logo": `${SITE_URL}/logo192.png`,
      "image": DEFAULT_IMAGE,
      "description": DEFAULT_DESCRIPTION,
      "telephone": "+1-800-377-7678",
      "email": "export@daansports.com",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "Global Direct Export",
        "addressLocality": "Manufacturing Hub"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${SITE_URL}/category/all?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    });

    // 2. Product Schema (if on a product page)
    if (product) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": [
          product.image,
          ...(product.images || [])
        ].filter(Boolean),
        "description": product.description || finalDescription,
        "sku": `DS-${product.id || 'WHOLESALE'}`,
        "brand": {
          "@type": "Brand",
          "name": "DAAN Sports"
        },
        "material": product.material || "Combed Cotton / Technical Polyester",
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "USD",
          "lowPrice": Number(product.new_price || 15).toFixed(2),
          "highPrice": Number(product.old_price || (product.new_price * 1.3) || 45).toFixed(2),
          "offerCount": product.stock || 5000,
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition",
          "price": Number(product.new_price || 20).toFixed(2),
          "seller": {
            "@type": "Organization",
            "name": "DAAN Sports Direct Factory"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "86",
          "bestRating": "5",
          "worstRating": "1"
        }
      });
    }

    // 3. Breadcrumb Schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((b, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": b.name,
          "item": b.url.startsWith("http") ? b.url : `${SITE_URL}${b.url}`
        }))
      });
    }

    // 4. FAQ Schema
    if (faqItems && faqItems.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a
          }
        }))
      });
    }

    schemaScript.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : {
      "@context": "https://schema.org",
      "@graph": schemas
    });

  }, [finalTitle, finalDescription, finalKeywords, finalImage, currentUrl, ogType, product, breadcrumbs, faqItems]);

  return null;
}
