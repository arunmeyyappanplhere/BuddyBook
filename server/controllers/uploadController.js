export const uploadController = async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  res.status(200).json({
    ok: true,
    filename: req.file.filename,
  });
};
