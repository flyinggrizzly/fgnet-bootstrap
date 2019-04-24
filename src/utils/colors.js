import { merge } from 'lodash'

const colorDefinitions = {
  flyingGrizzly: {
    green: '#6CB06D',
    lightGreen: '#99CC99',
    darkGreen: '#9163A3', // callout left-border
    charcoal: '#2D2D2D',
    purple: '#9163A3',
    blue: '#377BB5',
    coral: '#F88175',
    white: '#FFFFFF',
    blueWhite: '#F3F6FA', // callout background
  }
}

let colors = merge(colorDefinitions, {
  flyingGrizzly: {
    calloutBorder: colorDefinitions.flyingGrizzly.darkGreen,
    calloutBackground: colorDefinitions.flyingGrizzly.blueWhite,
  }
})

export default colors
