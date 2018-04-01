export default {
    apiServerDomain: process.env.NODE_ENV === 'development' ? 'localhost:10000' : 'undefined.com'
};