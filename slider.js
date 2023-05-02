class CircularSlider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <div id="slider-container" class="circular-slider">
                <svg id="slider">
                    <circle 
                        id="slider-highlight" 
                        cx="50%" 
                        cy="50%" 
                        pathLength="100"
                    ></circle>
                    <circle id="slider-background" cx="50%" cy="50%"></circle>
                    <circle id="slider-click-area" cx="50%" cy="50%"></circle>
                </svg>
                <div id="nipple-container" class="nipple-container">
                    <div 
                        id="nipple"
                        class="nipple" 
                        draggable="true" 
                    ></div>
                </div>
            </div>
            <link rel="stylesheet" href="css/circular-slider.css">
        `;
    }

    _options = {}

    size = 148
    value = 10
    max = 100
    min = 100
    step = 1
    slider
    sliderHighlight
    nipple
    transitionsCount = 0

    connectedCallback() {
        this.sliderContainer = this.shadowRoot.getElementById("slider-container")
        this.slider = this.shadowRoot.getElementById("slider")
        this.sliderBackground = this.shadowRoot.getElementById("slider-background")
        this.sliderHighlight = this.shadowRoot.getElementById("slider-highlight")
        this.sliderClickArea = this.shadowRoot.getElementById("slider-click-area")
        this.nipple = this.shadowRoot.getElementById("nipple")
        this.nippleContainer = this.shadowRoot.getElementById("nipple-container")

        // TODO: Remove event listeners
        this.nipple.addEventListener('dragstart', this.startDrag.bind(this))
        this.nipple.addEventListener('drag', this.handleSliderDrag.bind(this))
        this.nipple.addEventListener('touchmove', this.handleSliderTouchDrag.bind(this))
        this.sliderClickArea.addEventListener('click', this.handleSliderClick.bind(this))
        this.sliderClickArea.addEventListener('touch', this.handleSliderTouch.bind(this))

        this.updateContent(this.options);
    }

    updateContent(options) {
        if (!this.isConnected) return
        const sliderStrokeWidth = 22
        const circlePadding = 3
        const nippleStrokeSizeDifference = 6

        this.size = options.size || 148
        this.value = options.value || 0
        this.max = options.max || 1
        this.min = options.min || 0
        this.step = options.step || 1

        this.slider.style.width = `${2 * this.size + sliderStrokeWidth}px`
        this.slider.style.height = `${2 * this.size + sliderStrokeWidth}px`
        this.sliderBackground.style['stroke-dasharray'] = `${this.calculateDashWidth(this.size)}px, 2px`
        this.sliderBackground.setAttribute('r', this.size)
        this.sliderHighlight.setAttribute('r', this.size)
        this.sliderClickArea.setAttribute('r', this.size)
        this.sliderHighlight.style.stroke = options.color

        this.nippleContainer.style.top = `${this.size + sliderStrokeWidth / 2 + nippleStrokeSizeDifference}px`
        this.nippleContainer.style.width = `${this.size * 2 + sliderStrokeWidth + nippleStrokeSizeDifference}px`

        this.setSliderHighlight(this.value)
        this.setNipplePosition(this.valueToAngle(this.value))
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
        return this.round(( this.max - this.min ) / 100 * percentage, this.step)
    }

    round(number, increment) {
        return Math.round(number / increment ) * increment;
    }

    getCircumference() {
        return 2 * Math.PI * this.size
    }

    setSliderHighlight (value) {
        this.sliderHighlight.style['stroke-dashoffset'] = 100 - (this.valueToPercent(value))
    }

    angleToPercent(angle) {
        return 100 / 360 * angle
    }

    valueToAngle(value) {
        return 3.6 * this.valueToPercent(value)
    }

    getNipplePosition (value) {
        let progressPosition = 360 * this.valueToPercent(value) / 100 - 90
        const progressRad = progressPosition * (Math.PI / 180)
        return {
            left: this.size + this.size * Math.cos(progressRad),
            top: this.size + this.size * Math.sin(progressRad)
        }
    }

    setNipplePosition (angle) {
        this.nippleContainer.style.transform = `rotate(${angle - 90}deg)`
        this.nipple.style.transform = `rotate(-${angle - 90}deg)`
    }

    startDrag(event) {
        var img = document.createElement("img");
        event.dataTransfer.setDragImage(img, 0, 0)
    }

    getDragCoordinates(eventParams) {
        let sliderX = this.sliderBackground.getBoundingClientRect().left
        let sliderY = this.sliderBackground.getBoundingClientRect().top
        let offsetX = eventParams.clientX
        let offsetY = eventParams.clientY

        return {
            x: offsetX - sliderX,
            y: offsetY - sliderY 
        }
    }

    getDragAngle (coordinates) {
        let relativeX = coordinates.x - this.size
        let relativeY = coordinates.y - this.size
        let distance = Math.sqrt(relativeX ** 2 * relativeY ** 2)
        let angleRad = Math.atan2(relativeX, relativeY)
        return (angleRad * (180 / Math.PI) - 180) * -1
    }

    handleSliderDrag (event) {
        if (event.screenX === 0) {
            return
        }

        const newValue = this.percentToValue(
            this.angleToPercent(
                this.getDragAngle(
                    this.getDragCoordinates(event)
                )
            )
        )

        if (this.value === newValue) return

        this.value = newValue

        this.setSliderHighlight(this.value)
        this.setNipplePosition(
            this.valueToAngle(this.value)
        )

        const inputEvent = new InputEvent("input", { data: this.value })
        this.dispatchEvent(inputEvent)
    }

    handleSliderTouchDrag (event) {
        if (!event?.touches[0]) {
            return
        }

        const newValue = this.percentToValue(
            this.angleToPercent(
                this.getDragAngle(
                    this.getDragCoordinates(event.touches[0])
                )
            )
        )

        if (this.value === newValue) return

        this.value = newValue

        this.setSliderHighlight(this.value)
        this.setNipplePosition(
            this.valueToAngle(this.value)
        )

        const inputEvent = new InputEvent("input", { data: this.value })
        this.dispatchEvent(inputEvent)
    }

    handleSliderClick (event) {
        if (event.screenX === 0) {
            return
        }

        const newValue = this.percentToValue(
            this.angleToPercent(
                this.getDragAngle(
                    this.getDragCoordinates(event)
                )
            )
        )

        if (this.value === newValue) return

        this.transitionsCount++
        this.nipple.style['pointer-events'] = 'none'
        this.sliderContainer.classList.add("circular-slider--transitioning")

        this.value = newValue

        this.setSliderHighlight(this.value)
        this.setNipplePosition(
            this.valueToAngle(this.value)
        )

        const inputEvent = new InputEvent("input", { data: this.value })
        this.dispatchEvent(inputEvent)

        const transitionEndHandler = (event => {
            this.transitionsCount--
            if (this.transitionsCount === 0) {
                this.sliderContainer.classList.remove("circular-slider--transitioning")
                this.nipple.style['pointer-events'] = null
            }
            this.nippleContainer.removeEventListener("transitionend", transitionEndHandler)
        })

        this.nippleContainer.addEventListener("transitionend", transitionEndHandler)
    }

    handleSliderTouch (event) {
        if (!event?.touches[0]) {
            return
        }

        const newValue = this.percentToValue(
            this.angleToPercent(
                this.getDragAngle(
                    this.getDragCoordinates(event.touches[0])
                )
            )
        )

        if (this.value === newValue) return

        this.transitionsCount++
        this.nipple.style['pointer-events'] = 'none'
        this.sliderContainer.classList.add("circular-slider--transitioning")

        this.value = newValue

        this.setSliderHighlight(this.value)
        this.setNipplePosition(
            this.valueToAngle(this.value)
        )

        const inputEvent = new InputEvent("input", { data: this.value })
        this.dispatchEvent(inputEvent)

        const transitionEndHandler = (event => {
            this.transitionsCount--
            if (this.transitionsCount === 0) {
                this.sliderContainer.classList.remove("circular-slider--transitioning")
                this.nipple.style['pointer-events'] = null
            }
            this.nippleContainer.removeEventListener("transitionend", transitionEndHandler)
        })

        this.nippleContainer.addEventListener("transitionend", transitionEndHandler)
    }
}

customElements.define('circular-slider', CircularSlider);
