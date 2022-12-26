/* Map */
export const ICON_MAP = new Map()

/* Add mappings */
addMapping([0,1], "sun");
addMapping([2], "cloud-sun");
addMapping([3], "cloud");
addMapping([45, 48], "smog");
addMapping([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82], "cloud-showers-heavy");
addMapping([71, 73, 75, 77, 85, 86], "snowflake")
addMapping([95, 96, 99], "cloud-bolt")

/** Add a mapping to the Icon map */
function addMapping(values, icon) {
    values.forEach((val) => {
        ICON_MAP.set(val, icon)
    })
}
