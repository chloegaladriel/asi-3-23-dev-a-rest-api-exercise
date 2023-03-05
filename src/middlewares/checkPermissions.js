const checkPermissions = (action, resource) => {
  return async (req, res, next) => {
    const { permissions } = req.session.role

    if (!permissions || !permissions.includes(`${action}:${resource}`)) {
      return res.status(403).send({ message: "Forbidden" })
    }

    next()
  }
}

export default checkPermissions
