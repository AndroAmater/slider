
class CircularSlider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <div class="circular-slider">
                <svg id="slider">
                <circle 
                    id="slider-highlight" 
                    cx="50%" 
                    cy="50%" 
                    pathLength="100"
                ></circle>
                <circle id="slider-background" cx="50%" cy="50%"></circle>
                </svg>
                <div 
                    id="nipple"
                    class="nipple" 
                    draggable="true" 
                ></div>
            </div>
            <link rel="stylesheet" href="css/circular-slider.css">
        `;
    }

    _options = {}

    sliderSize = 148
    value = 10
    max = 100
    min = 100
    step = 1
    slider
    sliderHighlight
    nipple

    connectedCallback() {
        this.slider = this.shadowRoot.getElementById("slider")
        this.sliderBackground = this.shadowRoot.getElementById("slider-background")
        this.sliderHighlight = this.shadowRoot.getElementById("slider-highlight")
        this.nipple = this.shadowRoot.getElementById("nipple")

        // TODO: Remove event listeners
        this.nipple.addEventListener('dragstart', this.startDrag.bind(this))
        this.nipple.addEventListener('drag', this.handleSliderDrag.bind(this))
        this.nipple.addEventListener('touchmove', this.handleSliderTouchDrag.bind(this))

        this.updateContent(this.options);
    }

    updateContent(options) {
        const sliderStrokeWidth = 22

        this.sliderSize = options.sliderSize || 148
        this.value = options.value || 0
        this.max = options.max || 1
        this.min = options.min || 0
        this.step = options.step || 1

        this.slider.style.width = `${2 * this.sliderSize + sliderStrokeWidth}px`
        this.slider.style.height = `${2 * this.sliderSize + sliderStrokeWidth}px`
        this.sliderBackground.style['stroke-dasharray'] = `${this.calculateDashWidth(this.sliderSize)}px, 2px`
        this.sliderBackground.setAttribute('r', this.sliderSize)
        this.sliderHighlight.setAttribute('r', this.sliderSize)

        this.setSliderHighlight(this.value)
        this.setNipplePosition(this.getNipplePosition(this.value))
    }

    set options(value) {
        this._options = value;
        this.updateContent(this._options);
    }

    get options() {
        return this._options;
    }

    calculateDashWidth(r) {
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

    valueToPercent() {
        return 100 / this.max * this.value;
    }

    percentToValue (percentage){
        return this.round(100 / ( this.max - this.min ) * percentage, this.step)
    }

    round(number, increment) {
        return Math.ceil(number / increment ) * increment;
    }

    getCircumference() {
        return 2 * Math.PI * this.sliderSize
    }

    setSliderHighlight (value) {
        this.sliderHighlight.style['stroke-dashoffset'] = 100 - (this.valueToPercent(value))
    }

    angleToPercent(angle) {
        return 100 / 360 * angle
    }

    getNipplePosition (value) {
        let progressPosition = 360 * this.valueToPercent(value) / 100 - 90
        const progressRad = progressPosition * (Math.PI / 180)
        console.log()
        return {
            left: this.sliderSize + this.sliderSize * Math.cos(progressRad),
            top: this.sliderSize + this.sliderSize * Math.sin(progressRad)
        }
    }

    setNipplePosition (coordinates) {
        this.nipple.style.left = `${coordinates.left - 3}px`
        this.nipple.style.top = `${coordinates.top - 3}px`
    }

    startDrag(event) {
        var img = document.createElement("img");
        event.dataTransfer.setDragImage(img, 0, 0)
    }

    getDragCoordinates(event) {
        let sliderX = this.sliderBackground.getBoundingClientRect().left
        let sliderY = this.sliderBackground.getBoundingClientRect().top
        let nippleX = this.nipple.getBoundingClientRect().left
        let nippleY = this.nipple.getBoundingClientRect().top
        let offsetX = event.offsetX
        let offsetY = event.offsetY

        return {
            x: nippleX - sliderX + offsetX,
            y: nippleY - sliderY + offsetY
        }
    }

    getDragAngle (coordinates) {
        let relativeX = coordinates.x - this.sliderSize
        let relativeY = coordinates.y - this.sliderSize
        let distance = Math.sqrt(relativeX ** 2 * relativeY ** 2)
        let angleRad = Math.atan2(relativeX, relativeY)
        return (angleRad * (180 / Math.PI) - 180) * -1
    }

    handleSliderDrag (event) {
        if (event.screenX === 0) {
            return
        }
        this.value = this.percentToValue(
            this.angleToPercent(
                this.getDragAngle(
                    this.getDragCoordinates(event)
                )
            )
        )
        this.setSliderHighlight(this.value)
        this.setNipplePosition(
            this.getNipplePosition(this.value)
        )
    }

    getTouchDragCoordinates(event) {
        if (!event?.touches[0]) {
            return
        }
        let sliderX = this.sliderBackground.getBoundingClientRect().left
        let sliderY = this.sliderBackground.getBoundingClientRect().top
        let offsetX = event.touches[0].clientX
        let offsetY = event.touches[0].clientY

        return {
            x: offsetX - sliderX,
            y: offsetY - sliderY
        }
    }

    handleSliderTouchDrag (event) {
        if (!event?.touches[0]) {
            return
        }
        this.value = this.percentToValue(
            this.angleToPercent(
                this.getDragAngle(
                    this.getTouchDragCoordinates(event)
                )
            )
        )
        this.setSliderHighlight(this.value)
        this.setNipplePosition(
            this.getNipplePosition(this.value)
        )
    }
}

customElements.define('circular-slider', CircularSlider);
const slider = document.getElementById('slider')
slider.options = {
    sliderSize: 148,
    value: 10,
    max: 100,
    min: 0,
    step: 1
}
