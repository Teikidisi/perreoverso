const server = "http://localhost:3000";

async function getDataFromURL(urlAddress) {
  const response = await fetch(`${server}/${urlAddress}`);
  const fetchedData = await response.json();
  return fetchedData;
}

async function retrieveInfo() {
  [
    songs,
    authors,
    songRelations,
    songArtistRelations,
    authorSongRelations,
    authorGroupRelations,
  ] = await Promise.all([
    getDataFromURL("songs"),
    getDataFromURL("authors"),
    getDataFromURL("song_song_relations"),
    getDataFromURL("song_artist_relations"),
    getDataFromURL("author_song_relations"),
    getDataFromURL("author_group_relations"),
  ]);
}

retrieveInfo().then(() => {
  const [nodes, links] = initialDataSetup(
    songs,
    authors,
    songRelations,
    songArtistRelations,
    authorSongRelations,
    authorGroupRelations
  );

  console.log(links);

  const preparedNodes = prepareNodes(nodes);

  createGraph(preparedNodes, links);
  console.log(preparedNodes);
});

function initialDataSetup(
  songs,
  authors,
  songRelations,
  songArtistRelations,
  authorSongRelations,
  authorGroupRelations
) {
  const modifiedIDSongs = songs.map((song) => {
    return {
      ...song,
      cancion_id: "c" + song.cancion_id,
    };
  });
  const modifiedIDAuthors = authors.map((author) => {
    return {
      ...author,
      autor_id: "a" + author.autor_id,
    };
  });
  const modifiedIDSongLinks = songRelations.map((relation) => {
    return {
      ...relation,
      IDSource: "c" + relation.IDSource,
      IDTarget: "c" + relation.IDTarget,
    };
  });
  const modifiedIDSongAuthorLinks = songArtistRelations.map((relation) => {
    return {
      ...relation,
      IDSource: "c" + relation.IDSource,
      IDTarget: "a" + relation.IDTarget,
    };
  });
  const modifiedIDAuthorSongLinks = authorSongRelations.map((relation) => {
    return {
      ...relation,
      IDSource: "a" + relation.IDSource,
      IDTarget: "c" + relation.IDTarget,
    };
  });
  const modifiedIDAuthorGroupLinks = authorGroupRelations.map((relation) => {
    return {
      ...relation,
      IDSource: "a" + relation.IDSource,
      IDTarget: "a" + relation.IDTarget,
    };
  });

  const referencedAuthors = modifiedIDAuthors.filter((author) => {
    return modifiedIDSongAuthorLinks.find((link) => {
      return link.IDTarget === author.autor_id;
    });
  });

  const formattedAuthorsforSongNodes = referencedAuthors.map((author) => {
    return {
      cancion_id: author.autor_id,
      Nombre: author.Nombre,
      Autor: null,
      AlbumPic: author.Foto,
    };
  });
  const joinedNodes = modifiedIDSongs.concat(formattedAuthorsforSongNodes);
  const joinedLinks = modifiedIDSongLinks.concat(
    modifiedIDSongAuthorLinks,
    //modifiedIDAuthorSongLinks,
    modifiedIDAuthorGroupLinks
  );
  return [joinedNodes, joinedLinks];
}

function prepareNodes(nodes) {
  return (preparedNodes = nodes.map((node) => {
    const img = new Image();
    if (node.cancion_id.includes("c")) {
      img.src = `/images/albums/${node.AlbumPic}`;
    } else {
      img.src = `/images/artistas/${node.AlbumPic}`;
    }
    let autorString = "";
    if (node.Autor != null) {
      for (let i = 0; i < node.Autor.length; i++) {
        autorString += node.Autor[i].NombreAutor;
        if (i != node.Autor.length - 1) {
          autorString += ", ";
        }
      }
    }

    return {
      pic: img,
      id: node.cancion_id,
      name: node.Nombre,
      autor: autorString,
    };
  }));
}

function createGraph(nodes, links) {
  const gData = {
    nodes: nodes,
    links: links,
  };

  const Graph = ForceGraph()(document.getElementById("graph"))
    .graphData(gData)
    .width(window.innerWidth)
    .height(window.innerHeight / 1.2)
    .nodeId("id")
    .linkSource("IDSource")
    .linkTarget("IDTarget")
    .nodeRelSize(143)
    .nodeLabel("name")
    .nodeCanvasObject((node, ctx) => {
      if (node.id.includes("c")) {
        ctx.fillStyle = "#f3f3f2";
      } else {
        ctx.fillStyle = "#fd3c2e";
      }
      const size = 12;
      const imgSize = 226;
      let width = 286;
      let height = 375;
      let radius = 30;
      ctx.lineWidth = 3;
      //roundedImage(node.x, node.y, 266, 355, 30, 3);
      ctx.beginPath();
      ctx.moveTo(node.x + radius - width / 2, node.y - height / 2);
      ctx.arcTo(
        node.x + width / 2,
        node.y - height / 2,
        node.x + width / 2,
        node.y - height / 2 + radius,
        radius
      );
      ctx.lineTo(node.x + width / 2, node.y + height / 2 - radius);
      ctx.arcTo(
        node.x + width / 2,
        node.y + height / 2,
        node.x + width / 2 - radius,
        node.y + height / 2,
        radius
      );
      ctx.lineTo(node.x + radius - width / 2, node.y + height / 2);
      ctx.arcTo(
        node.x - width / 2,
        node.y + height / 2,
        node.x - width / 2,
        node.y + height / 2 - radius,
        radius
      );
      ctx.lineTo(node.x - width / 2, node.y + radius - height / 2);
      ctx.arcTo(
        node.x - width / 2,
        node.y - height / 2,
        node.x + radius - width / 2,
        node.y - height / 2,
        radius
      );
      ctx.stroke();
      ctx.fill();
      ctx.save();
      //roundedImage(node.x + 30, node.y + 90, imgSize, imgSize, 15);
      let = imgWidth = imgSize;
      let imgHheight = imgSize;
      let startX = node.x + 30 - width / 2;
      let startY = node.y + 80 - height / 2;
      ctx.beginPath();
      ctx.moveTo(startX + radius, startY);
      ctx.arcTo(
        startX + imgWidth,
        startY,
        startX + imgWidth,
        startY + radius,
        radius
      );
      ctx.lineTo(startX + imgWidth, startY + imgHheight - radius);
      ctx.arcTo(
        startX + imgWidth,
        startY + imgHheight,
        startX + imgWidth - radius,
        startY + imgHheight,
        radius
      );
      ctx.lineTo(startX + radius, startY + imgHheight);
      ctx.arcTo(
        startX,
        startY + imgHheight,
        startX,
        startY + imgHheight - radius,
        radius
      );
      ctx.lineTo(startX, startY + radius);
      ctx.arcTo(startX, startY, startX + radius, startY, radius);
      ctx.stroke();
      ctx.clip();
      ctx.drawImage(
        node.pic,
        node.x + 30 - width / 2,
        node.y + 80 - height / 2,
        imgSize,
        imgSize
      );
      ctx.restore();
      ctx.fillStyle = "black";
      ctx.textBaseline = "hanging";
      ctx.font = 'bold 48px "Poppins"';
      ctx.textAlign = "center";
      ctx.fillText(
        node.name,
        node.x + 143 - width / 2,
        node.y + 30 - height / 2,
        246
      );
      ctx.fillStyle = "black";
      ctx.font = "italic 16px Poppins";
      ctx.textAlign = "left";

      let lines = getLines(ctx, node.autor, 261);
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(
          lines[i],
          node.x + 13 - width / 2,
          node.y - height / 2 + 315 + 20 * i,
          261
        );
      }
    })
    .nodePointerAreaPaint((node, color, ctx) => {
      const size = 226;
      ctx.fillStyle = color;
      ctx.fillRect(node.x - 286 / 2, node.y - 375 / 2, 286, 375); // draw square as pointer trap
    })
    .linkDirectionalArrowLength(100)
    .linkDirectionalArrowRelPos(0.95)
    .linkLabel("Verso")
    .linkColor((link) => {
      if (link.isSongReference) {
        return "#a8c6e2";
      } else if (!link.isSongReference && link.IDTarget.includes("c")) {
        return "#FF8077";
      } else {
        return "#fd3c2e";
      }
    })
    // .linkCanvasObject()
    .linkWidth(5);

  Graph.d3Force("link")
    .distance((l) => {
      if (l.isSongReference) {
        return 1000;
      } else {
        return 1000;
      }
    })
    .strength();
  Graph.d3Force("charge").strength(-5000);
  Graph.d3Force("collide", d3.forceCollide().radius(210));
  Graph.d3Force("center", d3.forceCenter(0, 0));
  console.log(Graph.nodeRelSize());
  Graph.d3Force("box", () => {
    const X_SQUARE_HALF_SIDE = 8000;
    const X_SQUARE_HALF_SIDE_NEGATIVE = -8000;

    const Y_SQUARE_HALF_SIDE = 8000;
    const Y_SQUARE_HALF_SIDE_NEGATIVE = -8000;

    nodes.forEach((node) => {
      const x = node.x;
      const y = node.y;

      if (x > X_SQUARE_HALF_SIDE) node.x = X_SQUARE_HALF_SIDE - 1;
      if (x < X_SQUARE_HALF_SIDE_NEGATIVE)
        node.x = X_SQUARE_HALF_SIDE_NEGATIVE + 1;
      if (y > Y_SQUARE_HALF_SIDE) node.y = Y_SQUARE_HALF_SIDE - 1;
      if (y < Y_SQUARE_HALF_SIDE_NEGATIVE)
        node.y = Y_SQUARE_HALF_SIDE_NEGATIVE + 1;
    });
  });

  Graph.zoom(1 / (nodes.length / 5), 1000);
}
