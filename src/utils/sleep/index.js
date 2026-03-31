export default function sleep(time_in_seconds) {

    const ms_in_seconds = 1000

    return new Promise((res, rej) => {

        setTimeout(() => {
            res(true)
        }, time_in_seconds * ms_in_seconds )
    })
}