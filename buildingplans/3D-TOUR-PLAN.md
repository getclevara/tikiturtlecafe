# 3D Walkthrough: ARC of Hilo Culinary Incubator Kitchen

Source: `buildingplans/` permit set, dated Aug 9-10 2026.
Purpose: a simulated tour for the capital campaign pitch deck.

---

## 0. Built. Zero cost.

The walkthrough exists and runs in any browser. No software purchased, no freelancer hired.

- **Live at** `/funding/kitchen-tour/`, embedded in the campaign page at `/funding/#walkthrough`
- **Built with** three.js (MIT, vendored locally at `funding/kitchen-tour/vendor/`)
- **Source** `funding/kitchen-tour/kit.js` (equipment builders) and `app.js` (room, lighting, camera)
- **Weight** 168 draw calls, ~3,000 triangles, 3 textures. Runs at full frame rate on a phone.

What it does:

- Eight-shot guided tour with narration, auto-playing, following a trainee's path through the room
- Free roam: drag to look, WASD to walk the line yourself
- **Equipment tags** toggle: pins the real K101 item numbers onto the equipment in 3D, with occlusion so labels behind walls stay hidden. This is the feature that ties the render back to the consultant's schedule, which is what makes it credible to a funder
- Deep links for the deck: `?shot=line`, `?shot=pass`, `&still=1` to hold a frame. Shot ids are `arrive, store, prep, line, pass, out, wash, room`
- Responsive: holds horizontal framing on phones, respects `prefers-reduced-motion`, `noindex` for a private pitch

Built to the drawings: room is 42′-0″ × 20′-1″ per A03, suspended ceiling and lighting field per A04, equipment placement and the 27-item schedule per K101. Equipment styling is interpretive, not a manufacturer-accurate model of each SKU.

The permission point in section 2 still stands before this goes to funders.

### Openings, as built in the model (corrected against A03)

| # | Opening | Wall | Status |
|---|---|---|---|
| 1 | New double swing door | Exterior long wall, about a third along from the west end | Permitted. Opens onto the new 4½″ concrete landing that ties into the existing sidewalk. Catering crosses to the event center. |
| 2 | New single 42″ door | Interior long wall, west corner | Permitted. To the interior hallway. |
| 3 | Service pass-through | **West end wall** | **Proposed, not permitted.** Cafe POS and front of house are directly on the other side. |

Plan-view schematic: `buildingplans/exports/door-schematic.svg`.

### Note for Andrew Ling (Alluminated)

Owner request to add to the equipment plan: a **service pass-through window in the west end wall**, sized for ready orders to hand directly across to the Cafe POS / front of house on the other side. In the model it is 5′-2″ wide with a 40″ sill, a stainless plating ledge on the kitchen side and a heat-lamp shelf above. It is drawn with a teal marker in the walkthrough so it is never mistaken for permitted work. Placement in the model clears the warewasher and dishtable; the hand sink moved south to suit.

---

## 1. What the plans actually give us

| Item | Value |
|---|---|
| Project | ARC of Hilo Culinary Incubator / Catering Kitchen |
| Address | 1099 Waianuenue Ave, Hilo, HI 96720 (TMK 3-2-3-032:007) |
| Kitchen footprint | 42'-0" x 20'-1" |
| K101 scale | 1/2" = 1'-0" |
| Ceiling | New suspended ceiling with integrated lighting (sheet A04) |
| Scope | Demo non-bearing wall, combine two rooms, add cold storage room, exhaust hood, new double-swing 42" door to the event center |
| Existing building | 9,434 SF, Type VB non-sprinklered, Occupancy A-3 |
| Architect | Aza Summers, AR-3033, azasummers@mac.com, (808) 937-0984 |
| Kitchen consultant | Alluminated Restaurant Concepts, Andrew Ling, (909) 260-1140, andrew@arc808.co |

**Sheet index:** T01 Cover, T02 General Notes, A01 Site + Demo, A02 Exterior Elevations, A03 Kitchen Floor Plan, A04 Reflected Ceiling Plan, K101 Foodservice Equipment Plan.

### The equipment schedule (K101), 27 items with real SKUs

| # | Item | Manufacturer | Model |
|---|---|---|---|
| 1 | Range, gas w/ standard oven | Jade Products | JBR-6-36 |
| 2 | Broiler, under-fired, gas | Jade Products | JB-36 |
| 3 | Griddle, gas | Jade Products | JGT-2436 |
| 4 | Equipment stand, refrigerated | Randell | LPRES1L2-72C4 |
| 5 | Fryer, deep fat, gas | Pitco | SG14S |
| 5 | Fryer dump station | Pitco | SSHBNB55 |
| 6 | Oven, convection, gas (double) | Blodgett | ZEPHAIRE-100-G |
| 7 | Walk-in | | |
| 8 | Freezer, reach-in | Traulsen | G12010 |
| 9 | Refrigerator, reach-in | Traulsen | G20010 |
| 10 | Table, 14ga, back splash | Advance Tabco | KSS-363 |
| 11 | Work table w/ undershelf | Advance Tabco | TFMSU-183 |
| 12 | Hood | | |
| 13-18 | Spare numbers | | |
| 19 | Chef's island | custom | |
| 20 | Custom stainless | custom | |
| 21 | Ingredient bin | Cambro | IBS27148 |
| 22 | Dishtable, 3-compartment sink | Advance Tabco | DTC-3-2020-108L |
| 23 | Warewasher, high temp | CMA Dishmachines | CMA-180-VL TALL |
| 23 | Dishtable, straight | CMA Dishmachines | CR-48 |
| 24 | Hand sink, wall mount | Advance Tabco | 7-PS-63 |
| 25 | Sink, NSF, 2-compartment | Advance Tabco | 9-22-40-18R |
| 26 | Work table w/ undershelf | Advance Tabco | KSS-304 |
| 27 | Shelving, louvered starter | Cambro | CBU18308AV5580, CBU18428AV5580, CBU24608AV5580, EXU24488AV5480 |

Every one of those manufacturers publishes free CAD, Revit and SketchUp models of their SKUs. That means the kitchen can be modeled from actual product geometry, not guesses. This is the difference between a render that reads as real and one that reads as a video game.

---

## 2. Do this first (it can save two weeks of work)

The K101 sheet was drawn in CAD by Alluminated. Foodservice consultants almost universally draw in AutoCAD or Revit with AutoQuotes blocks, and **AutoQuotes blocks are already 3D**. Andrew Ling likely has a model that is 80 percent of the way to a walkthrough already.

Email Andrew Ling and Aza Summers and ask for:

1. The K101 source file (`.dwg` or `.rvt`), and whether the AQ blocks are 3D
2. The architectural model or DWG backgrounds for A03 and A04
3. Written permission to use the drawings for fundraising visualization

Point 3 is not optional. K101 carries an explicit copyright notice: the design and drawings are the property of Alluminated Restaurant Concepts and may not be reused or reproduced without their permission. You are the client, so this is a routine ask, but get it in writing before anything goes into a deck that goes to funders.

If they hand over a 3D DWG or RVT, skip straight to section 4 (rendering). If they only have 2D, section 3 applies.

---

## 3. Assets already prepared for you

I converted the sheets in `buildingplans/exports/`:

- `K101-equipment-plan.svg` / `.png`
- `A03-floor-plan.svg` / `.png`
- `A04-reflected-ceiling.svg` / `.png`
- `A02-elevations.svg` / `.png`
- `equipment-schedule.png` (the 27-item schedule, cropped and readable)

The **SVG files are true vector linework**, not pictures of drawings. That matters: SketchUp, Blender and Illustrator all import SVG as real geometry, so walls can be traced or push-pulled directly on the consultant's own lines instead of eyeballed from a screenshot. Scale on import using the known 42'-0" overall dimension as the reference.

---

## 4. Software: the recommendation

### Recommended path: SketchUp + Twinmotion

**Twinmotion is free for organizations under $1M in revenue.** No trial limit, no watermark, full commercial use. It is built on Unreal Engine 5, and it does exactly what a pitch deck needs: cinematic walkthrough video, stills, and 360 panoramas from a dropped-in CAD model. For a nonprofit capital campaign this is the single best cost-to-quality ratio available, and it is the reason I am not recommending you start by paying anyone.

The pairing:

| Stage | Tool | Cost |
|---|---|---|
| Model the shell and millwork | SketchUp Pro (imports DWG + SVG) | $359/yr, 7-day trial |
| Equipment geometry | Manufacturer CAD downloads + 3D Warehouse | free |
| Lighting, materials, camera, video | Twinmotion | free under $1M revenue |

**Alternative if you want higher polish for the same money:** D5 Render, $360/yr Pro, better path-traced reflections, which matters a lot in a room that is almost entirely stainless steel. Twinmotion is easier; D5 looks better on metal. Either is defensible.

**Free-only path:** Blender. Genuinely capable of better output than both, and it imports SVG natively, but it is the steepest learning curve of the three. Only worth it if someone on the team already knows it.

### Skip these

Consumer floor-plan tools (RoomSketcher, Planner 5D, Floorplanner, Space Designer 3D) come up first in every search. They are built for residential interiors and their catalogs have no commercial foodservice equipment. You would end up with a kitchen full of home appliances, which will read as fake to exactly the people evaluating a commercial kitchen grant.

AI floor-plan-to-3D tools (ArchiVinci, Vizcraft, Artificial Studio) are fine for a quick mood image, but they hallucinate geometry and cannot honor an equipment schedule. Do not use them for anything a funder might treat as a representation of what gets built.

### If you hire it out

Current market rates:

- Freelance stills: $300 to $1,200 each; studio stills $800 to $2,500
- Walkthrough animation: roughly $2,000 to $15,000 per finished minute, with a typical 60-second piece landing at $4,000 to $8,000

A realistic pitch-deck package (4 hero stills plus a 45-second flythrough) runs about $3,000 to $6,000 from a good freelancer. Hand them the `exports/` folder and the SKU list above and the quote drops, because the modeling brief is already done.

C&T Design and similar foodservice dealers also produce Revit-based kitchen walkthroughs as part of an equipment package. Worth a call: if you are buying equipment through a dealer, the visualization is sometimes bundled.

---

## 5. Design skills that decide whether it looks great

Software is the easy half. These are what separate a convincing tour from an obvious render:

1. **Lighting.** The single biggest factor. A04 gives you the actual fixture layout in the suspended ceiling, so use it. Model those fixtures, add a warm key from the pass-through to the event center, and let the stainless catch it. Flat ambient lighting is what makes renders look cheap.
2. **Stainless steel materials.** This room is mostly metal. Brushed anisotropic reflection, slight surface variation, and a real environment to reflect. Mirror-perfect chrome is the giveaway of an amateur render.
3. **Camera choreography.** Slow, low, human-height moves at walking pace. No drone swoops, no fast dollies. Roughly 6 to 8 seconds per shot.
4. **Set dressing.** An empty kitchen photographs as a warehouse. Add ingredient bins on the shelving (item 21 is literally in the schedule), pots on the rack, cutting boards on the chef's island, a sheet pan in motion. Five percent more clutter buys fifty percent more believability.
5. **People.** For this project specifically, the tour has to show trainees working, not just equipment. That is the whole pitch.
6. **Post.** Slight color grade, subtle depth of field, ambient kitchen sound. Twinmotion and D5 both export straight to a file you can grade.

---

## 6. Suggested tour narrative

The deck is not selling a kitchen. It is selling a culinary incubator and workforce training pipeline. Structure the tour around the path a trainee takes, not around the floor plan:

1. **Arrive.** Exterior, the new double-swing doors, the connection to the event center (sheet A02 gives you the elevation)
2. **Receive and store.** Walk-in (7), the louvered Cambro shelving wall (27), ingredient bins (21)
3. **Prep.** Chef's island (19), work tables (11, 26), 2-compartment sink (25)
4. **The line.** The hot side: range (1), broiler (2), griddle (3), fryers (5), double convection oven (6), under the hood (12). This is the hero shot.
5. **Pass and plate.** The pick-up counters with the drop-in cold rails, out toward the event center
6. **Wash and reset.** 3-compartment dishtable (22), high-temp warewasher (23)
7. **Pull back.** Wide shot of the full 42-foot room in use, then title card with the campaign ask

Six or seven shots, 45 to 60 seconds total. That is the right length for a pitch deck and for a landing page embed.

---

## 7. Two more options worth considering

**Interactive tour on the funding page.** Instead of (or in addition to) a video, an embedded first-person walkthrough that a funder can steer with a mouse. Built with Three.js from the same model exported as glTF, it runs in any browser with no plugin, and it is a genuine differentiator on a campaign page. More build effort than a video, but it lives on the site permanently and it is measurable.

**360 panoramas.** Twinmotion and D5 both export 360 stills for free. Three or four panoramas hosted as a click-through tour is 20 percent of the effort of a video and covers most of the same ground. Good fallback if the timeline is tight.

---

## 8. Recommended sequence

1. Email Andrew Ling and Aza Summers for source files and written permission (today, it gates everything)
2. While waiting, download manufacturer 3D models for the 15 real SKUs above
3. Install Twinmotion (free) and start SketchUp's trial only once the model is ready to import, so the 7 days are not wasted
4. Model shell from the SVG, place equipment, light from A04
5. Shoot the 7-shot sequence, grade, add the campaign title card
6. Decide then whether the interactive web version is worth the extra build

---

### Sources

- [Twinmotion vs D5 Render 2026 comparison](https://www.myarchitectai.com/blog/d5-render-vs-twinmotion)
- [D5 Render pricing 2026](https://www.d5render.com/posts/render-pricing-d5-plans)
- [AutoQuotes foodservice design solutions](https://revalizesoftware.com/autoquotes/autoquotes-aq-design-solutions/)
- [C&T Design foodservice kitchen Revit walkthroughs](https://www.c-tdesign.com/food-service-kitchen-virtual-walk-through)
- [3D walkthrough animation cost 2026](https://maverickframe.com/blog/3d-walkthrough-animation-cost/)
- [3D rendering cost breakdown 2026](https://www.myarchitectai.com/blog/3d-architectural-rendering-cost)
- [Best commercial kitchen design software 2026](https://us.specifiglobal.com/commercial-kitchen-design-specifi/)
