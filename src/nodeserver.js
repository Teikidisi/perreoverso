import express from "express";
import { createClient } from "@supabase/supabase-js";
import env from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import compression from "compression";

env.config();

const supabaseUrl = "https://fmjvfztmpxupfifftygz.supabase.co";
const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

const app = express();
app.use(compression());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/public/javascripts")));

app.use(morgan("dev"));

app.set("views", path.join(__dirname, "/public/views"));
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/songs", async (req, res) => {
  let { data: fetchedSongs, error } = await supabase
    .from("Canciones")
    .select("cancion_id,Nombre,AlbumPic,Autor(autor_id,Nombre)");
  if (error) return console.log(error);
  let organizedSongs = fetchedSongs.map((song) => {
    let artistas = [];
    artistas = song.Autor.map((data) => {
      return {
        idAutor: data.autor_id,
        NombreAutor: data.Nombre,
      };
    });

    return {
      cancion_id: song.cancion_id,
      Nombre: song.Nombre,
      Autor: artistas,
      AlbumPic: song.AlbumPic,
    };
  });
  res.json(organizedSongs);
});

app.get("/authors", async (req, res) => {
  let { data: fetchedAuthors, error } = await supabase
    .from("Autor")
    .select("autor_id,Nombre,Foto");
  if (error) return console.log(error);
  res.json(fetchedAuthors);
});

app.get("/song_song_relations", async (req, res) => {
  let { data: relations, error } = await supabase
    .from("ReferenciasCancion")
    .select("id,AudioSource,IDSource,IDTarget,Verso,isSongReference");
  if (error) return console.log(error);
  res.json(relations);
});

app.get("/artist_relations", async (req, res) => {
  let { data: relation, error } = await supabase
    .from("IntraArtistasRelacion")
    .select("id,ArtistaSource,ArtistaTarget,Relacion");
  if (error) return console.log(error);
  res.json(relation);
});

app.get("/song_artist_relations", async (req, res) => {
  let { data: relations, error } = await supabase
    .from("ReferenciasCancion_Artista")
    .select("id,AudioSource,IDSource,IDTarget,Verso,isSongReference");
  if (error) return console.log(error);
  res.json(relations);
});

app.get("/author_group_relations", async (req, res) => {
  let { data: relations, error } = await supabase
    .from("Relacion_Autor_Grupo")
    .select("*");
  if (error) return console.log(error);
  res.json(relations);
});

app.get("/author_song_relations", async (req, res) => {
  let { data: relations, error } = await supabase
    .from("ReferenciasAutor_Cancion")
    .select("*");
  if (error) return console.log(error);
  const formattedData = relations.map((link) => {
    return {
      id: link.id,
      IDSource: link.IDAutor,
      IDTarget: link.IDCancion,
      isSongReference: link.isSongReference,
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
