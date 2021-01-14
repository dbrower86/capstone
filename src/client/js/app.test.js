import 'regenerator-runtime/runtime'
import { isValidDate } from "./app.js"
//global.alert = jest.fn()

describe("isValidDate", () => {
    test("Testing valid date", () => {
        expect(isValidDate("12/31/2021")).toBeTrue
    })
    test("Testing invalid date", () => {
        expect(isValidDate("02/30/2021")).toBeFalse
    })
})
