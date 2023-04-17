// register the service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('Service worker registered: ', registration)
        }).catch(registrationError => {
            console.log('Service worker registration failed: ', registrationError)
        })
    })
}