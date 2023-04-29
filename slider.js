function calculateDashWidth(r) {
    const C = 2 * Math.PI * r
    let bestD = 6.7;
    let bestDError = 9999;
    let currentD = 6.7;
    while (currentD >= 5.7) {
        if (C % (currentD + 2) < bestDError) {
            bestD = currentD
            bestDError = C % (currentD + 2)
        }
        currentD = currentD - 0.01
    }

    return bestD
}

const circle = document.getElementById("circle")
const circleHighlight = document.getElementById("circle-highlight")
const nipple = document.getElementById("nipple")

circle.style['stroke-dasharray'] = `${calculateDashWidth(148)}px, 2px`

let circleSize = 148;
let circleStrokeWidth = 22;

let value = 10
let max = 100
let min = 100
let step = 1

function valueToPercent() {
    return 100/max*value;
}

function percentToValue (percentage){
    return round(100/max * percentage, step)
}

function round(number, increment) {
    return Math.ceil(number / increment ) * increment;
}

function getCircumference() {
    return 2 * Math.PI * circleSize
}

function setSliderHighlight (value) {
    circleHighlight.style['stroke-dashoffset'] = 100 - (valueToPercent(value))
}

function angleToPercent(percentage) {
    return 100/360*percentage
}

setSliderHighlight(value)

function getNipplePosition (value) {
    let progressPosition = 360*valueToPercent(value)/100-90
    const progressRad = progressPosition * (Math.PI / 180)
    return {
        left: circleSize + circleSize * Math.cos(progressRad),
        top: circleSize + circleSize * Math.sin(progressRad)
    }
}

function setNipplePosition (coordinates) {
    nipple.style.left = `${coordinates.left - 3}px`
    nipple.style.top = `${coordinates.top - 3}px`
}

setNipplePosition(getNipplePosition(value))

let dragging = false
function startDrag(event) {
    var img = document.createElement("img");
    event.dataTransfer.setDragImage(img, 0, 0)
    dragging = true
}

function stopDrag() {
    dragging = false
}

function getDragCoordinates(event) {
    let circleX = circle.getBoundingClientRect().left
    let circleY = circle.getBoundingClientRect().top
    let nippleX = nipple.getBoundingClientRect().left
    let nippleY = nipple.getBoundingClientRect().top
    let offsetX = event.offsetX
    let offsetY = event.offsetY

    return {
        x: nippleX - circleX + offsetX,
        y: nippleY - circleY + offsetY
    }
}

function getDragAngle (coordinates) {
    let relativeX = coordinates.x - circleSize
    let relativeY = coordinates.y - circleSize
    let distance = Math.sqrt((relativeX)**2 * (relativeY)**2)
    let angleRad = Math.atan2(relativeX, relativeY)
    return (angleRad * (180 / Math.PI) - 180) * -1
}

function handleSliderDrag (event) {
    if (event.screenX === 0) {
        return
    }
    value = percentToValue(angleToPercent(getDragAngle(getDragCoordinates(event))))
    setSliderHighlight(value)
    setNipplePosition(getNipplePosition(value))
}

function getTouchDragCoordinates(event) {
    if (!event?.touches[0]) {
        return
    }
    let circleX = circle.getBoundingClientRect().left
    let circleY = circle.getBoundingClientRect().top
    let offsetX = event.touches[0].clientX
    let offsetY = event.touches[0].clientY

    return {
        x: offsetX - circleX,
        y: offsetY - circleY
    }
}


function handleSliderTouchDrag (event) {
    if (!event?.touches[0]) {
        return
    }
    value = percentToValue(angleToPercent(getDragAngle(getTouchDragCoordinates(event))))
    setSliderHighlight(value)
    setNipplePosition(getNipplePosition(value))
}
