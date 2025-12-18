module.exports = {

  // Insert values here

  savedCourses: [
    {
      provider: "Tes Institute",
      title: "Mathematics (D228)",
      distance: "1 mile from Manchester",
      feeText: "Salary (apprenticeship)"
    },
    {
      provider: "Birmingham City University",
      title: "Mathematics (3CGN)",
      distance: "3 miles from M60 2LA",
      feeAmount: "£9,535",
      feeText: "fee for UK citizens",
      funding: "Bursaries of £29,000 are available"
    },
    {
      provider: "University of Sunderland",
      title: "Mathematics (S252)",
      distance: "29 miles from M50 2LA",
      feeAmount: "£9,535",
      feeText: "fee for UK citizens",
      feeExtraAmount: "£17,500",
      feeExtraText: "fee for Non-UK citizens",
      funding: "Bursaries of £29,000 are available"
    },
    {
      provider: "University of Sheffield",
      title: "Physics (F3X1)",
      distance: "10 miles from Oldham",
      feeAmount: "£9,535",
      feeText: "fee for UK citizens",
      feeExtraAmount: "£25,605",
      feeExtraText: "fee for Non-UK citizens",
      funding: "Scholarships of £31,000 or bursaries of £29,000 are available"
    }
  ],

  emailAlerts: [
    {
      id: 0,
      title: "Mathematics in Manchester",
      criteria: [
        { key: "Subject", value: "Mathematics" },
        { key: "Location", value: "Within 50 miles of Manchester" },
        { key: "Fee or salary", value: "Fee-paying" },
        { key: "Full time or part time", value: "Full time" },
        { key: "Qualification", value: "QTS with PGCE or PGDE" },
        { key: "Start date", value: "October 2026 to July 2027" }
      ]
    },
    {
      id: 1,
      title: "Physics and Mathematics in M60 2LA",
      criteria: [
        { key: "Subject", value: "Physics and Mathematics" },
        { key: "Location", value: "Within 100 miles of M60 2LA" },
        { key: "Fee or salary", value: "Salary" }      ]
    },
    {
      id: 2,
      title: "Primary with mathematics",
      criteria: [
        { key: "Subject", value: "Primary with mathematics" },
        { key: "Fee or salary", value: "Fee-paying courses" },
        { key: "Full time or part time", value: "Part time" },
        { key: "Qualification", value: "QTS only" },
        { key: "Start date", value: "September 2026 only" }
      ]
    }
  ],

  recentSearches: [
    {
      id: 0,
      title: "Physics and Mathematics in M60 2LA",
      criteria: [
        { key: "Subject", value: "Physics and Mathematics" },
        { key: "Location", value: "Within 100 miles of M60 2LA" },
        { key: "Fee or salary", value: "Salary" }
      ]
    },
    {
      id: 1,
      title: "Mathematics in Manchester",
      criteria: [
        { key: "Subject", value: "Mathematics" },
        { key: "Location", value: "Within 50 miles of Manchester" }
      ]
    },
    {
      id: 2,
      title: "Mathematics in Salford",
      criteria: [
        { key: "Subject", value: "Mathematics" },
        { key: "Location", value: "Within 25 miles of Salford" },
        { key: "Fee or salary", value: "Fee-paying courses" }
      ]
    },
    {
      id: 3,
      title: "Primary with mathematics",
      criteria: [
        { key: "Subject", value: "Primary with mathematics" },
        { key: "Fee or salary", value: "Fee-paying courses" },
        { key: "Full time or part time", value: "Part time" },
        { key: "Qualification", value: "QTS only" },
        { key: "Start date", value: "September 2026 only" }
      ]
    }
  ]
}
