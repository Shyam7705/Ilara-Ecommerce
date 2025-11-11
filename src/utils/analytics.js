/**
 * Google Analytics Utility
 * Provides functions for tracking events, page views, and e-commerce activities
 */

// GA Measurement ID
export const GA_TRACKING_ID = "G-WZ1YLJ93GG";

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: window.location.pathname,
    });
  }
};

// Track page views
export const pageview = (url) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track events
export const event = ({ action, category, label, value }) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track product views
export const trackProductView = (product) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "view_item", {
      currency: "INR",
      value: parseFloat(product.price) || 0,
      items: [
        {
          item_id: product._id || product.productName,
          item_name: product.productName,
          price: parseFloat(product.price) || 0,
          item_category: product.category || "General",
          item_brand: product.brand || "Ilara",
          quantity: 1,
        },
      ],
    });

    // Also track as custom event
    event({
      action: "view_product",
      category: "Ecommerce",
      label: product.productName,
      value: parseFloat(product.price) || 0,
    });
  }
};

// Track add to cart
export const trackAddToCart = (product) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "add_to_cart", {
      currency: "INR",
      value: parseFloat(product.price) * (product.quantity || 1) || 0,
      items: [
        {
          item_id: product._id || product.name,
          item_name: product.name || product.productName,
          price: parseFloat(product.price) || 0,
          item_category: product.category || "General",
          item_brand: product.brand || "Ilara",
          quantity: product.quantity || 1,
        },
      ],
    });

    // Also track as custom event
    event({
      action: "add_to_cart",
      category: "Ecommerce",
      label: product.name || product.productName,
      value: parseFloat(product.price) * (product.quantity || 1) || 0,
    });
  }
};

// Track remove from cart
export const trackRemoveFromCart = (product) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "remove_from_cart", {
      currency: "INR",
      value: parseFloat(product.price) * (product.quantity || 1) || 0,
      items: [
        {
          item_id: product._id || product.name,
          item_name: product.name || product.productName,
          price: parseFloat(product.price) || 0,
          item_category: product.category || "General",
          item_brand: product.brand || "Ilara",
          quantity: product.quantity || 1,
        },
      ],
    });

    event({
      action: "remove_from_cart",
      category: "Ecommerce",
      label: product.name || product.productName,
    });
  }
};

// Track begin checkout
export const trackBeginCheckout = (items, totalValue) => {
  if (typeof window !== "undefined" && window.gtag) {
    const gaItems = items.map((item) => ({
      item_id: item._id || item.name,
      item_name: item.name || item.productName,
      price: parseFloat(item.price) || 0,
      item_category: item.category || "General",
      item_brand: item.brand || "Ilara",
      quantity: item.quantity || 1,
    }));

    window.gtag("event", "begin_checkout", {
      currency: "INR",
      value: totalValue || 0,
      items: gaItems,
    });

    event({
      action: "begin_checkout",
      category: "Ecommerce",
      label: "Checkout Started",
      value: totalValue || 0,
    });
  }
};

// Track purchase
export const trackPurchase = (transactionId, items, totalValue, shipping, tax) => {
  if (typeof window !== "undefined" && window.gtag) {
    const gaItems = items.map((item) => ({
      item_id: item._id || item.name,
      item_name: item.name || item.productName,
      price: parseFloat(item.price) || 0,
      item_category: item.category || "General",
      item_brand: item.brand || "Ilara",
      quantity: item.quantity || 1,
    }));

    window.gtag("event", "purchase", {
      transaction_id: transactionId,
      value: totalValue || 0,
      currency: "INR",
      shipping: shipping || 0,
      tax: tax || 0,
      items: gaItems,
    });

    event({
      action: "purchase",
      category: "Ecommerce",
      label: `Transaction: ${transactionId}`,
      value: totalValue || 0,
    });
  }
};

// Track search
export const trackSearch = (searchTerm) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "search", {
      search_term: searchTerm,
    });

    event({
      action: "search",
      category: "Site Search",
      label: searchTerm,
    });
  }
};

// Track button clicks
export const trackButtonClick = (buttonName, location) => {
  event({
    action: "click",
    category: "Button",
    label: `${buttonName} - ${location}`,
  });
};

// Track chatbot interactions
export const trackChatbotInteraction = (action, message = "") => {
  event({
    action: action,
    category: "Chatbot",
    label: message.substring(0, 100), // Limit label length
  });
};

// Track newsletter signup
export const trackNewsletterSignup = (email) => {
  event({
    action: "newsletter_signup",
    category: "Engagement",
    label: "Newsletter Subscription",
  });
};

// Track social media clicks
export const trackSocialClick = (platform) => {
  event({
    action: "click",
    category: "Social Media",
    label: platform,
  });
};

// Track form submissions
export const trackFormSubmission = (formName) => {
  event({
    action: "form_submit",
    category: "Form",
    label: formName,
  });
};

// Track user registration
export const trackUserRegistration = (method = "email") => {
  event({
    action: "sign_up",
    category: "User",
    label: method,
  });
};

// Track user login
export const trackUserLogin = (method = "email") => {
  event({
    action: "login",
    category: "User",
    label: method,
  });
};

// Track product share
export const trackProductShare = (product, method) => {
  event({
    action: "share",
    category: "Product",
    label: `${product.productName} - ${method}`,
  });
};

// Track banner clicks
export const trackBannerClick = (bannerName, bannerPosition) => {
  event({
    action: "click",
    category: "Banner",
    label: `${bannerName} - ${bannerPosition}`,
  });
};

// Track category view
export const trackCategoryView = (categoryName) => {
  event({
    action: "view_category",
    category: "Ecommerce",
    label: categoryName,
  });
};

