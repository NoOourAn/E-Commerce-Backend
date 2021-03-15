module.exports = (req, res, next) => {
    const now = new Date();
    console.log({method:req.method,now,url:req.url})
    next();
}