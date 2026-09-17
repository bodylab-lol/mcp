# Tools

Generated from [`tools.json`](tools.json) by `node scripts/render-tools.mjs`. Every tool returns structured content matching its `outputSchema` in `tools.json`, plus the same JSON as text. Every tool is read-only except where it says it writes, and a tool is only available when the athlete allowed its scope.

Quantities are SI with the unit in the field name (`durationS`, `distanceM`, `weightKg`, `avgPowerW`); dates like `2026-09-13` are days on the athlete's calendar; instants are ISO-8601 UTC.

## `get_today` — Today's session

The session Body Lab prescribes for today and tomorrow, with the reasons behind it (each citing the metric that drove it), alternatives in other sports, what's already been done today, sessions the athlete committed to, this morning's readiness, the nearest A event's name, date, days until and taper/event-day/recovery phase, and its preparation phase — Base, Build, Specific (often called Peak) or Taper, an emphasis recomputed each morning, not a plan — and anything the athlete told Body Lab about today — being ill, sore or injured, short on time, or away from their equipment or sports, or the altitude they confirmed they're at today — which the session already respects, plus any return window after an illness or injury was cleared. Start here when the athlete asks what to do, whether to train or rest, why the plan says what it does, or how a race is affecting the plan. Endurance targets are heart-rate (bpm) and power (watts) ranges; strength sessions list sets, reps, weight (kg) and reps in reserve.

Scope: `training:read`. Read-only.

_No arguments._

## `get_week` — The week ahead

A projection of the next seven days, today first: for each day the kind of session (rest, easy, long/build, quality, strength), the sport and roughly how long, which day is the long one, when strength follows a session, planned volume cuts, and whether a taper, event day, post-event recovery or recovery week shapes it, with any illness or injury it assumes is still active. Each day carries its preparation phase too (Base, Build, Specific — often called Peak — or Taper): an emphasis recomputed each morning from the A event's date, not a plan. Today and tomorrow match get_today; later days are outlines with no targets. It is not a plan: each day is decided that morning from how training and recovery actually went, so always pass on the `note` and the assumptions. Use for 'what does my week look like', 'when's my long day', or planning around rest days and a race.

Scope: `training:read`. Read-only.

_No arguments._

## `get_weekly_review` — How the week went

A review of one finished week (Monday to Sunday on the athlete's calendar; only complete weeks). The sessions the athlete committed to (planned, exported or sent to a device) against what was done: as prescribed, differently (fewer intervals, less work at target, another sport), skipped, or done without a recording to measure, judged in the metric each workout targeted, with any illness, injury or short day that explains it. Where the acute:chronic ratio and chronic load sat and moved; the strength floor with the count; what the athlete reported. For the most recent week, also what changes in the next seven days and why, as a projection, and what the training so far supports for an A event in the next eight weeks, from rules Body Lab already applies, not a prediction. Omit `week` for the most recent week. Use for 'how did my week go', 'did I do what was planned' or 'am I on track for my race'. Pass the sentences on as written; they cite their numbers.

Scope: `training:read`. Read-only.

| Argument | Type | |
| --- | --- | --- |
| `week` | string (optional) | Any day in the week to review, e.g. from previousWeek. Omit for the most recent complete week. |

## `get_training_status` — Training status

Where the athlete's training stands: fitness (CTL), fatigue (ATL), form, acute:chronic workload ratio and ramp rate; monotony and strain, with the athlete's own strain high and whether this week is above it; the easy/moderate/hard split; strength and impact frequency; readiness; the current training block; the nearest A event's name, days until and taper/event-day/recovery phase, if one is set, and the preparation phase the run-up to it is in (Base, Build, Specific — often called Peak — or Taper), which is an emphasis worked out daily from the event's date rather than a plan — plus load, fitness and fatigue week by week across the window. Use for 'how's my training going', 'am I overdoing it', or comparing recent weeks.

Scope: `training:read`. Read-only.

| Argument | Type | |
| --- | --- | --- |
| `days` | integer (optional) | How many days back from today to cover. min 28, max 365, default 90 |

## `list_activities` — Activities

The athlete's activities, newest first, 25 per page: recorded and typed-in sessions and strength workouts, with sport, start time, duration (s), distance (m) and training load. Use get_activity with an id for the detail of one.

Scope: `training:read`. Read-only.

| Argument | Type | |
| --- | --- | --- |
| `page` | integer (optional) | min 1, max 200, default 1 |
| `type` | string (optional) | Only this sport. |

## `get_activity` — One activity

One activity in detail: duration, distance, elevation, heart rate, power, session RPE, notes, the training load and where it came from, time in each heart-rate zone, power bests (the best average watts over each duration within this activity; after intervals a longer duration's best can be higher than a shorter one's, because the longer window spans two efforts and the shorter can hold only one plus recovery), how it compared with the planned session (if there was one), and the strength sets logged against it.

Scope: `training:read`. Read-only.

| Argument | Type | |
| --- | --- | --- |
| `id` | string | An activity id from list_activities or get_today. |

## `get_recovery` — Recovery readings

Morning recovery readings by day, newest first: resting heart rate (bpm), overnight HRV (ms, RMSSD), sleep score and a device energy score (both 0–100). Days without readings are absent. Use for sleep, HRV or 'how recovered am I' questions; get_today already includes today's readiness verdict.

Scope: `training:read`. Read-only.

| Argument | Type | |
| --- | --- | --- |
| `days` | integer (optional) | How many days back from today. min 7, max 365, default 28 |

## `get_strength` — Strength training

The strength session Body Lab would prescribe now (exercises, sets, reps, weights in kg, reps in reserve, and why each weight moved or held), estimated one-rep maxes, and the most recent logged strength sessions set by set.

Scope: `training:read`. Read-only.

| Argument | Type | |
| --- | --- | --- |
| `recentSessions` | integer (optional) | How many recent sessions to include. min 1, max 20, default 5 |

## `get_profile` — Athlete profile

The athlete's profile: sports, strength equipment (which decides the exercises a strength session names), training focus (endurance, or strength as much as endurance, which sets the strength floor at two or three sessions a week), whether the athlete has left jumps out of strength sessions, time zone, display units, heart-rate anchors (max, resting, threshold — each saying whether it was entered, estimated or observed), FTP, weight; dated test results (FTP, VO2max, threshold HR); and the power curve, recent and all-time.

Scope: `training:read`. Read-only.

_No arguments._

## `find_exercises` — Exercise catalogue

Body Lab's strength exercise catalogue, optionally filtered by a word in the name or by movement pattern (squat, hinge, lunge, horizontal_push, vertical_pull…).

Scope: `training:read`. Read-only.

| Argument | Type | |
| --- | --- | --- |
| `query` | string (optional) | A word to match in the exercise name, e.g. 'squat'. |
| `movementPattern` | string (optional) |  |

## `suggest_routes` — Routes for today

Routes the athlete has done before that fit today's prescribed endurance sessions, grouped by start area and sport, with duration, distance, climbing, how often they've been done and why each fits. Only sports with a prescribed session today and a route history appear.

Scope: `training:read`. Read-only.

| Argument | Type | |
| --- | --- | --- |
| `modality` | string (optional) | Only this sport, e.g. road_biking or running. |

## `get_lab_results` — Lab results

The athlete's blood test results as entered from lab reports. Each marker over time: the latest value against the lab's range and flag and any guideline limit (naming its source and population), whether the change since the last comparable draw is beyond the marker's normal variation, and how loudly to raise it (`tier`, `message`). Each draw: date, lab, results as printed, and the conditions that decide whether draws compare. Pass `message` on word for word, and never call a value safe, healthy or optimal. Lab results never change the training Body Lab prescribes, and this isn't a diagnosis. Use for 'how's my ferritin', 'what did my last blood test show', or to check what's already recorded before recording more.

Scope: `labs:read`. Read-only.

| Argument | Type | |
| --- | --- | --- |
| `marker` | string (optional) | Only this marker's key (e.g. ferritin, ldl_c), and only draws that include it. Omit for everything. |

## `record_lab_results` — Record lab results

Records one blood draw and its results from a lab report the athlete gives you (a PDF, a photo, or values they type), exactly as printed. Before calling, read every marker, value, unit and range back to the athlete and get their yes: this can't edit or delete anything afterwards; only the athlete can, in Body Lab on the web. One call per draw date. Use `marker` keys from the list in its description; for a marker not listed, leave `marker` out and give `name` as printed. It's all or nothing: if any result is refused (an unknown key, a unit Body Lab doesn't recognise for that marker, a marker already recorded for a draw on that date, a range whose ends are reversed) nothing is saved, and the error lists each problem so you can fix it and call again. Returns the draw as saved.

Scope: `labs:write`. Writes: adds data, and can't change or delete it.

| Argument | Type | |
| --- | --- | --- |
| `localDate` | string | The day the blood was drawn (collected) on the athlete's calendar, YYYY-MM-DD — not the day the report was issued. |
| `collectedTime` | string or null (optional) | The collection time, HH:MM on the athlete's clock. Only if the athlete told you or the report says; leave out rather than guess. default null |
| `labName` | string or null (optional) | The lab's name, as the report prints it. default null |
| `fastingHours` | number or null (optional) | Hours since the athlete last ate before the draw. Only if the athlete told you or the report says; leave out rather than guess. default null |
| `recentIllness` | boolean or null (optional) | Whether the athlete was ill in the days before. Only if the athlete told you or the report says; leave out rather than guess. default null |
| `ironSupplement10d` | boolean or null (optional) | Iron by mouth or infusion in the 10 days before. Only if the athlete told you or the report says; leave out rather than guess. default null |
| `biotin` | boolean or null (optional) | Biotin taken before the draw. Only if the athlete told you or the report says; leave out rather than guess. default null |
| `creatine` | boolean or null (optional) | Creatine taken before the draw. Only if the athlete told you or the report says; leave out rather than guess. default null |
| `hormoneMedication` | boolean or null (optional) | Thyroid or sex-hormone medication, hormonal contraception included. Only if the athlete told you or the report says; leave out rather than guess. default null |
| `menstruating` | boolean or null (optional) | true: has a current menstrual cycle; false: no current cycle. Only if the athlete told you or the report says; leave out rather than guess. default null |
| `cycleDay` | integer or null (optional) | Day of the cycle, only with menstruating true. Only if the athlete told you or the report says; leave out rather than guess. default null |
| `altitudeM` | number or null (optional) | The altitude the athlete lived at, metres. Only if the athlete told you or the report says; leave out rather than guess. default null |
| `results` | array | Every result on the report to record, each once. at least 1, at most 100 |
| `results[].marker` | string (optional) | Body Lab's key for the marker. Known keys, each with the units Body Lab recognises for it (µ may be written u, and µg mcg): ferritin (Ferritin): ng/mL, µg/L; iron (Iron (serum)): µg/dL, µmol/L; transferrin (Transferrin): mg/dL, g/L; tibc (Total iron-binding capacity (TIBC)): µg/dL, µmol/L; transferrin_saturation (Transferrin saturation): %; haemoglobin (Haemoglobin): g/dL, g/L; haematocrit (Haematocrit): %, L/L; red_cells (Red blood cells): 10^6/µL, 10^12/L; mcv (Mean cell volume (MCV)): fL; mch (Mean cell haemoglobin (MCH)): pg; mchc (Mean cell haemoglobin concentration (MCHC)): g/dL, g/L; white_cells (White blood cells): 10^3/µL, 10^9/L; platelets (Platelets): 10^3/µL, 10^9/L; rdw (Red cell distribution width (RDW)): %; mpv (Mean platelet volume (MPV)): fL; neutrophils_pct (Neutrophils (%)): %; neutrophils_abs (Neutrophils (absolute)): 10^3/µL, 10^9/L, cells/µL; lymphocytes_pct (Lymphocytes (%)): %; lymphocytes_abs (Lymphocytes (absolute)): 10^3/µL, 10^9/L, cells/µL; monocytes_pct (Monocytes (%)): %; monocytes_abs (Monocytes (absolute)): 10^3/µL, 10^9/L, cells/µL; eosinophils_pct (Eosinophils (%)): %; eosinophils_abs (Eosinophils (absolute)): 10^3/µL, 10^9/L, cells/µL; basophils_pct (Basophils (%)): %; basophils_abs (Basophils (absolute)): 10^3/µL, 10^9/L, cells/µL; immature_granulocytes_pct (Immature granulocytes (%)): %; immature_granulocytes_abs (Immature granulocytes (absolute)): 10^3/µL, 10^9/L, cells/µL; nrbc_pct (Nucleated red blood cells (%)): %, /100 WBC; nrbc_abs (Nucleated red blood cells (absolute)): 10^3/µL, 10^9/L, cells/µL; total_cholesterol (Total cholesterol): mg/dL, mmol/L; ldl_c (LDL cholesterol): mg/dL, mmol/L; hdl_c (HDL cholesterol): mg/dL, mmol/L; non_hdl_c (Non-HDL cholesterol): mg/dL, mmol/L; triglycerides (Triglycerides): mg/dL, mmol/L; vldl_c (VLDL cholesterol): mg/dL, mmol/L; chol_hdl_ratio (Cholesterol/HDL ratio): ratio; ldl_hdl_ratio (LDL/HDL ratio): ratio; chol_hdl_risk (Cholesterol/HDL risk): ratio; ldl_hdl_risk (LDL/HDL risk): ratio; apob (Apolipoprotein B (ApoB)): mg/dL, g/L; lpa (Lipoprotein(a)): mg/dL, nmol/L; hba1c (HbA1c): %, mmol/mol; glucose (Glucose): mg/dL, mmol/L; tsh (TSH): mIU/L, µIU/mL; free_t4 (Free T4): ng/dL, pmol/L; free_t3 (Free T3): pg/mL, pmol/L; testosterone (Testosterone (total)): ng/dL, nmol/L; free_testosterone (Free testosterone): pg/mL, pmol/L; shbg (SHBG): nmol/L; oestradiol (Oestradiol): pg/mL, pmol/L; cortisol (Cortisol): µg/dL, nmol/L; insulin (Insulin): µIU/mL, pmol/L; creatinine (Creatinine): mg/dL, µmol/L; egfr (eGFR): mL/min/1.73m²; urea_nitrogen (Urea nitrogen (BUN)): mg/dL, mmol/L; cystatin_c (Cystatin C): mg/L; alt (ALT): U/L; ast (AST): U/L; ggt (GGT): U/L; ck (Creatine kinase (CK)): U/L; alp (Alkaline phosphatase (ALP)): U/L, IU/L; total_bilirubin (Total bilirubin): mg/dL, µmol/L; total_protein (Total protein): g/dL, g/L; albumin (Albumin): g/dL, g/L; sodium (Sodium): mmol/L, mEq/L; potassium (Potassium): mmol/L, mEq/L; chloride (Chloride): mmol/L, mEq/L; total_co2 (Carbon dioxide, total (CO2)): mmol/L, mEq/L; anion_gap (Anion gap): mmol/L, mEq/L; calcium (Calcium): mg/dL, mmol/L; hs_crp (hs-CRP): mg/L, mg/dL; crp (CRP): mg/L, mg/dL; vitamin_d (Vitamin D (25-OH)): ng/mL, nmol/L; vitamin_b12 (Vitamin B12): pg/mL, pmol/L; folate (Folate): ng/mL, nmol/L; magnesium (Magnesium (serum)): mg/dL, mmol/L; omega3_index (Omega-3 index): %. A ratio and the "risk" line a report prints beside it are separate markers, each recorded as printed. For a marker not on this list, leave marker out and give `name`. |
| `results[].name` | string (optional) | The marker's name exactly as the report prints it. Needed only when `marker` is left out; a name that matches a known marker is recorded as that marker. |
| `results[].value` | number | The number as printed, without any "<" or ">": 0.5 for "<0.5". |
| `results[].comparator` | string or null (optional) | For a result printed like "<0.5" or ">=90": the sign. Leave out for a plain number. default null |
| `results[].unit` | string | The unit exactly as the report prints it. For a ratio, or the "risk" line beside one, printed without a unit: "ratio". |
| `results[].rangeLow` | number or null (optional) | The low end of the lab's own reference range, as printed. Leave out if the report gives none. default null |
| `results[].rangeHigh` | number or null (optional) | The high end of the lab's reference range, as printed. default null |
| `results[].rangeText` | string or null (optional) | The range as printed when it isn't two numbers, e.g. "<200" or "Negative". default null |
| `results[].labFlag` | string or null (optional) | The flag the lab printed beside the result (H, L, critical, …), if any. default null |
| `results[].method` | string or null (optional) | A method the report names for this result, such as the LDL or eGFR equation. default null |
| `results[].assay` | string or null (optional) | An assay the report names for this result. default null |

# Prompts

- **`todays-session`** — What should I do today?: Today's prescribed session, why Body Lab chose it, and the alternatives.
- **`weekly-review`** — Review my week: How the last week of training went against what was prescribed, and what changes next.

# Server instructions

```
Body Lab is the athlete's training app: it reads their training load and morning recovery signals and prescribes one session a day (endurance with heart-rate and power targets, or strength with sets, reps and weights), citing the metric behind each call.

- Body Lab's prescription and rationale are the source of truth for what the athlete should do; explain them rather than substituting your own plan, and say so when you disagree.
- Quantities are SI with the unit in the field name (durationS seconds, distanceM metres, weightKg, avgPowerW). Convert to the athlete's display units (`units`: metric or imperial) when talking to them.
- Dates like 2026-09-13 are days on the athlete's own calendar; instants are ISO-8601 UTC. get_today returns today's date and the athlete's time zone.
- Training load is on Body Lab's calibrated scale; CTL is fitness, ATL fatigue, form = CTL − ATL, ACWR the acute:chronic ratio.
- This is training guidance, not medical advice.
```
