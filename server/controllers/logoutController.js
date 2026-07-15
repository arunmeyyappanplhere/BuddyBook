const logoutController = async (req, res) => {
  console.log("Logout controller called");

  try {
    res.clearCookie("token", {
      httpOnly: false,
      secure: false,
      path: "/",
    });
    res.status(200).json({ message: "Account logged out." });
  } catch (err) {
    console.error(err);
    
    res.status(500).json({ error: "Log out error" });
  }
};

export default logoutController;
