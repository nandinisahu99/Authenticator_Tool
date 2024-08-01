export const handleError = (err, req, res) => {
  const statusCode = err.statusCode || 500;
  let message = err.message;
  if (message instanceof Error) message = "Something went wrong";

  res.render("Error", {
    loggedIn: req.user,
    error: message,
    statusCode: statusCode,
  });
};
