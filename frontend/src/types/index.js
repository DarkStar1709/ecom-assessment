// Type definitions converted to JSDoc comments for JavaScript

/**
 * @typedef {Object} Product
 * @property {string} _id
 * @property {string} name
 * @property {number} price
 * @property {string} description
 * @property {string} image
 * @property {string} category
 * @property {boolean} inStock
 * @property {number} rating
 * @property {string} [createdAt]
 * @property {string} [updatedAt]
 */

/**
 * @typedef {Object} CartItem
 * @property {string} _id
 * @property {Product} productId
 * @property {number} quantity
 * @property {number} price
 */

/**
 * @typedef {Object} Cart
 * @property {string} _id
 * @property {string} userId
 * @property {CartItem[]} items
 * @property {number} total
 */

/**
 * @typedef {Object} CheckoutFormData
 * @property {string} customerName
 * @property {string} customerEmail
 */

/**
 * @typedef {Object} Order
 * @property {string} _id
 * @property {string} customerName
 * @property {string} customerEmail
 * @property {Array<{productId: string, name: string, price: number, quantity: number}>} items
 * @property {number} total
 * @property {'pending'|'confirmed'|'cancelled'} status
 * @property {string} orderNumber
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Receipt
 * @property {string} orderNumber
 * @property {string} customerName
 * @property {string} customerEmail
 * @property {Array<{productId: string, name: string, price: number, quantity: number}>} items
 * @property {number} subtotal
 * @property {number} tax
 * @property {number} total
 * @property {string} timestamp
 * @property {string} status
 * @property {string} estimatedDelivery
 */

/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {T} [data]
 * @property {string} [message]
 * @property {string} [error]
 * @property {number} [count]
 * @property {number} [itemCount]
 */

// Export empty object since this is just type definitions
export {};