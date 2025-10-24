export function formatPriceToEn(price: number): string {
    return new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
    }).format(price)
}

export function formatDate(date: Date): string {
    const time = new Date(date).getTime()
    const now = new Date().getTime()
    const diff = now - time
    const absDiff = Math.abs(diff);
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = day * 365;

    const formatter = new Intl.RelativeTimeFormat("ja", { numeric: "auto" });
    if (absDiff < minute) {
        return formatter.format(Math.round(diff / 1000), "seconds");
    } else if (absDiff < hour) {
        return formatter.format(Math.round(diff / minute), "minutes");
    } else if (absDiff < day) {
        return formatter.format(Math.round(diff / hour), "hours");
    } else if (absDiff < month) {
        return formatter.format(Math.round(diff / day), "days");
    } else if (absDiff < year) {
        return formatter.format(Math.round(diff / month), "months");
    } else {
        return formatter.format(Math.round(diff / year), "years");
    }
}