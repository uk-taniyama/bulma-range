'use strict';

const bulmaRange = require('../src/js/index').default;

describe('bulmaRange', () => {
  test('Should throw exception if instanciate with no/wrong selector', () => {
    expect(() => {
      new bulmaRange();
    }).toThrow('An invalid selector or non-DOM node has been provided.');
  });

  test('Should return an array', () => {
    var instances = bulmaRange.attach('.selector');
    expect(Array.isArray(instances)).toBe(true);
  });

  test('Should return an array of bulmaSlider instances', () => {
    var instances = bulmaRange.attach();
    instances.every(i => expect(i).toBeInstanceOf(bulmaSlider));
  });
});
