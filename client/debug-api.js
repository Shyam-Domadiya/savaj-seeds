
const url = 'https://savaj-seeds-server.onrender.com/api/products';

console.log(`Fetching ${url}...`);

fetch(url)
    .then(async res => {
        console.log(`Status: ${res.status} ${res.statusText}`);
        console.log(`Content-Type: ${res.headers.get('content-type')}`);
        const text = await res.text();
        console.log(`Body length: ${text.length}`);
        console.log(`Body preview: ${text.substring(0, 500)}`);
    })
    .catch(err => {
        console.error('Fetch error:', err);
    });
