function calculateDashWidth(r) {
    const C = 2 * Math.PI * r
    let bestD = 6.4;
    let bestDError = 7;
    let currentD = 6.4;
    let options = {}
    while (currentD >= 5.9) {
        if (C % (currentD + 2.2) < bestDError) {
            bestD = currentD
            bestDError = C % (currentD + 2.2) 
        }
        currentD = currentD - 0.01
    }

    return bestD
}

const circle0 = document.getElementById("circle0")
const circle1 = document.getElementById("circle1")
const circle2 = document.getElementById("circle2")
const circle3 = document.getElementById("circle3")
const circle4 = document.getElementById("circle4")

circle0.style['stroke-dasharray'] = `${calculateDashWidth(51)}px, 2.2px`
circle1.style['stroke-dasharray'] = `${calculateDashWidth(84)}px, 2.2px`
circle2.style['stroke-dasharray'] = `${calculateDashWidth(116)}px, 2.2px`
circle3.style['stroke-dasharray'] = `${calculateDashWidth(148)}px, 2.2px`
circle4.style['stroke-dasharray'] = `${calculateDashWidth(182)}px, 2.2px`
