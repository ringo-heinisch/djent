import { map, update } from 'ramda'
import { Identity, Maybe } from 'ramda-fantasy'
import { PRESETS } from 'constants/localStorage'
import { safeGetLocalStorageIO, setLocalStorageIO } from 'modules/localStorageIO'

export function addPreset(preset) {
    const storedPresets = safeGetLocalStorageIO(PRESETS)
        .map(Maybe.maybe([], JSON.parse))
        .runIO()

    const newStoredPresets = Identity
        .of(Maybe(storedPresets.find(p => p.id === preset.id)))
        .map(map(x => storedPresets.indexOf(x)))
        .map(Maybe.maybe(
            storedPresets.concat(preset),
            index => update(index, preset, storedPresets)
        ))
        .map(JSON.stringify)
        .map(setLocalStorageIO('presets'))

    newStoredPresets
        .map(p => p.runIO())

    return {
        type: 'ADD_PRESET',
        payload: { ...preset, group: 'Custom' },
    }
}
