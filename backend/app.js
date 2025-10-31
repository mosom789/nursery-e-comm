const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const cors = require("cors");
const categoryRoutes = require("./routes/category");
const brandRoutes = require("./routes/brand");
const productRoutes = require("./routes/product");
const customerRoutes = require("./routes/customer");
const authRoutes = require("./routes/auth");
const statsRoutes = require("./routes/stats");
const orderRoutes = require("./routes/order");
const userRoutes = require("./routes/user")
const { verifyToken, isAdmin } = require("./middleware/auth.middleware");

app.use(cors());

app.use(express.json({ limit: '50mb' }));

app.get("/",(req,res)=>{
    res.send("server started");
});

app.use("/category", verifyToken, isAdmin ,categoryRoutes);
app.use("/brand", verifyToken, isAdmin ,brandRoutes);
app.use("/product", verifyToken, isAdmin ,productRoutes);
app.use("/order",verifyToken,isAdmin, orderRoutes)
app.use("/user",verifyToken, isAdmin, userRoutes)
app.use("/stats", verifyToken, isAdmin, statsRoutes);
app.use("/customer", verifyToken,customerRoutes);
app.use("/auth",authRoutes);
app.use("/uploads", express.static("uploads"));



async function connectDb(){
    mongoose.connect("mongodb://localhost:27017",{
        dbName:"e-comm"
    });
    console.log("mongodb connected");
}

connectDb().catch((err)=>{
    console.error(err);
})

app.listen(port,()=>{
    console.log("server started" , port);
})