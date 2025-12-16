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

// Bold distance pattern: "{n} mile(s) from {place}"
addFilter('boldDistance', (value) => {
  if (typeof value !== 'string') return value
  const match = value.match(/^\s*((?:[\d,]+|1)\s*miles?)\s+from\s+(.+?)\s*$/i)
  if (!match) return value
  const amount = match[1]
  const place = match[2]
  return `<strong>${amount}</strong> from <strong>${place}</strong>`
})

// Bold the standalone word "fee" (case-insensitive) without affecting neighbouring text
addFilter('boldFeeWord', (value) => {
  if (typeof value !== 'string') return value
  return value.replace(/\b(fee)\b/gi, '<strong>$1</strong>')
})

// Convert newlines to <br> for simple multiline notes rendering
addFilter('nl2br', (value) => {
  if (typeof value !== 'string') return value
  return value.replace(/\r?\n/g, '<br>')
})
