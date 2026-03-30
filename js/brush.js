const elems = document.querySelectorAll('.draggable-elem')
const container = document.querySelector('.brushback')

elems.forEach((elem) => {
  let shiftX = 0
  let shiftY = 0
  let isDragging = false

  elem.addEventListener('mousedown', (e) => {
    e.preventDefault()
    isDragging = true

    const rect = elem.getBoundingClientRect()
    shiftX = e.clientX - rect.left
    shiftY = e.clientY - rect.top

    elem.style.zIndex = '1000'
  })

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return

    e.preventDefault()
    const containerRect = container.getBoundingClientRect()

    let newLeft = e.clientX - shiftX - containerRect.left
    let newTop = e.clientY - shiftY - containerRect.top

    newLeft = Math.max(0, Math.min(newLeft, container.clientWidth - elem.offsetWidth))
    newTop = Math.max(0, Math.min(newTop, container.clientHeight - elem.offsetHeight))

    elem.style.left = newLeft + 'px'
    elem.style.top = newTop + 'px'
  })

  document.addEventListener('mouseup', () => {
    isDragging = false
    elem.style.zIndex = '1'
  })
})