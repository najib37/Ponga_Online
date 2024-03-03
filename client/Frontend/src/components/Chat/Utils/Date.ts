const options: Intl.DateTimeFormatOptions = {
    // year: "numeric",
    // month: "long",
    // day: "numeric",
    hour: "numeric",
    minute: "numeric",
};


export function FormatDate(date : string) : string {

    if (date === undefined) {
        return ""
    }

    const dateformat: Date = new Date(date);

    return new Intl.DateTimeFormat("en-US", options).format(dateformat);

}