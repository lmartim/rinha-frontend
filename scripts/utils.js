const MAX_LENGTH = 151

const isObject = a => a instanceof Object

const size = item => item.constructor === Object ? Object.keys(item).length : item.length

const resetState = () => {
    state = {
        index: 0,
        el: null,
        current: null,
        remaining: null
    }
}