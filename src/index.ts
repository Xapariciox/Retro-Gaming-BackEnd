import http from 'http';
import createDebug from 'debug';
import { app } from './app.js';
import { dbConnect } from './db-connect/db.connect.js';
import { CustomError } from './interfaces/error.js';
import { Product } from './entities/product.js';
const debug = createDebug('retro-back');

const port = process.env.PORT || 4000;
const server = http.createServer(app);
server.on('listening', () => {
    const addr = server.address();
    if (addr === null) return;
    let bind: string;
    if (typeof addr === 'string') {
        bind = 'pipe ' + addr;
    } else {
        bind =
            addr.address === '::'
                ? `http://localhost:${addr?.port}`
                : `port ${addr?.port}`;
    }
    debug(`Listening on ${bind}`);
});

server.on('error', (error: CustomError, response: http.ServerResponse) => {
    response.statusCode = error?.statusCode;
    response.statusMessage = error?.statusMessage;
    response.write(error.message);
    response.end();
});
// Product.insertMany([
//     {
//         name: 'Anbernic RG353M',
//         image: 'https://qaertkfiexqbipykmprt.supabase.co/storage/v1/object/public/img/imagesProducts/Anbernic%20RG353M.jpg',
//         date: '',
//         description: '',
//         stock: 75,
//         brand: 'anbernic',
//         price: 35,
//         category: 'console',
//     },
//     {
//         name: 'Console Portatil Sup Game Box Plus',
//         image: 'https://qaertkfiexqbipykmprt.supabase.co/storage/v1/object/public/img/imagesProducts/CP%20Sup%20Game%20Box%20Plus%20400.jpg',
//         date: '',
//         description: '',
//         stock: 300,
//         brand: 'sup',
//         price: 20,
//         category: 'console',
//     },
//     {
//         name: 'Mini console retro of 620 games',
//         image: 'https://qaertkfiexqbipykmprt.supabase.co/storage/v1/object/public/img/imagesProducts/Mini%20consola%20retro%20de%20620%20juegos%20.jpg',
//         date: '',
//         description: '',
//         stock: 15,
//         brand: 'undefined',
//         price: 10,
//         category: 'console',
//     },
//     {
//         name: 'Nintendo 3DS - Color Azul Aqua',
//         image: 'https://qaertkfiexqbipykmprt.supabase.co/storage/v1/object/public/img/imagesProducts/Nintendo%203DS%20-%20Color%20Azul%20Aqua.jpg',
//         date: '',
//         description: '',
//         stock: 400,
//         brand: 'nintendo',
//         price: 120,
//         category: 'console',
//     },
//     {
//         name: 'Nintendo Wii White',
//         image: 'https://qaertkfiexqbipykmprt.supabase.co/storage/v1/object/public/img/imagesProducts/Nintendo%20Wii%20Console%20(White).jpg',
//         date: '',
//         description: '',
//         stock: 95,
//         brand: 'nintendo',
//         price: 125.5,
//         category: 'console',
//     },
//     {
//         name: 'PlayStation 3 Console 500 GB',
//         image: 'https://qaertkfiexqbipykmprt.supabase.co/storage/v1/object/public/img/imagesProducts/PlayStation%203%20-%20Consola%20500%20GB.jpg',
//         date: '',
//         description: '',
//         stock: 150,
//         brand: 'sony',
//         price: 155.5,
//         category: 'console',
//     },
//     {
//         name: 'Playstation 2 Silver Slim',
//         image: 'https://qaertkfiexqbipykmprt.supabase.co/storage/v1/object/public/img/imagesProducts/Anbernic%20RG351V%20Consola%20Retro%20Portatil%20con%20Wifi.jpg',
//         date: '',
//         description: '',
//         stock: 49,
//         brand: 'sony',
//         price: 75,
//         category: 'console',
//     },
//     {
//         name: 'Retroid Handheld Pocket Game Console',
//         image: 'https://qaertkfiexqbipykmprt.supabase.co/storage/v1/object/public/img/imagesProducts/Retroid%20Consola%20de%20juegos%20de%20bolsillo%20de%20mano%20(1).jpg',
//         date: '',
//         description: '',
//         stock: 402,
//         brand: 'undefined',
//         price: 26,
//         category: 'console',
//     },
//     {
//         name: 'Ds Super Mario 64',
//         image: 'https://qaertkfiexqbipykmprt.supabase.co/storage/v1/object/public/img/imagesProducts/Super%20Mario%2064.jpg',
//         date: '',
//         description: '',
//         stock: 99,
//         brand: 'nintendo',
//         price: 20,
//         category: 'game',
//     },
//     {
//         name: 'Thumbs Up Retro Mini Arcade Machine',
//         image: 'https://qaertkfiexqbipykmprt.supabase.co/storage/v1/object/public/img/imagesProducts/Thumbs%20Up!-%20Retro%20Mini%20Arcade%20Machine.jpg',
//         date: '',
//         description: '',
//         stock: 15,
//         brand: 'undefined',
//         price: 16,
//         category: 'console',
//     },
//     {
//         name: 'gameboy advance orange',
//         image: 'https://qaertkfiexqbipykmprt.supabase.co/storage/v1/object/public/img/imagesProducts/gameboy%20advance.jpg',
//         date: '',
//         description: '',
//         stock: 55,
//         brand: 'nintendo',
//         price: 36,
//         category: 'console',
//     },
// ]);
dbConnect()
    .then((mongoose) => {
        debug('DB:', mongoose.connection.db.databaseName);
        server.listen(port);
    })
    .catch((error) => server.emit(error));
