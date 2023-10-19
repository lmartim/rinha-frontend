const mainContent = document.getElementById("main-content")
const jsonContent = document.getElementById("json-content")
const jsonList = document.getElementById("json-list")
const errorMsg = document.getElementById("error-msg")
const loading = document.getElementById("loading-icon")

var state = {
    index: 0,
    el: null,
    current: null,
    remaining: null
}

var htmlString = ""

const appendText = (text, prepend = null) => {
    const newText = document.createElement("div")

    if (!prepend) {
        if (Number(text) >= 0)
            newText.innerHTML = `<h4><span class="json-index">${text}:</span> </h4>`
        else
            newText.innerHTML = `<h4><span class="json-title">${text}</span>: <span class="json-bracket">[</span></h4>`
    } else {
        if (Number(prepend) >= 0)
            newText.innerHTML = `<p><span class="json-index">${prepend}:</span> ${text}</p>`
        else
            newText.innerHTML = `<p><span class="json-title">${prepend}:</span> ${text}</p>`
    }

    return newText.innerHTML
}

const recursiveLoop = (el, rootBranch) => {
    if (isObject(el) && (size(el) > MAX_LENGTH)) {
        if (!state.el) {
            const remaining = el.splice(MAX_LENGTH, el.length)

            state = {
                ...state,
                el,
                current: el.splice(0, MAX_LENGTH),
                remaining
            }

            el = state.current
        } else if (state.remaining.length > 0) {
            const newEl = state.remaining.splice(0, MAX_LENGTH)

            state = {
                ...state,
                current: state.current.concat(newEl)
            }

            el = newEl
        }
    }

    for (var key in el) {
        if (isObject(el[key])) {
            if (rootBranch && Number(key) >= 0) {
                htmlString += appendText(state.index)
                state.index++
            } else {
                htmlString += appendText(key)
            }

            htmlString += '<ul>'


            recursiveLoop(el[key])
        } else {
            htmlString += appendText(el[key], key)
        }

        if (isObject(el[key])) {
            htmlString += '</ul>'

            if (!(Number(key) >= 0))
                htmlString += '<span class="json-bracket">]</span>'
        }
    }
}

const jsonFile = document.getElementById("json")
jsonFile.onchange = () => {
    errorMsg.classList.add("d-none")
    mainContent.classList.add("d-none")

    if (jsonFile.files.length) {
        var reader = new FileReader()

        reader.onload = function (e) {
            jsonList.innerHTML = ""

            resetState()

            try {
                const parsedJson = JSON.parse(e.target.result)
                recursiveLoop(parsedJson, true)

                jsonList.innerHTML += `<h3>${jsonFile.files[0].name}</h3>`
                jsonList.innerHTML += htmlString
                jsonContent.classList.add("d-block")
            } catch (e) {
                console.log(e)

                errorMsg.classList.remove("d-none")
                mainContent.classList.remove("d-none")
                jsonContent.classList.add("d-none")
            }
        }

        reader.readAsText(jsonFile.files[0])
    }
}

document.addEventListener('scroll', () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight

    if (window.scrollY >= scrollableHeight && state.el) {
        htmlString = ""

        recursiveLoop(state.remaining, true)

        jsonList.innerHTML += htmlString
    }
})

const returnToForm = () => {
    mainContent.classList.remove("d-none")
    jsonContent.classList.remove("d-block")

    jsonList.innerHTML = ""
    htmlString = ""
}
