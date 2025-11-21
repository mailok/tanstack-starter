//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import reactHooks from 'eslint-plugin-react-hooks'
import pluginRouter from '@tanstack/eslint-plugin-router'
import pluginQuery from '@tanstack/eslint-plugin-query'

export default [
  ...tanstackConfig,
  ...pluginRouter.configs['flat/recommended'],
  ...pluginQuery.configs['flat/recommended'],
 reactHooks.configs.flat.recommended,
  {
    ignores: ['.output/**', 'dist/**', 'node_modules/**'],
  },
]
