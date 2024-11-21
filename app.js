const express = require("express");
const gameRouter = require('./routes/gameRouter.js');
const cors = require("cors");

/*
BD: Character={id, name, contour_id}
    Contour={id, x1, y1, x2, y2, x3, y3, x4, y4 }
    Score={ user_name, time }
    GameImage={img, public_id, resource_type}

Procesamiento de rutas:
1-checkValidity((x,y), radious, characterSelected): 
  Si(el punto no hitteo nada) => le erraste
  Si(el punto hitteo pero no es el caracter que corresponde) => le pegaste a algo pero no es el caracter indicado
  Else => return true
2-guardarUsuarioGanador(time, userName) => guardar el usuario ganador con su tiempo
3-retornarScores => [(user, time), ..()]
4-getGame => img, charactersName,
*/

require("dotenv").config();

var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors());

app.use('/', gameRouter);

const PORT = process.env.PORT || 3000;
app.listen( PORT, () => console.log(`App running on PORT ${PORT}`));
