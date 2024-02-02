module.exports = {
  item: process.env.ITEM_API_ID,
  atomic: process.env.ATOMIC_API_ID,
  channel: process.env.CHANNEL_API_ID,
  order: process.env.ORDER_API_ID,
  inventory: process.env.INVENTORY_API_ID,
  pim: process.env.PIM_API_ID,
  identity: process.env.IDENTITY_API_ID,
  cms: process.env.CMS_API_ID,
  cart: process.env.CART_API_ID,
  components: process.env.COMPONENTS_API_ID,
  offer: process.env.OFFER_API_ID,
  web: process.env.WEB_API_ID,
  mfinventory: process.env.MFINVENTORY_API_ID
}
console.log('[lib-domain] api ids:', module.exports)
