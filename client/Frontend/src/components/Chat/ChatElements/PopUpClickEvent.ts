

export function Handler  (
    event: { key: string; },
    stateDispatch : any,
    callback? : Function
)  {

    console.log("Here!!!")

    if (event.key === 'Escape') {
        stateDispatch(false)
    }
    if (event.key === 'Enter' && callback) {
        callback()
    }
}