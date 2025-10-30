const express = require("express");
const { addProduct, updateProduct, deleteProduct, getProduct, getAllProducts } = require("../handlers/product-handler");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// router.post("/", async (req,res)=>{
//     let model = req.body;
//     let product = await addProduct(model);
//     res.send(product);
// })  

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname),
});

const upload = multer({ storage });


router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const model = req.body;
    if (req.files && req.files.length > 0) {
      model.images = req.files.map(file => `/uploads/${file.filename}`);
    }
    const product = await addProduct(model);
    res.send(product);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Upload failed" });
  }
});


router.put("/:id", async (req,res)=>{
    let model = req.body;
    let id = req.params["id"];
    await updateProduct(id,model);
    res.send({message : "updated"});
})

router.delete("/:id", async (req,res)=>{
    let id = req.params["id"];
    await deleteProduct(id);
    res.send({message : "deleted"});
})

router.get("/:id", async (req,res)=>{
    let id = req.params["id"];
    let product = await getProduct(id);
    res.send(product);
})

router.get("/", async (req,res)=>{
    let products = await getAllProducts();
    res.send(products);
})




module.exports=router;