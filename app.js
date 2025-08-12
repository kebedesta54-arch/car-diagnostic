
// Categories with icons
const categories = [
  { id: "start", label: "הרכב לא מניע", icon: "engine.svg" },
  { id: "engine", label: "מנוע וביצועים", icon: "engine.svg" },
  { id: "temp", label: "התחממות", icon: "temp.svg" },
  { id: "brake", label: "בלמים ורעשים", icon: "brake.svg" },
  { id: "ac", label: "מיזוג וחימום", icon: "ac.svg" },
  { id: "electric", label: "חשמל/אורות", icon: "electric.svg" },
  { id: "smell", label: "ריחות חריגים", icon: "smell.svg" },
  { id: "susp", label: "היגוי/מתלים", icon: "susp.svg" },
  { id: "exhaust", label: "עשן/אגזוז", icon: "exhaust.svg" },
];

const WARNING_LIGHTS = [
  { id: "check", label: "בדוק מנוע" },
  { id: "battery", label: "מצבר/טעינה" },
  { id: "temp", label: "חום מנוע" },
  { id: "oil", label: "שמן" },
  { id: "abs", label: "ABS" },
];

// Questions
const QUESTION_SET = {
  start: [
    { key: "keyTurn", label: "מה קורה בניסיון התנעה?", type: "radio", options: [
      { v: "clicks", l: "נקישות קצרות" },
      { v: "cranks", l: "מסתובב ולא נתפס" },
      { v: "silence", l: "שקט מוחלט" },
    ]},
    { key: "lightsDim", label: "האורות מתעממים כשמניעים?", type: "bool" },
    { key: "immob", label: "נורת אימובילייזר מהבהבת?", type: "bool" },
  ],
  engine: [
    { key: "engineFeel", label: "איך הרכב מרגיש?", type: "radio", options: [
      { v: "jerky", l: "קרטועים/איבוד כוח" },
      { v: "stall", l: "כיבויים בסרק/פניות" },
      { v: "ok", l: "בגדול תקין" },
    ]},
    { key: "consumption", label: "צריכת הדלק עלתה?", type: "bool" },
  ],
  temp: [
    { key: "tempGauge", label: "מד החום", type: "radio", options: [
      { v: "normal", l: "באמצע" }, { v: "high", l: "גבוה" }, { v: "red", l: "באדום" }
    ]},
    { key: "acOn", label: "מחמיר עם מזגן?", type: "bool" },
  ],
  brake: [
    { key: "noiseType", label: "איזה רעש בבלימה?", type: "radio", options: [
      { v: "squeal", l: "צפצוף גבוה" },
      { v: "grind", l: "חריקה/שפשוף" },
      { v: "none", l: "אין" }
    ]},
    { key: "softPedal", label: "דוושה רכה/שוקעת?", type: "bool" },
  ],
  ac: [
    { key: "acBlows", label: "מה יוצא מהפתח?", type: "radio", options: [
      { v: "cold", l: "אוויר קר" }, { v: "warm", l: "אוויר חם" }, { v: "weak", l: "זרימה חלשה" }
    ]},
    { key: "strangeSmell", label: "ריח טחב/עובש?", type: "bool" },
  ],
  electric: [
    { key: "bulbs", label: "איזה רכיב תקול?", type: "checkbox", options: [
      { v: "head", l: "פנס ראשי" }, { v: "turn", l: "איתות" }, { v: "win", l: "מגבים" }, { v: "horn", l: "צופר" }
    ]},
  ],
  smell: [
    { key: "smellFuel", label: "ריח חזק של דלק?", type: "bool" },
    { key: "smellSweet", label: "ריח מתוק (נוזל קירור)?", type: "bool" },
    { key: "burning", label: "ריח שרוף/פלסטיק?", type: "bool" },
  ],
  susp: [
    { key: "vibration", label: "רטט בהגה מעל 90 קמ\"ש?", type: "bool" },
    { key: "pull", label: "הרכב מושך לצד?", type: "bool" },
  ],
  exhaust: [
    { key: "smoke", label: "עשן מהאגזוז?", type: "radio", options: [
      { v: "blue", l: "כחלחל" }, { v: "white", l: "לבן" }, { v: "black", l: "שחור" }, { v: "none", l: "אין" }
    ]},
  ],
};

// Rules knowledge base (expanded)
const RULES = [
  { id:"no-start-clicking", when:a=>a.category==="start" && a.keyTurn==="clicks" && a.lightsDim===true,
    result:{issue:"מצבר חלש/גמור", severity:3, tips:["כבה צרכנים (אורות/מזגן)","נסה הנעה עם כבלים"],
    actions:["בדיקת מתח מצבר וטעינה","בדיקת אלטרנטור"], estCostNIS:[200,700]} },
  { id:"no-start-silence", when:a=>a.category==="start" && a.keyTurn==="silence" && !a.immob,
    result:{issue:"סטרטר/ממסר התנעה", severity:4, tips:["בדוק קוטבי מצבר"], actions:["בדיקת סטרטר/ממסר"], estCostNIS:[800,2200]} },
  { id:"no-start-immob", when:a=>a.category==="start" && a.immob===true,
    result:{issue:"אימובילייזר/מפתח – זיהוי נכשל", severity:2, tips:["נסה מפתח חלופי","החלף סוללת שלט"], actions:["סנכרון מפתח/בדיקת אימובילייזר"], estCostNIS:[150,800]} },

  { id:"engine-misfire", when:a=>a.category==="engine" && a.engineFeel==="jerky" && (a.warningLights||[]).includes("check"),
    result:{issue:"מיספייר – סליל/מצת/מזרק", severity:3, tips:["הימנע מעומס גבוה"], actions:["סריקת OBD, בדיקת קוילים/מצתים"], estCostNIS:[400,1400]} },
  { id:"engine-stall", when:a=>a.category==="engine" && a.engineFeel==="stall",
    result:{issue:"שסתום סרק/מצערת מלוכלכת", severity:2, tips:["כבה/הפעל, בדוק עומס חשמלי"], actions:["ניקוי מצערת/IAC"], estCostNIS:[300,900]} },
  { id:"engine-low-power", when:a=>a.category==="engine" && a.engineFeel==="jerky" && a.consumption===true,
    result:{issue:"מסנן אוויר/דלק סתום", severity:2, tips:["בדוק היסטוריית טיפולים"], actions:["החלפת מסננים"], estCostNIS:[150,400]} },

  { id:"overheat", when:a=>(a.category==="temp" && a.tempGauge==="red") || (a.warningLights||[]).includes("temp"),
    result:{issue:"התחממות מנוע", severity:5, tips:["עצור מיד וכבה מנוע","אל תפתח מכסה רדיאטור חם"],
    actions:["בדיקת נזילות/תרמוסטט/מאוורר/משאבת מים"], estCostNIS:[300,2500]} },

  { id:"brake-squeal", when:a=>a.category==="brake" && a.noiseType==="squeal",
    result:{issue:"רפידות שחוקות", severity:4, tips:["הימנע מנהיגה מאומצת"], actions:["החלפת רפידות/חריטת דיסקים"], estCostNIS:[500,1500]} },
  { id:"brake-grind", when:a=>a.category==="brake" && a.noiseType==="grind",
    result:{issue:"שחיקת דיסקים עד מתכת", severity:5, tips:["עצור נסיעה"], actions:["החלפת דיסקים ורפידות בדחיפות"], estCostNIS:[900,2800]} },
  { id:"brake-soft", when:a=>a.category==="brake" && a.softPedal===true,
    result:{issue:"נזילת נוזל/אוויר במערכת", severity:5, tips:["אל תמשיך בנסיעה"], actions:["גרירה למוסך, בדיקת קווים/משאבה"], estCostNIS:[600,2200]} },

  { id:"ac-warm", when:a=>a.category==="ac" && a.acBlows==="warm",
    result:{issue:"חוסר גז/דליפה", severity:2, tips:["בדוק מסנן תא נוסעים"], actions:["מילוי גז ובדיקת דליפות"], estCostNIS:[350,900]} },
  { id:"ac-weak", when:a=>a.category==="ac" && a.acBlows==="weak",
    result:{issue:"מפוח/מסנן סתום", severity:2, tips:["בדוק מסנן"], actions:["החלפת מסנן/בדיקת מפוח"], estCostNIS:[150,700]} },

  { id:"battery-light", when:a=>(a.warningLights||[]).includes("battery"),
    result:{issue:"בעיית טעינה – אלטרנטור/ווסת", severity:4, tips:["כבו צרכנים"], actions:["בדיקת טעינה, החלפה לפי הצורך"], estCostNIS:[600,2500]} },

  { id:"fuel-smell", when:a=>a.category==="smell" && a.smellFuel===true,
    result:{issue:"דליפת דלק/מכסה מיכל רופף", severity:4, tips:["הימנע ממקורות אש"], actions:["בדיקת קווי דלק/מסנן/מכסה"], estCostNIS:[250,1200]} },
  { id:"coolant-smell", when:a=>a.category==="smell" && a.smellSweet===true,
    result:{issue:"נזילת קירור – רדיאטור/צינור/תא חימום", severity:4, tips:["בדוק מפלס מים כשהמנוע קר"], actions:["איתור נזילה ותיקון"], estCostNIS:[300,1500]} },
  { id:"burning-smell", when:a=>a.category==="smell" && a.burning===true,
    result:{issue:"חיווט/מצמד מתחמם/בלמים גרורים", severity:5, tips:["עצור לבדיקה"], actions:["בדיקה חשמלית/מצמד/קאליפרים"], estCostNIS:[300,2500]} },

  { id:"steering-vibration", when:a=>a.category==="susp" && a.vibration===true,
    result:{issue:"איזון גלגלים/כיוון פרונט/בושינגים", severity:3, tips:["בדוק לחץ אוויר"], actions:["איזון/כיוון/בדיקת מתלים"], estCostNIS:[200,900]} },
  { id:"pulling", when:a=>a.category==="susp" && a.pull===true,
    result:{issue:"כיוון פרונט/לחצים לא אחידים/בלם תפוס", severity:3, tips:["בדוק לחצים"], actions:["כיוון פרונט ובדיקת בלמים"], estCostNIS:[200,700]} },

  { id:"smoke-blue", when:a=>a.category==="exhaust" && a.smoke==="blue",
    result:{issue:"שריפת שמן – טבעות/שסתומים", severity:4, tips:["בדוק צריכת שמן"], actions:["בדיקת דחיסה/תיקון מנוע"], estCostNIS:[1200,6000]} },
  { id:"smoke-white", when:a=>a.category==="exhaust" && a.smoke==="white",
    result:{issue:"חדירת מים – אטם ראש/קירור", severity:5, tips:["הפסק נסיעה והיוועץ במוסך"], actions:["בדיקת CO בנוזל/אטם ראש"], estCostNIS:[1500,8000]} },
  { id:"smoke-black", when:a=>a.category==="exhaust" && a.smoke==="black",
    result:{issue:"תערובת עשירה – MAP/MAF/מזרקים", severity:3, tips:["סריקת תקלות"], actions:["ניקוי/החלפת חיישן/בדיקת מזרקים"], estCostNIS:[400,1600]} },
];

// State
const state = { step: 1, answers: { category: null, warningLights: [], year: "", model: "", notes: "" }, results: [] };

// Helpers
const $ = sel => document.querySelector(sel);
function byId(id){ return document.getElementById(id); }

function renderYears(){
  const year = byId("year");
  year.innerHTML = '<option value="">בחר/י</option>' + Array.from({length:20},(_,i)=>{
    const y = new Date().getFullYear() - i; return `<option>${y}</option>`;
  }).join("");
}
function updateCrumbs(){
  ["p1","p2","p3"].forEach((id,i)=>{
    const el = byId(id); if(i+1===state.step) el.classList.add("active"); else el.classList.remove("active");
  });
}
function renderCategories(){
  const host = byId("category-list");
  host.innerHTML = categories.map(c=>{
    const active = state.answers.category===c.id ? "active":"";
    return `<button data-id="${c.id}" class="${active}"><span><img src="./assets/${c.icon}" alt="" width="18" height="18"> ${c.label}</span><span>›</span></button>`;
  }).join("");
  host.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{
    state.answers.category = btn.getAttribute("data-id");
    renderCategories(); renderQuestions();
  }));
}
function renderWarningLights(){
  const host = byId("warning-lights");
  host.innerHTML = WARNING_LIGHTS.map(w=>{
    const checked = state.answers.warningLights.includes(w.id) ? "checked":"";
    return `<label><input type="checkbox" data-id="${w.id}" ${checked}/> ${w.label}</label>`;
  }).join("");
  host.querySelectorAll("input[type=checkbox]").forEach(ch=>ch.addEventListener("change",()=>{
    const id = ch.getAttribute("data-id");
    const set = new Set(state.answers.warningLights);
    ch.checked ? set.add(id) : set.delete(id);
    state.answers.warningLights = Array.from(set);
  }));
}
function renderQuestions(){
  const host = byId("question-set");
  host.innerHTML = "";
  const set = QUESTION_SET[state.answers.category] || [];
  set.forEach(q=>{
    const wrap = document.createElement("div"); wrap.className="q";
    wrap.innerHTML = `<div class="field"><div class="bold">${q.label}</div></div>`;
    if(q.type==="radio"){
      q.options.forEach(opt=>{
        const row = document.createElement("label"); row.className="check";
        row.innerHTML = `<input type="radio" name="${q.key}" value="${opt.v}"> ${opt.l}`;
        row.querySelector("input").addEventListener("change",()=>{ state.answers[q.key] = opt.v; });
        wrap.appendChild(row);
      });
    }
    if(q.type==="bool"){
      ["כן","לא"].forEach(v=>{
        const row = document.createElement("label"); row.className="check";
        const bool = v==="כן";
        row.innerHTML = `<input type="radio" name="${q.key}" value="${bool}"> ${v}`;
        row.querySelector("input").addEventListener("change",()=>{ state.answers[q.key] = bool; });
        wrap.appendChild(row);
      });
    }
    if(q.type==="checkbox"){
      q.options.forEach(opt=>{
        const row = document.createElement("label"); row.className="check";
        row.innerHTML = `<input type="checkbox" data-key="${q.key}" value="${opt.v}"> ${opt.l}`;
        row.querySelector("input").addEventListener("change",(e)=>{
          const set = new Set(state.answers[q.key]||[]);
          e.target.checked ? set.add(opt.v) : set.delete(opt.v);
          state.answers[q.key] = Array.from(set);
        });
        wrap.appendChild(row);
      });
    }
    if(q.type==="text"){
      const ta = document.createElement("textarea"); ta.placeholder = "כתוב/י כאן";
      ta.addEventListener("input",()=>{ state.answers[q.key] = ta.value; });
      wrap.appendChild(ta);
    }
    host.appendChild(wrap);
  });
}
function evaluate(answers){
  const hits = RULES.filter(r=>{ try { return r.when(answers) } catch(e){ return false; } }).map(r=>r.result);
  if(!hits.length) return [];
  return hits.map((h,i)=>({ ...h, confidence: +(1 - i*0.08).toFixed(2) })).sort((a,b)=>b.confidence-a.confidence);
}
function badgeClass(sev){ if(sev>=5) return "badge bad"; if(sev>=4) return "badge warn"; if(sev>=3) return "badge"; return "badge ok"; }
function warningLabel(id){ const m={check:"בדוק מנוע",battery:"מצבר/טעינה",temp:"חום מנוע",oil:"שמן",abs:"ABS"}; return m[id]||id; }
function categoryLabel(id){ const m={start:"הרכב לא מניע",engine:"מנוע וביצועים",temp:"התחממות",brake:"בלמים",ac:"מיזוג",electric:"חשמל",smell:"ריחות",susp:"היגוי/מתלים",exhaust:"אגזוז"}; return m[id]||id; }
function systemSummary(results){
  return results.map((r,i)=>`• ${i+1}. ${r.issue} — דחיפות ${r.severity}/5, ודאות ~${Math.round(r.confidence*100)}%
פעולות: ${r.actions.join("; ")}`).join("\n");
}
function buildSummary(answers, results){
  const parts = [];
  parts.push(`סיכום אבחון תקלת רכב`);
  if(answers.model||answers.year) parts.push(`רכב: ${answers.model||""} ${answers.year||""}`);
  if(answers.category) parts.push(`קטגוריה: ${categoryLabel(answers.category)}`);
  if(answers.warningLights?.length) parts.push(`נורות אזהרה: ${answers.warningLights.map(w=>warningLabel(w)).join(", ")}`);
  if(answers.notes) parts.push(`הערות: ${answers.notes}`);
  if(results?.length){ parts.push("\nאבחנות משוערות:"); parts.push(systemSummary(results)); }
  parts.push("\nהערה: ההמלצות אינן תחליף לבדיקה מקצועית.");
  return parts.join("\n");
}
function renderResults(){
  const host = byId("results");
  const results = evaluate(state.answers);
  state.results = results;
  if(!results.length){
    host.innerHTML = `<div class="hint">לא נמצאה אבחנה חד-משמעית. מומלץ סריקת OBD ותיאור מפורט במוסך.</div>`;
  }else{
    host.innerHTML = results.slice(0,4).map((r,i)=>`
      <div class="result">
        <div><strong>אבחנה משוערת #${i+1}: ${r.issue}</strong></div>
        <div class="badges">
          <span class="${badgeClass(r.severity)}">דחיפות ${r.severity}/5</span>
          <span class="badge">ודאות ${Math.round(r.confidence*100)}%</span>
          <span class="badge">עלות ₪${r.estCostNIS[0]}–${r.estCostNIS[1]}</span>
        </div>
        <div><strong>טיפים:</strong> ${r.tips.join("; ")}</div>
        <div><strong>פעולות:</strong> ${r.actions.join("; ")}</div>
      </div>
    `).join("");
  }
  byId("summary").value = buildSummary(state.answers, results);
}

// Wizard
function updateStepUI(){
  document.querySelectorAll(".step").forEach(s=>s.classList.remove("active"));
  byId(`step${state.step}`).classList.add("active");
  updateCrumbs();
  byId("prev").disabled = state.step===1;
  byId("next").textContent = state.step===3 ? "אבחון חדש" : "הבא";
}
function next(){
  if(state.step===1){
    if(!state.answers.category){ alert("בחר/י קטגוריה כדי להמשיך"); return; }
    state.step=2;
  }else if(state.step===2){
    state.answers.notes = byId("notes").value;
    state.step=3; renderResults();
  }else{
    state.step=1;
    state.answers = { category:null, warningLights:[], year:"", model:"", notes:"" };
    state.results = []; byId("summary").value="";
    renderCategories(); renderWarningLights(); renderQuestions();
  }
  updateStepUI();
}
function prev(){ if(state.step>1){ state.step--; updateStepUI(); } }

function init(){
  renderYears(); updateCrumbs(); renderCategories(); renderWarningLights(); renderQuestions();
  byId("year").addEventListener("change",e=> state.answers.year = e.target.value);
  byId("model").addEventListener("input",e=> state.answers.model = e.target.value);
  byId("severity").addEventListener("input",e=> state.answers.severityUser = +e.target.value);
  byId("notes").addEventListener("input",e=> state.answers.notes = e.target.value);
  byId("prev").addEventListener("click", prev);
  byId("next").addEventListener("click", next);
  byId("copy").addEventListener("click",()=>{ navigator.clipboard.writeText(byId("summary").value); alert("הסיכום הועתק"); });
  byId("download").addEventListener("click",()=>{
    const text = byId("summary").value; const blob = new Blob([text], {type:"text/plain;charset=utf-8"});
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href=url;a.download="car-diagnostic-summary.txt";a.click(); setTimeout(()=>URL.revokeObjectURL(url), 1000);
  });
  byId("print").addEventListener("click",()=>{
    const w = window.open("","_blank"); if(!w) return;
    w.document.write(`<pre style="white-space:pre-wrap;font-family:Heebo,system-ui">${byId("summary").value.replace(/</g,"&lt;")}</pre>`);
    w.document.close(); w.print();
  });
  byId("whatsapp").addEventListener("click",()=>{
    const url = `https://wa.me/?text=${encodeURIComponent(byId("summary").value)}`; window.open(url,"_blank");
  });
  byId("email").addEventListener("click",()=>{
    const url = `mailto:?subject=${encodeURIComponent("סיכום אבחון רכב")}&body=${encodeURIComponent(byId("summary").value)}`; window.location.href=url;
  });
}
document.addEventListener("DOMContentLoaded", init);
