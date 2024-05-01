"use strict";

require("core-js/modules/es.promise.js");
var _express = _interopRequireDefault(require("express"));
var _supabaseJs = require("@supabase/supabase-js");
var _dotenv = _interopRequireDefault(require("dotenv"));
var _path = _interopRequireDefault(require("path"));
var _url = require("url");
var _morgan = _interopRequireDefault(require("morgan"));
var _compression = _interopRequireDefault(require("compression"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_dotenv.default.config();
const supabaseUrl = "https://fmjvfztmpxupfifftygz.supabase.co";
const supabase = (0, _supabaseJs.createClient)(supabaseUrl, process.env.SUPABASE_KEY);
const app = (0, _express.default)();
app.use((0, _compression.default)());
const _dirname = _path.default.dirname((0, _url.fileURLToPath)(import.meta.url));
app.use(_express.default.static(_path.default.join(_dirname, "./public")));
app.use(_express.default.static(_path.default.join(_dirname, "./public/javascripts")));
app.use((0, _morgan.default)("dev"));
app.set("views", _path.default.join(_dirname, "./public/views"));
app.set("view engine", "hbs");
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: false
}));
app.get("/songs", async (req, res) => {
  let {
    data: fetchedSongs,
    error
  } = await supabase.from("Canciones").select("cancion_id,Nombre,AlbumPic,Autor(autor_id,Nombre)");
  if (error) return console.log(error);
  let organizedSongs = fetchedSongs.map(song => {
    let artistas = [];
    artistas = song.Autor.map(data => {
      return {
        idAutor: data.autor_id,
        NombreAutor: data.Nombre
      };
    });
    return {
      cancion_id: song.cancion_id,
      Nombre: song.Nombre,
      Autor: artistas,
      AlbumPic: song.AlbumPic
    };
  });
  res.json(organizedSongs);
});
app.get("/authors", async (req, res) => {
  let {
    data: fetchedAuthors,
    error
  } = await supabase.from("Autor").select("autor_id,Nombre,Foto");
  if (error) return console.log(error);
  res.json(fetchedAuthors);
});
app.get("/song_song_relations", async (req, res) => {
  let {
    data: relations,
    error
  } = await supabase.from("ReferenciasCancion").select("id,AudioSource,IDSource,IDTarget,Verso,isSongReference");
  if (error) return console.log(error);
  res.json(relations);
});
app.get("/artist_relations", async (req, res) => {
  let {
    data: relation,
    error
  } = await supabase.from("IntraArtistasRelacion").select("id,ArtistaSource,ArtistaTarget,Relacion");
  if (error) return console.log(error);
  res.json(relation);
});
app.get("/song_artist_relations", async (req, res) => {
  let {
    data: relations,
    error
  } = await supabase.from("ReferenciasCancion_Artista").select("id,AudioSource,IDSource,IDTarget,Verso,isSongReference");
  if (error) return console.log(error);
  res.json(relations);
});
app.get("/author_group_relations", async (req, res) => {
  let {
    data: relations,
    error
  } = await supabase.from("Relacion_Autor_Grupo").select("*");
  if (error) return console.log(error);
  res.json(relations);
});
app.get("/author_song_relations", async (req, res) => {
  let {
    data: relations,
    error
  } = await supabase.from("ReferenciasAutor_Cancion").select("*");
  if (error) return console.log(error);
  const formattedData = relations.map(link => {
    return {
      id: link.id,
      IDSource: link.IDAutor,
      IDTarget: link.IDCancion,
      isSongReference: link.isSongReference
    };
  });
  res.json(formattedData);
});
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/test", async (req, res) => {
  res.send("hello");
});
app.listen(3000, () => {
  return console.log("Server running on port 3000");
});