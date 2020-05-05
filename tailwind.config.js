const plugin = require('tailwindcss/plugin')

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
    extend: {
        colors: {
            'themePurple': '#342e37',
            'themeBlue': '#0bbcd6',
            'themeRed': '#e4572e',
            'themeOffWhite': '#d6f8d6',
        },
        fontFamily: {
          'manrope': ['Manrope']
        }
    },
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
      plugin(function({ addUtilities }) {
        const newUtilities = {
          '.boxshadow-3d-right': {
            background:' #342e37',
            border: '.1rem solid #d6f8d6',
            boxShadow: '.3rem -.3rem 0 -.1rem #342e37, .3rem -.3rem #0bbcd6, .6rem -.6rem 0 -.1rem #342e37, .6rem -.6rem #e4572e',
            transition: 'box-shadow .75s',
          },
          '.boxshadow-3d-left': {
            background:' #342e37',
            border: '.1rem solid #d6f8d6',
            boxShadow: '-.3rem -.3rem 0 -.1rem #342e37, -.3rem -.3rem #0bbcd6, -.6rem -.6rem 0 -.1rem #342e37, -.6rem -.6rem #e4572e',
            transition: 'box-shadow .75s',
          },
          '.boxshadow-3d-collapse': {
            boxShadow: '0 0 0 0 #342e37, 0 0 0 0 #0bbcd6, 0 0 0 0 #342e37, 0 0 0 0 #e4572e !important',
          },
          '.nav-border': {
            boxShadow: '0 .3rem #342e37, 0 .3rem 0 .1rem #d6f8d6, -.3rem .6rem #342e37, -.3rem .6rem 0 .1rem #0bbcd6, -.6rem .9rem #342e37, -.6rem .9rem 0 .1rem #e4572e',
          },
          '.gradient': {
            background: 'rgba(228,87,46,1)',
            background: 'linear-gradient(315deg, rgba(11,188,214,1) 0%, rgba(52,46,55,1) 50%, rgba(228,87,46,1) 100%)',
          },
          '.last': {
            marginRight: '0 !important'
          },
          '.first': {
            marginLeft: '0'
          },
          '.picture-border-1': {
            border: '.5rem solid #d6f8d6',
            boxShadow: '-.2rem -.2rem #342e37, -.3rem -.3rem #0bbcd6, -.5rem -.5rem #342e37, -.6rem -.6rem #0bbcd6, .5rem .5rem #e4572e',
          },
          '.picture-border-2': {
            border: '.5rem solid #d6f8d6',
            boxShadow: '.2rem .2rem #342e37, .3rem .3rem #0bbcd6, .5rem .5rem #342e37, .6rem .6rem #0bbcd6, -.5rem -.5rem #e4572e',
          },
          '.picture-border-sm-1': {
            border: '.3rem solid #d6f8d6',
            boxShadow: '.2rem .2rem #342e37, .3rem .3rem #0bbcd6, -.2rem -.2rem #342e37, -.3rem -.3rem #e4572e',
          },
          '.picture-border-sm-2': {
            border: '.3rem solid #d6f8d6',
            boxShadow: '.2rem .2rem #342e37, .3rem .3rem #e4572e, -.2rem -.2rem #342e37, -.3rem -.3rem #0bbcd6',
          },
          '.textshadow-blue': {
            textShadow: '0 0 .2rem #0bbcd6',
          },
          '.textshadow-red': {
            textShadow: '0 0 .2rem #e4572e',
          },
          '.bg-blurred': {
            backgroundColor: 'rgba(52, 46, 55, .8)'
          },
          '.title-bg-1': {
            background: 'rgba(52,46,55,1)',
            background: 'linear-gradient(135deg, rgba(11,188,214,1) 5%, rgba(228,87,46,1) 95%)',
            boxShadow: '0 0 0 .3rem #342e37, 1.7rem -1.7rem 0 -.7rem #342e37, -1.7rem 1.7rem 0 -.7rem #342e37, -.6rem -.6rem #e4572e, .6rem .6rem #0bbcd6',
          },
          '.title-bg-2': {
            background: 'rgba(52,46,55,1)',
            background: 'linear-gradient(135deg, rgba(11,188,214,1) 5%, rgba(228,87,46,1) 95%)',
            boxShadow: '0 0 0 .3rem #342e37, 1.7rem -1.7rem 0 -.7rem #342e37, -1.7rem 1.7rem 0 -.7rem #342e37, -.6rem -.6rem #e4572e, .6rem .6rem #0bbcd6',
          },
          '.title-bg-3': {
            background: 'rgb(11,188,214',
            background: 'linear-gradient(225deg, rgba(11,188,214,1) 0%, rgba(52,46,55,1) 10%, rgba(52,46,55,1) 90%, rgba(228,87,46,1) 100%)',
            boxShadow: '0 0 0 .3rem #342e37, .6rem -.6rem #e4572e, -.6rem .6rem #0bbcd6',
          },
          '.title-bg-4': {
            background: 'rgb(11,188,214',
            background: 'linear-gradient(315deg, rgba(228,87,46,1) 0%, rgba(52,46,55,1) 14%, rgba(52,46,55,1) 86%, rgba(11,188,214,1) 100%)',
            boxShadow: '0 0 0 .3rem #342e37, -.6rem -.6rem #e4572e, .6rem .6rem #0bbcd6',
          }
        }

        addUtilities(newUtilities, ['responsive', 'hover'])
      })
  ]
}
