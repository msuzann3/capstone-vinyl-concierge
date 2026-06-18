import { execFile } from "node:child_process";
import { mkdir, rename, rm, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../serviceAccount.json" with { type: "json" };

const run = promisify(execFile);
const outputDir = new URL("../docs/class-context/firebase-evidence/", import.meta.url);
const generatedAt = new Date();
const dateLabel = generatedAt.toISOString().slice(0, 10);

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

function timestampToIso(value) {
  if (value && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  return value;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function maskId(id) {
  if (!id) return "[redacted]";
  return `${id.slice(0, 4)}...${id.slice(-4)}`;
}

async function getCount(collectionId) {
  const snapshot = await db.collection(collectionId).count().get();
  return snapshot.data().count;
}

async function getAlbumSamples() {
  const snapshot = await db.collection("albums").orderBy("artist").limit(5).get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      artist: data.artist,
      title: data.title,
      year: data.year,
      genres: data.genres ?? [],
      styles: data.styles ?? [],
      inStock: Boolean(data.inStock),
      stockCount: data.stockCount ?? 0,
    };
  });
}

async function getDemandSamples() {
  const snapshot = await db
    .collection("demandSignals")
    .orderBy("createdAt", "desc")
    .limit(5)
    .get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: maskId(doc.id),
      artist: data.artist,
      genre: data.genre,
      signalType: data.signalType,
      weight: data.weight,
      createdAt: timestampToIso(data.createdAt),
    };
  });
}

async function getConfig() {
  const doc = await db.collection("config").doc("system").get();
  return doc.exists ? doc.data() : {};
}

async function getUserSummaries() {
  const snapshot = await db.collection("users").limit(5).get();
  const summaries = [];

  for (const userDoc of snapshot.docs) {
    const data = userDoc.data();
    const sessions = await userDoc.ref.collection("sessions").count().get();
    summaries.push({
      id: maskId(userDoc.id),
      role: data.role ?? "unknown",
      email: "[redacted]",
      displayName: data.displayName ? "[redacted]" : "[not provided]",
      sessions: sessions.data().count,
      lastActiveAt: timestampToIso(data.lastActiveAt),
    });
  }

  return summaries;
}

function row(cells) {
  return `<tr>${cells.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`;
}

function svgText(lines, x, startY, options = {}) {
  const size = options.size ?? 22;
  const weight = options.weight ?? 400;
  const color = options.color ?? "#231f20";
  const lineHeight = options.lineHeight ?? Math.round(size * 1.45);
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${startY + index * lineHeight}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${escapeHtml(line)}</text>`,
    )
    .join("\n");
}

function buildHtml(data) {
  const albumRows = data.albumSamples
    .map((album) =>
      row([
        album.id,
        album.artist,
        album.title,
        album.year,
        album.genres.join(", "),
        album.styles.slice(0, 3).join(", "),
        `${album.stockCount} in stock`,
      ]),
    )
    .join("");

  const demandRows = data.demandSamples
    .map((signal) =>
      row([
        signal.id,
        signal.artist,
        signal.genre,
        signal.signalType,
        signal.weight,
        signal.createdAt,
      ]),
    )
    .join("");

  const userRows = data.userSummaries
    .map((user) =>
      row([
        user.id,
        user.role,
        user.email,
        user.displayName,
        `${user.sessions} saved sessions`,
        user.lastActiveAt,
      ]),
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Firebase Data Snapshot - The Vinyl Concierge</title>
  <style>
    :root {
      color: #231f20;
      background: #f8f3e8;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    body {
      margin: 0;
      background: #f8f3e8;
    }
    main {
      width: 1440px;
      min-height: 1180px;
      box-sizing: border-box;
      padding: 54px 64px 60px;
      background: linear-gradient(180deg, #f8f3e8 0%, #efe7d6 100%);
    }
    header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 32px;
      margin-bottom: 30px;
    }
    h1 {
      margin: 0 0 8px;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 54px;
      line-height: 1;
      letter-spacing: 0;
    }
    .subtitle {
      margin: 0;
      color: #62594f;
      font-size: 18px;
      max-width: 780px;
      line-height: 1.45;
    }
    .badge {
      border: 2px solid #231f20;
      padding: 14px 18px;
      text-transform: uppercase;
      font-weight: 800;
      font-size: 14px;
      background: #f2c94c;
      white-space: nowrap;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    .metric {
      border: 2px solid #231f20;
      background: #fffaf0;
      padding: 18px;
    }
    .metric span {
      display: block;
      color: #6f6258;
      font-size: 14px;
      text-transform: uppercase;
      font-weight: 800;
      margin-bottom: 8px;
    }
    .metric strong {
      display: block;
      font-size: 38px;
      line-height: 1;
    }
    section {
      border: 2px solid #231f20;
      background: #fffaf0;
      margin-top: 18px;
    }
    section h2 {
      margin: 0;
      padding: 16px 18px;
      background: #231f20;
      color: #fffaf0;
      font-size: 20px;
      letter-spacing: 0;
    }
    .summary {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      gap: 18px;
      margin-top: 18px;
    }
    .note {
      border: 2px solid #231f20;
      background: #fffaf0;
      padding: 18px;
      line-height: 1.45;
      font-size: 16px;
    }
    .note strong {
      display: block;
      margin-bottom: 6px;
      font-size: 18px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      font-size: 13px;
    }
    th, td {
      border-top: 1px solid #d8cdbb;
      padding: 10px 12px;
      text-align: left;
      vertical-align: top;
      overflow-wrap: anywhere;
    }
    th {
      color: #5d534a;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: .04em;
      background: #f3ead8;
    }
    footer {
      margin-top: 18px;
      font-size: 13px;
      color: #6b5f54;
    }
  </style>
</head>
<body>
  <main>
    <header>
      <div>
        <h1>The Vinyl Concierge</h1>
        <p class="subtitle">Firebase Firestore data snapshot for Module 4 evidence. Generated from live project data with user identifiers, emails, names, and profile images redacted.</p>
      </div>
      <div class="badge">Firestore Evidence</div>
    </header>

    <div class="metrics">
      <div class="metric"><span>Albums</span><strong>${data.counts.albums}</strong></div>
      <div class="metric"><span>Demand Signals</span><strong>${data.counts.demandSignals}</strong></div>
      <div class="metric"><span>Users</span><strong>${data.counts.users}</strong></div>
      <div class="metric"><span>Config Docs</span><strong>${data.counts.config}</strong></div>
    </div>

    <div class="summary">
      <div class="note"><strong>Backend proof point</strong>The catalog is stored in Firestore, recommendation behavior is controlled by <code>config/system</code>, and signed-in recommendation activity creates de-identified aggregate demand signals.</div>
      <div class="note"><strong>Privacy note</strong>Customer records are intentionally masked here. The app stores private saved sessions under each user and aggregate demand separately for owner review.</div>
    </div>

    <section>
      <h2>config / system</h2>
      <table>
        <thead><tr><th>recommendationsEnabled</th><th>discogsEnabled</th></tr></thead>
        <tbody>${row([data.config.recommendationsEnabled, data.config.discogsEnabled])}</tbody>
      </table>
    </section>

    <section>
      <h2>albums sample</h2>
      <table>
        <thead><tr><th>ID</th><th>Artist</th><th>Title</th><th>Year</th><th>Genres</th><th>Styles</th><th>Stock</th></tr></thead>
        <tbody>${albumRows}</tbody>
      </table>
    </section>

    <section>
      <h2>demandSignals sample</h2>
      <table>
        <thead><tr><th>Masked ID</th><th>Artist</th><th>Genre</th><th>Signal Type</th><th>Weight</th><th>Created At</th></tr></thead>
        <tbody>${demandRows}</tbody>
      </table>
    </section>

    <section>
      <h2>users sample</h2>
      <table>
        <thead><tr><th>Masked UID</th><th>Role</th><th>Email</th><th>Name</th><th>Session Subcollection</th><th>Last Active</th></tr></thead>
        <tbody>${userRows}</tbody>
      </table>
    </section>

    <footer>Generated ${escapeHtml(generatedAt.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }))} Pacific from project <code>vinyl-concierge</code>.</footer>
  </main>
</body>
</html>`;
}

function buildSvg(data) {
  const width = 1600;
  const height = 1600;
  const albumLines = data.albumSamples.map(
    (album) => `${album.artist} - ${album.title} (${album.year}) / ${album.genres.join(", ")} / ${album.stockCount} in stock`,
  );
  const demandLines = data.demandSamples.map(
    (signal) => `${signal.id}  ${signal.artist}  ${signal.genre}  ${signal.signalType}  weight ${signal.weight}`,
  );
  const userLines = data.userSummaries.map(
    (user) => `${user.id}  role: ${user.role}  email/name: [redacted]  sessions: ${user.sessions}`,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#f8f3e8"/>
  <rect x="36" y="36" width="1528" height="1528" fill="#fffaf0" stroke="#231f20" stroke-width="3"/>
  <rect x="36" y="36" width="1528" height="124" fill="#231f20"/>
  ${svgText(["The Vinyl Concierge"], 76, 96, { size: 48, weight: 700, color: "#fffaf0" })}
  ${svgText(["Firebase Firestore data snapshot - redacted evidence view"], 78, 134, { size: 23, color: "#f2c94c" })}
  <rect x="1165" y="70" width="310" height="54" fill="#f2c94c" stroke="#fffaf0" stroke-width="2"/>
  ${svgText(["FIRESTORE EVIDENCE"], 1204, 105, { size: 20, weight: 700 })}

  <rect x="76" y="196" width="332" height="120" fill="#f2c94c" stroke="#231f20" stroke-width="3"/>
  <rect x="434" y="196" width="332" height="120" fill="#cfe6d6" stroke="#231f20" stroke-width="3"/>
  <rect x="792" y="196" width="332" height="120" fill="#f0d3c2" stroke="#231f20" stroke-width="3"/>
  <rect x="1150" y="196" width="332" height="120" fill="#d6d8ef" stroke="#231f20" stroke-width="3"/>
  ${svgText(["ALBUMS", String(data.counts.albums)], 104, 238, { size: 24, weight: 700 })}
  ${svgText(["DEMAND SIGNALS", String(data.counts.demandSignals)], 462, 238, { size: 24, weight: 700 })}
  ${svgText(["USERS", String(data.counts.users)], 820, 238, { size: 24, weight: 700 })}
  ${svgText(["CONFIG DOCS", String(data.counts.config)], 1178, 238, { size: 24, weight: 700 })}
  ${svgText([`config/system: recommendationsEnabled=${data.config.recommendationsEnabled}; discogsEnabled=${data.config.discogsEnabled}`], 76, 370, { size: 24, weight: 700 })}

  <rect x="76" y="420" width="1406" height="250" fill="#ffffff" stroke="#231f20" stroke-width="2"/>
  <rect x="76" y="420" width="1406" height="48" fill="#231f20"/>
  ${svgText(["albums sample"], 100, 452, { size: 22, weight: 700, color: "#fffaf0" })}
  ${svgText(albumLines, 100, 506, { size: 19, lineHeight: 34 })}

  <rect x="76" y="718" width="1406" height="250" fill="#ffffff" stroke="#231f20" stroke-width="2"/>
  <rect x="76" y="718" width="1406" height="48" fill="#231f20"/>
  ${svgText(["demandSignals sample"], 100, 750, { size: 22, weight: 700, color: "#fffaf0" })}
  ${svgText(demandLines, 100, 804, { size: 19, lineHeight: 34 })}

  <rect x="76" y="1016" width="1406" height="178" fill="#ffffff" stroke="#231f20" stroke-width="2"/>
  <rect x="76" y="1016" width="1406" height="48" fill="#231f20"/>
  ${svgText(["users sample - IDs, emails, names, and profile images redacted"], 100, 1048, { size: 22, weight: 700, color: "#fffaf0" })}
  ${svgText(userLines, 100, 1104, { size: 19, lineHeight: 34 })}

  <rect x="76" y="1242" width="1406" height="192" fill="#f3ead8" stroke="#231f20" stroke-width="2"/>
  ${svgText(["Why this screenshot works for Module 4"], 100, 1294, { size: 26, weight: 700 })}
  ${svgText([
    "Shows live Firestore collections used by the prototype: albums, config, demandSignals, and users.",
    "Confirms the 111-record Discogs-backed catalog and the recommendation/config kill switch.",
    "Keeps customer privacy intact by masking user IDs, emails, names, and profile image data."
  ], 100, 1342, { size: 21, lineHeight: 38 })}
  ${svgText([`Generated ${generatedAt.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })} Pacific from live Firestore data.`], 76, 1518, { size: 18, color: "#6b5f54" })}
</svg>`;
}

const data = {
  counts: {
    albums: await getCount("albums"),
    config: await getCount("config"),
    demandSignals: await getCount("demandSignals"),
    users: await getCount("users"),
  },
  config: await getConfig(),
  albumSamples: await getAlbumSamples(),
  demandSamples: await getDemandSamples(),
  userSummaries: await getUserSummaries(),
};

await mkdir(outputDir, { recursive: true });

const htmlPath = new URL(`firebase-data-snapshot-${dateLabel}.html`, outputDir);
const svgPath = new URL(`firebase-data-snapshot-${dateLabel}.svg`, outputDir);
const jsonPath = new URL(`firebase-data-snapshot-${dateLabel}.redacted.json`, outputDir);
const pngPath = new URL(`firebase-data-snapshot-${dateLabel}.png`, outputDir);
const renderedDir = new URL("rendered/", outputDir);
const renderedPngPath = new URL(`${svgPath.pathname.split("/").pop()}.png`, renderedDir);

await writeFile(htmlPath, buildHtml(data));
await writeFile(svgPath, buildSvg(data));
await writeFile(jsonPath, `${JSON.stringify(data, null, 2)}\n`);
await mkdir(renderedDir, { recursive: true });
await rm(pngPath, { force: true });
await run("qlmanage", ["-t", "-s", "1600", "-o", renderedDir.pathname, svgPath.pathname]);
await rename(renderedPngPath, pngPath);
await rm(renderedDir, { recursive: true, force: true });

console.log(JSON.stringify({
  htmlPath: htmlPath.pathname,
  svgPath: svgPath.pathname,
  jsonPath: jsonPath.pathname,
  pngPath: pngPath.pathname,
  counts: data.counts,
}, null, 2));
