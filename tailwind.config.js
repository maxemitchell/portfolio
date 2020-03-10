module.exports = {
  theme: {
    columnCount: [ 1, 2, 3, 4 ],
    columnGap: { // will fallback to 'gap' || 'gridGap' values
      sm: '0.25rem',
      md: '0.5rem',
      lg: '1rem',
    },
    columnWidth: {
      // sm: '120px',
      // md: '240px',
      // lg: '360px',
    },
    columnRuleColor: false, // will fallback to `borderColor` values
    columnRuleWidth: false, // will fallback to `borderWidth` values
    columnRuleStyle: [
      'none', 'hidden', 'dotted', 'dashed', 'solid',
      'double', 'groove', 'ridge', 'inset', 'outset',
    ],
    columnFill: [ 'auto', 'balance', 'balance-all' ],
    columnSpan: [ 'none', 'all' ],
    extend: {}
  },
  variants: {
    // For the photo gall
    columnCount: ['responsive'],
    columnGap: ['responsive'],
    columnWidth: ['responsive'],
    columnRuleColor: ['responsive'],
    columnRuleWidth: ['responsive'],
    columnRuleStyle: ['responsive'],
    columnFill: ['responsive'],
    columnSpan: ['responsive'],
  },
  plugins: [
      require('tailwindcss-multi-column')(),
  ]
}
