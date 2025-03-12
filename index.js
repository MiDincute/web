const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

mongoose.connect('mongodb+srv://Midin:myduyen1908@cluster0.gycv8rg.mongodb.net/flowerShop?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Kết nối MongoDB Atlas thành công'))
    .catch(err => console.error('Lỗi kết nối MongoDB:', err));

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: String,
});
const Product = mongoose.model('Product', productSchema);

app.use('/images', express.static('D:/images'));
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

app.set('view engine', 'ejs');

const products = [
    { _id: '1', name: 'Hoa Tulip', price: 700000, description: 'Hoa tulip là loài hoa nổi bật với vẻ đẹp thanh lịch, cánh hoa mịn màng. Tulip tượng trưng cho tình yêu, sự sang trọng và niềm hạnh phúc.', image: '/images/Tulip.jpg' },
    { _id: '2', name: 'Hoa Oải Hương', price: 500000, description: 'Loài hoa có hương thơm đặc trưng, màu tím nhẹ nhàng và mang ý nghĩa tượng trưng cho sự bình yên, thư giãn và tình yêu chung thủy.', image: '/images/hoaoaihuong.jpg' },
    { _id: '3', name: 'Hoa Hướng Dương', price: 300000, description: 'Loài hoa này tượng trưng cho sức mạnh, sự lạc quan và niềm tin vào tương lai.', image: '/images/hoahuongduong.jpg' },
    { _id: '4', name: 'Hoa Baby', price: 400000, description: 'Loài hoa nhỏ xinh với những chùm hoa li ti màu trắng hoặc hồng, tượng trưng cho sự thuần khiết, tình yêu vĩnh cửu và vẻ đẹp mong manh.', image: '/images/hoababy.jpg' },
];

app.get('/', (req, res) => {
    res.render('index', { products });
});

app.get('/product/:id', (req, res) => {
    const product = products.find(p => p._id === req.params.id);
    if (product) {
        res.render('product', { product });
    } else {
        res.send('Sản phẩm không tồn tại');
    }
});

app.post('/cart/add', (req, res) => {
    if (!req.session.cart) req.session.cart = [];
    const product = products.find(p => p._id === req.body.productId);
    if (product) {
        req.session.cart.push(product);
    }
    res.redirect('/cart');
});
app.get('/cart/remove/:id', (req, res) => {
    if (req.session.cart) {
        req.session.cart = req.session.cart.filter(item => item._id.toString() !== req.params.id);
    }
    res.redirect('/cart');
});


app.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    res.render('cart', { cart, totalPrice });
});

const PORT = 2000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});