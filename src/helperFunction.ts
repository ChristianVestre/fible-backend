export const findHtype = (htypeId: any) => {
    console.log(htypeId)
    let type = htypeId.substring(0, 2)
    switch (type) {
        case "ro":
            return "routes"
        case "st":
            return "stops"
        case "po":
            return "pois"
        default:
            return "routes"
    }
}