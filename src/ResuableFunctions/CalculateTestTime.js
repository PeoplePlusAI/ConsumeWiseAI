export function CalculateTestTime(targetTime) {
    const difference = new Date(targetTime) - new Date();
    if (difference > 0) {
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        return { minutes, seconds };
    } else {
        return null; // Countdown is over
    }
}