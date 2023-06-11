
export async function getChannels() {
    console.log('Getting all channels..')

    try {
        const response = await fetch('/api/channels');
        if (response.ok) {
            const userData = await response.json();
            console.log('Response from Api..', userData);
            return userData;
        } else {
            console.log('Server responded with an error:', response.status);
            return [];
        }
    } catch (error) {
        console.log("error fetchning data", error);
        return [];
    }
}
