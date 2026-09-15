import { EventEmitter } from "node:events";
export const eventEmitter = new EventEmitter()

export const event_name={
    confirmEmail:"confirmEmail"
}
eventEmitter.on(event_name.confirmEmail, (fn) => {
    fn()
})