module.exports = {
  item: process.env.ITEM_API_KEY,
  atomic: process.env.ATOMIC_API_KEY,
  channel: process.env.CHANNEL_API_KEY,
  order: process.env.ORDER_API_KEY,
  inventory: process.env.INVENTORY_API_KEY,
  pim: process.env.PIM_API_KEY,
  identity: process.env.IDENTITY_API_KEY,
  cms: process.env.CMS_API_KEY,
  cart: process.env.CART_API_KEY,
  components: process.env.COMPONENTS_API_KEY,
  offer: process.env.OFFER_API_KEY,
  mfinventory: process.env.MFINVENTORY_API_KEY
}
console.log('[lib-domain] api keys:', module.exports)
