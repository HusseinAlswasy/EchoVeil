import { EventEmitter } from "node:events";
export const eventEmitter = new EventEmitter()

eventEmitter.on("confirmEmail", (fn) => {
    fn()
})