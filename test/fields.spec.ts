import * as chai from "chai"
import { changeValueByCopy } from "../src/concept/fields";

const expect = chai.expect

describe('changeValueByCopy', () => {
    it('should allow missing key', () => {
        expect(changeValueByCopy({}, ['a', 'b', 'c'], 'd')).deep.eq({
            a: {
                b: {
                    c: 'd'
                }
            }
        })  
    })  
    it('should change existing value', () => {
        expect(changeValueByCopy({a: 'b'}, ['a'], 'c')).deep.eq({
            a: 'c'
        })  
    })
})