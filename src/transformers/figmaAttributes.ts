import type {PlatformConfig, Transform, TransformedToken} from 'style-dictionary/types'
import {asArray} from '../utilities/asArray.js'

type FigmaVariableScope =
  | 'ALL_SCOPES'
  | 'TEXT_CONTENT'
  | 'CORNER_RADIUS'
  | 'WIDTH_HEIGHT'
  | 'GAP'
  | 'ALL_FILLS'
  | 'FRAME_FILL'
  | 'SHAPE_FILL'
  | 'TEXT_FILL'
  | 'STROKE_COLOR'
  | 'STROKE_FLOAT'
  | 'EFFECT_COLOR'
  | 'EFFECT_FLOAT'
  | 'OPACITY'
  | 'FONT_FAMILY'
  | 'FONT_STYLE'
  | 'FONT_WEIGHT'
  | 'FONT_SIZE'
  | 'LINE_HEIGHT'
  | 'LETTER_SPACING'
  | 'PARAGRAPH_SPACING'
  | 'PARAGRAPH_INDENT'

const figmaScopes: Record<string, FigmaVariableScope[]> = {
  all: ['ALL_SCOPES'],
  radius: ['CORNER_RADIUS'],
  size: ['WIDTH_HEIGHT'],
  gap: ['GAP'],
  bgColor: ['FRAME_FILL', 'SHAPE_FILL'],
  fgColor: ['TEXT_FILL', 'SHAPE_FILL'],
  effectColor: ['EFFECT_COLOR'],
  effectFloat: ['EFFECT_FLOAT'],
  borderColor: ['STROKE_COLOR'],
  borderWidth: ['STROKE_FLOAT'],
  opacity: ['OPACITY'],
  fontFamily: ['FONT_FAMILY'],
  fontStyle: ['FONT_STYLE'],
  fontWeight: ['FONT_WEIGHT'],
  fontSize: ['FONT_SIZE'],
  lineHeight: ['LINE_HEIGHT'],
  letterSpacing: ['LETTER_SPACING'],
  paragraphSpacing: ['PARAGRAPH_SPACING'],
  paragraphIndent: ['PARAGRAPH_INDENT'],
}

const getScopes = (scopes: string[] | string | undefined): FigmaVariableScope[] => {
  if (typeof scopes === 'string') scopes = [scopes]
  if (Array.isArray(scopes))
    return scopes
      .map(scope => {
        if (scope in figmaScopes) return figmaScopes[scope]
        throw new Error(`Invalid scope: ${scope}`)
      })
      .flat() as FigmaVariableScope[]

  return ['ALL_SCOPES']
}
/**
 * @description retrieves figma attributes from token and adds them to attributes
 * @type attribute transformer — [StyleDictionary.AttributeTransform](https://github.com/amzn/style-dictionary/blob/main/types/Transform.d.ts)
 * @matcher matches all tokens
 * @transformer returns ab object of figma attributes
 */
export const figmaAttributes: Transform = {
  name: 'figma/attributes',
  type: `attribute`,
  transform: (token: TransformedToken, platform: PlatformConfig = {}) => {
    const {modeOverride, collection, scopes, group, codeSyntax} = token.$extensions?.['org.primer.figma'] || {}

    return {
      mode: asArray(platform.options?.theme)[0] || modeOverride || 'default',
      collection,
      group: group || collection,
      scopes: getScopes(scopes),
      codeSyntax,
    }
  },
}
