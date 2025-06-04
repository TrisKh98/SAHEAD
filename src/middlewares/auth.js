module.exports.isAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 1) {
        return res.status(403).send('Bạn không có quyền truy cập!');
    }
    next();
};
