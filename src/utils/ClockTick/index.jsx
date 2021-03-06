import { log } from "../../utils";
const ClockTick = (clock) => {
    let [day, time] = clock.split(' ');
    let [h, m, s] = time.split(':');
    h = parseInt(h);
    m = parseInt(m);
    s = parseInt(s);

    s = (s < 59) ? ++s : 0;
    m = (m < 59) ? ((s == 0) ? ++m : m) : 0;
    h = (h < 23) ? ((m == 0) ? ++h : h) : 0;
    
    return `${day} ${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
}

export default ClockTick;

// if (s < 59) {
//     s = ++s;
// } else {
//     s = 0;
//     if (m < 59) {
//         m = ++m;
//     } else {
//         m = 0;
//         if (h < 24) {
//             h = ++h;
//         }
//     }
// }