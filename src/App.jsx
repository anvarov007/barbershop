import { useState, useMemo } from "react";

// ====== Sayt sozlamalari ======
const SITE = {
  name: "BarberGid",
  slogan: "Toshkentdagi barbershoplar katalogi",
  adminTelegram: "barbergid_admin", // @ belgisisiz — egalar shu yerga yozadi
};

const DISTRICTS = [
  "Chilonzor", "Yunusobod", "Mirzo Ulug'bek", "Sergeli", "Yakkasaroy",
  "Shayxontohur", "Olmazor", "Yashnobod", "Uchtepa", "Mirobod",
];

// ============================================================
//  HAQIQIY MA'LUMOTLAR SHU YERGA YOZILADI
//  Har bir barbershop shunday ko'rinishda bo'ladi:
//  {
//    name: "Barbershop nomi",
//    owner: "Ega ismi",
//    phone: "+998 90 123 45 67",
//    district: "Chilonzor",           // DISTRICTS ichidagilardan biri
//    address: "Bunyodkor ko'chasi 12",
//    hours: "10:00 – 22:00",
//    img: "https://.../rasm.jpg",     // bo'sh qoldirsa rangli fon chiqadi
//    telegram: "username",            // ixtiyoriy
//  }
//  Ro'yxat to'ldirilgach, pastdagi namunalarni (SAMPLE) o'chirib tashlang.
// ============================================================
const REAL = [];

// ---- NAMUNA ma'lumotlar (faqat ko'rinishni tekshirish uchun) ----
const SAMPLE = Array.from({ length: 50 }, (_, i) => {
  const n = i + 1;
  return {
    name: `Namuna Barbershop ${n}`,
    owner: "Ega ismi kiritilmagan",
    phone: `+998 00 000 00 ${String(n).padStart(2, "0")}`,
    district: DISTRICTS[i % DISTRICTS.length],
    address: "Manzil kiritilmagan",
    hours: "10:00 – 22:00",
    img: "",
    telegram: "",
    sample: true,
  };
});

const SHOPS = [...REAL, ...(REAL.length >= 50 ? [] : SAMPLE)].map((s, i) => ({ id: i + 1, ...s }));
const PAGE = 12;

const CSS = `
:root {
  --bg: #0d0d10; --bg-alt: #141418; --card: #1a1a20; --border: #2b2b34;
  --text: #f3f3f6; --muted: #9b9bab; --accent: #d4a24c; --accent-2: #f0c982;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  background: var(--bg); color: var(--text); line-height: 1.6;
  display: block !important; place-items: unset !important;
}
#root { max-width: none !important; margin: 0 !important; padding: 0 !important; text-align: left !important; width: 100% !important; }
a { color: var(--accent-2); text-decoration: none; }
.container { width: min(1150px, 92%); margin: 0 auto; }
.container.narrow { width: min(560px, 92%); }

.header { position: sticky; top: 0; z-index: 10; background: rgba(13,13,16,.92); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); }
.nav { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; }
.logo { font-weight: 800; font-size: 1.25rem; color: var(--accent); }
.nav nav { display: flex; gap: 18px; flex-wrap: wrap; }
.nav nav a { color: var(--text); font-size: .95rem; }
.nav nav a:hover { color: var(--accent); }

.hero { text-align: center; padding: 90px 0 70px;
  background: radial-gradient(circle at 50% 0%, rgba(212,162,76,.2), transparent 60%),
              repeating-linear-gradient(45deg, #111116 0 16px, #0e0e12 16px 32px); }
.hero h1 { font-size: clamp(2.2rem, 6vw, 4rem); color: var(--accent); }
.hero p { color: var(--muted); font-size: 1.2rem; margin: 10px 0 26px; }

.btn { display: inline-block; background: var(--accent); color: #1a1303; padding: 11px 22px; border-radius: 10px;
  font-weight: 700; font-size: 1rem; border: 2px solid var(--accent); cursor: pointer; transition: transform .15s, opacity .15s; font-family: inherit; }
.btn:hover { transform: translateY(-2px); opacity: .92; }
.btn-ghost { background: transparent; color: var(--text); border-color: #3b3b48; }
.btn-sm { padding: 8px 14px; font-size: .88rem; }

.section { padding: 60px 0; }
.section.alt { background: var(--bg-alt); }
.section h2 { font-size: 1.8rem; margin-bottom: 14px; }
.muted { color: var(--muted); }
.small { font-size: .9rem; }

.filters { display: grid; grid-template-columns: 2fr 1fr; gap: 12px; margin: 18px 0 8px; padding: 16px;
  background: var(--card); border: 1px solid var(--border); border-radius: 14px; }
.filters input, .filters select, .form input, .form textarea {
  width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 11px 12px;
  color: var(--text); font-size: 1rem; font-family: inherit; }
.filters input:focus, .filters select:focus, .form input:focus, .form textarea:focus { outline: 2px solid var(--accent); border-color: transparent; }
.count { margin: 14px 0 4px; color: var(--muted); }
.notice { margin: 14px 0; padding: 12px 16px; border: 1px dashed var(--accent); border-radius: 10px; color: var(--accent-2); font-size: .92rem; }

.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; margin-top: 14px; }
.card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
.shop { display: flex; flex-direction: column; transition: transform .15s, border-color .15s; }
.shop:hover { transform: translateY(-4px); border-color: #45455a; }
.photo { height: 150px; display: grid; place-items: center; font-size: 3rem; background: linear-gradient(135deg, #2a2113, #3b2f19); background-size: cover; background-position: center; }
.photo.has-img { font-size: 0; }
.body { padding: 16px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
.body h3 { font-size: 1.05rem; }
.row { color: var(--muted); font-size: .9rem; }
.row b { color: var(--text); font-weight: 600; }
.actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: auto; padding-top: 10px; }
.empty { padding: 40px; text-align: center; color: var(--muted); border: 1px dashed var(--border); border-radius: 14px; margin-top: 14px; }
.more { text-align: center; margin-top: 28px; }

.form { display: flex; flex-direction: column; gap: 14px; padding: 24px; }
.form label { display: flex; flex-direction: column; gap: 6px; font-size: .95rem; color: var(--muted); }
.form textarea { resize: vertical; min-height: 70px; }

.footer { text-align: center; padding: 26px 0; color: var(--muted); border-top: 1px solid var(--border); }

@media (max-width: 600px) {
  .nav { flex-direction: column; gap: 8px; }
  .filters { grid-template-columns: 1fr; }
  .hero { padding: 65px 0 50px; }
}
`;

const telHref = (p) => `tel:${p.replace(/[^\d+]/g, "")}`;

function Shop({ s }) {
  const map = `https://yandex.com/maps/?text=${encodeURIComponent(`Toshkent, ${s.district}, ${s.address}`)}`;
  return (
    <article className="card shop">
      <div className={`photo ${s.img ? "has-img" : ""}`} style={s.img ? { backgroundImage: `url(${s.img})` } : undefined}>
        {!s.img && "✂️"}
      </div>
      <div className="body">
        <h3>{s.name}</h3>
        <div className="row">📍 <b>{s.district}</b>, {s.address}</div>
        <div className="row">👤 Ega: {s.owner}</div>
        <div className="row">🕘 {s.hours}</div>
        <div className="row">📞 <a href={telHref(s.phone)}>{s.phone}</a></div>
        <div className="actions">
          <a className="btn btn-sm" href={telHref(s.phone)}>Qo'ng'iroq</a>
          <a className="btn btn-sm btn-ghost" href={map} target="_blank" rel="noreferrer">Xarita</a>
          {s.telegram && (
            <a className="btn btn-sm btn-ghost" href={`https://t.me/${s.telegram}`} target="_blank" rel="noreferrer">Telegram</a>
          )}
        </div>
      </div>
    </article>
  );
}

function Catalog() {
  const [q, setQ] = useState("");
  const [district, setDistrict] = useState("");
  const [shown, setShown] = useState(PAGE);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return SHOPS.filter(
      (s) =>
        (!district || s.district === district) &&
        (!t || s.name.toLowerCase().includes(t) || s.address.toLowerCase().includes(t) || s.owner.toLowerCase().includes(t))
    );
  }, [q, district]);

  const hasSample = SHOPS.some((s) => s.sample);

  return (
    <section className="section" id="katalog">
      <div className="container">
        <h2>💈 Barbershoplar</h2>

        {hasSample && (
          <div className="notice">
            Diqqat: hozir ko'rinayotgan ma'lumotlar NAMUNA. Haqiqiy barbershoplarni faylning tepasidagi REAL ro'yxatiga qo'shing.
          </div>
        )}

        <div className="filters">
          <input
            placeholder="🔎 Nomi, manzili yoki egasi bo'yicha qidiring"
            value={q}
            onChange={(e) => { setQ(e.target.value); setShown(PAGE); }}
          />
          <select value={district} onChange={(e) => { setDistrict(e.target.value); setShown(PAGE); }}>
            <option value="">Barcha tumanlar</option>
            {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>

        <p className="count">Topildi: {list.length} ta</p>

        {list.length === 0 ? (
          <div className="empty">Hech narsa topilmadi. Qidiruvni o'zgartirib ko'ring.</div>
        ) : (
          <div className="grid">
            {list.slice(0, shown).map((s) => <Shop key={s.id} s={s} />)}
          </div>
        )}

        {shown < list.length && (
          <div className="more">
            <button className="btn btn-ghost" onClick={() => setShown(shown + PAGE)}>
              Ko'proq ko'rsatish ({list.length - shown} ta qoldi)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function AddShop() {
  const [f, setF] = useState({ name: "", owner: "", phone: "", district: "", address: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const text =
      `Katalogga qo'shish so'rovi\nNomi: ${f.name}\nEga: ${f.owner}\nTelefon: ${f.phone}\n` +
      `Tuman: ${f.district}\nManzil: ${f.address}`;
    window.open(`https://t.me/${SITE.adminTelegram}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  return (
    <section className="section alt" id="qoshish">
      <div className="container narrow">
        <h2>➕ Barbershopingizni qo'shing</h2>
        <p className="muted small" style={{ marginBottom: 16 }}>
          Ega o'zi ma'lumot yuborsa, raqam va manzil to'g'ri bo'ladi. Rasmni Telegramda alohida jo'nating.
        </p>
        <form className="card form" onSubmit={submit}>
          <label>Barbershop nomi<input required value={f.name} onChange={set("name")} /></label>
          <label>Ega ismi<input required value={f.owner} onChange={set("owner")} /></label>
          <label>Telefon<input required type="tel" value={f.phone} onChange={set("phone")} placeholder="+998 90 123 45 67" /></label>
          <label>
            Tuman
            <select required value={f.district} onChange={set("district")} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: 11, color: "var(--text)", fontSize: "1rem" }}>
              <option value="">Tanlang</option>
              {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </label>
          <label>Manzil<input required value={f.address} onChange={set("address")} /></label>
          <button className="btn" type="submit">Telegram orqali yuborish</button>
        </form>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <style>{CSS}</style>
      <header className="header">
        <div className="container nav">
          <a href="#top" className="logo">✂️ {SITE.name}</a>
          <nav>
            <a href="#katalog">Katalog</a>
            <a href="#qoshish">Qo'shish</a>
          </nav>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="container">
          <h1>{SITE.name}</h1>
          <p>{SITE.slogan}</p>
          <a className="btn" href="#katalog">Barbershop topish</a>
        </div>
      </section>

      <Catalog />
      <AddShop />
      <footer className="footer">© {new Date().getFullYear()} {SITE.name}</footer>
    </>
  );
}