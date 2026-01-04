/**
 * Saudi Address Pro - Official JS Wrapper
 * 
 * This package provides a simple way to load the Saudi Address Pro widget
 * in modern JavaScript environments (React, Vue, Angular, etc).
 */

const WIDGET_URL = 'https://saudiaddresspro.com/widget.js';

export const loadSaudiAddressWidget = () => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('saudi-address-script')) {
      resolve(window.SaudiAddress);
      return;
    }

    const script = document.createElement('script');
    script.id = 'saudi-address-script';
    script.src = WIDGET_URL;
    script.async = true;
    
    script.onload = () => {
      if (window.SaudiAddress) {
        resolve(window.SaudiAddress);
      } else {
        reject(new Error('SaudiAddress widget loaded but global object not found'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load Saudi Address Pro widget'));
    };

    document.body.appendChild(script);
  });
};

export default {
  load: loadSaudiAddressWidget
};
