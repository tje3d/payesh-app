import { AuthBloc } from '/src/bloc/auth.bloc'
import { DataBloc } from '/src/bloc/data.bloc'
import { di } from '/src/di/di.default'
import { unDestroy } from '/src/helpers/svelte.helper'

export default async function init() {
  // ─── Auth ────────────────────────────────────────────────────────────

  const token = localStorage.getItem('token') || null

  if (token && typeof token === 'string') {
    di(AuthBloc).token.next(token)
  }

  unDestroy(di(AuthBloc).token, (token) => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  })

  // ─── Data ────────────────────────────────────────────────────────────

  unDestroy(di(DataBloc).inspectItems, (item) => {
    if (!item) {
      localStorage.removeItem('inspectItems')
    } else {
      localStorage.setItem('inspectItems', JSON.stringify(item))
    }
  })

  unDestroy(di(DataBloc).organs, (item) => {
    if (!item) {
      localStorage.removeItem('organs')
    } else {
      localStorage.setItem('organs', JSON.stringify(item))
    }
  })
}
