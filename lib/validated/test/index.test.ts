import { describe, expect, it, test } from '@jest/globals'
import { invalid, reduceValidated, valid } from '../src'

describe('Validated', () => {
  describe('constructor functions', () => {
    test('valid', () => {
      const validated = valid({ some: 'object ' })
      expect(validated).toHaveProperty('valid', true)
      expect(validated).toHaveProperty('value', { some: 'object ' })
    })

    test('invalid', () => {
      const validated = invalid(['reasons'])
      expect(validated).toHaveProperty('valid', false)
      expect(validated).toHaveProperty('reasons', ['reasons'])
    })
  })

  describe('map', () => {
    it('should map value of valid', () => {
      expect(valid(5).map((value) => value * 2)).toEqual(
        expect.objectContaining({
          valid: true,
          value: 10
        })
      )
    })

    it('should do nothing for invalid', () => {
      expect(
        invalid<number>(['hello']).map((value) => value * 2)
      ).toEqual(
        expect.objectContaining({
          valid: false,
          reasons: ['hello']
        })
      )
    })
  })

  describe('mapError', () => {
    it('should do nothing for valid', () => {
      expect(valid(5).mapError((reasons) => reasons.concat('another reason'))).toEqual(
        expect.objectContaining({
          valid: true,
          value: 5
        })
      )
    })

    it('should map reasons of invalid', () => {
      expect(
        invalid<number>(['hello']).mapError((reasons) => reasons.concat('another reason'))
      ).toEqual(
        expect.objectContaining({
          valid: false,
          reasons: ['hello', 'another reason']
        })
      )
    })
  })

  describe('flatMap', () => {
    it('should map value of valid when returning valid', () => {
      expect(valid(5).flatMap((value) => valid(value * 2))).toEqual(
        expect.objectContaining({
          valid: true,
          value: 10
        })
      )
    })

    it('should map value of valid when returning invalid', () => {
      expect(valid(5).flatMap((value) => invalid([`no ${value}`]))).toEqual(
        expect.objectContaining({
          valid: false,
          reasons: ['no 5']
        })
      )
    })

    it('should do nothing for invalid', () => {
      expect(
        invalid<number>(['hello']).flatMap((value) => valid(value * 2))
      ).toEqual(
        expect.objectContaining({
          valid: false,
          reasons: ['hello']
        })
      )
    })
  })

  describe('awaitValue', () => {
    it('should await the value of a valid', async () => {
      expect(await valid(Promise.resolve(5)).awaitValue()).toEqual(
        expect.objectContaining({
          valid: true,
          value: 5
        })
      )
    })

    it('should do nothing for invalid', async () => {
      expect(await invalid(['hello']).awaitValue()).toEqual(
        expect.objectContaining({
          valid: false,
          reasons: ['hello']
        })
      )
    })
  })

  describe('unwrap', () => {
    it('should return the value of a valid', () => {
      expect(valid(5).unwrap()).toBe(5)
    })

    it('should throw message and reasons for invalid', () => {
      expect(() => invalid(['hello', 'there']).unwrap('invalid!')).toThrowError(
        expect.objectContaining({
          message: 'invalid!',
          details: 'hello\n\nthere'
        })
      )
    })
  })

  describe('reduceValidated', () => {
    it('should return valid with array if all are valid', () => {
      expect(reduceValidated([valid(1), valid(2), valid(3)])).toEqual(
        expect.objectContaining({
          valid: true,
          value: [1, 2, 3]
        })
      )
    })

    it('should return invalid concatenating reasons if any are invalid', () => {
      expect(
        reduceValidated([
          valid(1),
          invalid(['hello', 'there']),
          valid(2),
          invalid(['general', 'kenobi']),
          valid(3)
        ])
      ).toEqual(
        expect.objectContaining({
          valid: false,
          reasons: ['hello', 'there', 'general', 'kenobi']
        })
      )
    })
  })
})
