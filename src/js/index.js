import EventEmitter from './events';

export const isString = unknown => (typeof unknown === 'string' || ((!!unknown && typeof unknown === 'object') && Object.prototype.toString.call(unknown) === '[object String]'));

export default class bulmaRange extends EventEmitter {
  constructor(selector, options = {}) {
    super();

    this.element = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    // An invalid selector or non-DOM node has been provided.
    if (!this.element) {
      throw new Error('An invalid selector or non-DOM node has been provided.');
    }

    this._clickEvents = ['click'];
    /// Set default options and merge with instance defined
    this.options = {
      ...options
    };

    this.onRangeInput = this.onRangeInput.bind(this);

    this.init();
  }

  /**
   * Initiate all DOM element containing selector
   * @method
   * @return {Array} Array of all range instances
   */
  static attach(selector = 'input[type="range"].range', options = {}) {
    let instances = new Array();

    const elements = isString(selector) ? document.querySelectorAll(selector) : Array.isArray(selector) ? selector : [selector];
    elements.forEach(element => {
      if (typeof element[this.constructor.name] === 'undefined') {
        const instance = new bulmaRange(element, options);
        element[this.constructor.name] = instance;
        instances.push(instance);
      } else {
        instances.push(element[this.constructor.name]);
      }
    });

    return instances;
}

  /**
   * Initiate plugin
   * @method init
   * @return {void}
   */
  init() {
    this._id = 'bulmaRange' + (new Date()).getTime() + Math.floor(Math.random() * Math.floor(9999));
    this.output = this._findOutputForRange();
    
    this._bindEvents();

    if (this.output) {
      if (this.element.classList.contains('has-output-tooltip')) {
        // Get new output position
        var newPosition = this._getRangeOutputPosition();

        // Set output position
        this.output.style['left'] = newPosition.position;
      }
    }

    this.emit('bulmaRange:ready', this.element.value);
  }

  _findOutputForRange() {
    let result = null;
    const outputs = document.getElementsByTagName('output') || [];
    
    Array.from(outputs).forEach(output => {
      if (output.htmlFor == this.element.getAttribute('id')) {
        result = output;
        return true;
      }
    });
    return result;
  }

  _getRangeOutputPosition() {
    // Update output position
    var newPlace, minValue;
  
    var style = window.getComputedStyle(this.element, null);
    // Measure width of range input
    var rangeWidth = parseInt(style.getPropertyValue('width'), 10);
  
    // Figure out placement percentage between left and right of input
    if (!this.element.getAttribute('min')) {
      minValue = 0;
    } else {
      minValue = this.element.getAttribute('min');
    }
    var newPoint = (this.element.value - minValue) / (this.element.getAttribute('max') - minValue);
  
    // Prevent bubble from going beyond left or right (unsupported browsers)
    if (newPoint < 0) {
      newPlace = 0;
    } else if (newPoint > 1) {
      newPlace = rangeWidth;
    } else {
      newPlace = rangeWidth * newPoint;
    }
  
    return {
      'position': newPlace + 'px'
    }
  }
  
  /**
   * Bind all events
   * @method _bindEvents
   * @return {void}
   */
  _bindEvents() {
    if (this.output) {
      // Add event listener to update output when range value change
      this.element.addEventListener('input', this.onRangeInput, false);
    }
  }

  onRangeInput(e) {
    e.preventDefault();

    if (this.element.classList.contains('has-output-tooltip')) {
      // Get new output position
      var newPosition = this._getRangeOutputPosition();

      // Set output position
      this.output.style['left'] = newPosition.position;
    }

    // Check for prefix and postfix
    const prefix = (this.output.hasAttribute('data-prefix') ? this.output.getAttribute('data-prefix') : '');
    const postfix = (this.output.hasAttribute('data-postfix') ? this.output.getAttribute('data-postfix') : '');
    
    // Update output with range value
    this.output.value = prefix + this.element.value + postfix;

    this.emit('bulmaRange:ready', this.element.value);
  }
}
