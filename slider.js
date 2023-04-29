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

    console.log(bestD)
    return bestD
}

const circle = document.getElementById("circle")

circle.style['stroke-dasharray'] = `${calculateDashWidth(148)}px, 2px`
