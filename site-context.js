// siteContext global is set in util/route-creator function
exports.setSiteContext = value => (global.ydvSiteContext = value)

exports.getSiteContext = () => global.ydvSiteContext
