//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/docs/filters
//

const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

// Add your filters here

addFilter('boldCurrency', (value) => {
  if (typeof value !== 'string') return value
  return value.replace(/(£[\d,]+(?:\.\d{2})?)/g, '<strong class="govuk-!-font-weight-bold">$1</strong>')
})
