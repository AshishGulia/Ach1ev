import medicalNewsImg from '../assets/images/leisure_news_medical_1794742096397.jpg';
import spaceCosmosImg from '../assets/images/leisure_space_cosmos_1794742095142.jpg';
import photoStudioImg from '../assets/images/leisure_photography_studio_1794742096766.jpg';
import musicAcousticsImg from '../assets/images/leisure_music_acoustics_1794742096540.jpg';
import wellnessSportImg from '../assets/images/leisure_wellness_sport_1794742096683.jpg';

export interface WingBlogPage {
  pageNumber: number;
  title: string;
  image: string;
  imageCaption: string;
  paragraphs: string[];
  highlightQuote: string;
}

export interface WingLearnMoreSite {
  name: string;
  url: string;
  tagline: string;
}

export interface WingBlogBundle {
  wingId: string;
  categoryName: string;
  blogTitle: string;
  subtitle: string;
  author: string;
  readMinutes: number;
  heroImage: string;
  pages: WingBlogPage[];
  topWebsites: WingLearnMoreSite[];
}

export const LEISURE_ASSETS = {
  medicalNewsImg,
  spaceCosmosImg,
  photoStudioImg,
  musicAcousticsImg,
  wellnessSportImg,
};

const buildFourPageBlog = (
  wingId: string,
  categoryName: string,
  blogTitle: string,
  subtitle: string,
  heroImage: string,
  secImages: [string, string, string, string],
  pagesData: Array<{
    title: string;
    caption: string;
    p1: string;
    p2: string;
    quote: string;
  }>,
  topWebsites: WingLearnMoreSite[]
): WingBlogBundle => ({
  wingId,
  categoryName,
  blogTitle,
  subtitle,
  author: 'Ach1ev Editorial Desk',
  readMinutes: 6,
  heroImage,
  pages: pagesData.map((p, idx) => ({
    pageNumber: idx + 1,
    title: p.title,
    image: secImages[idx],
    imageCaption: p.caption,
    paragraphs: [p.p1, p.p2],
    highlightQuote: p.quote,
  })),
  topWebsites,
});

export const WING_BLOG_CONTENT: Record<string, WingBlogBundle> = {
  photography: buildFourPageBlog(
    'photography',
    'Photography',
    'Seeing Like a Lens: Light, Anatomy of Composition & Visual Storytelling',
    'How mastering aperture, dynamic range, and negative space trains clinical observation and visual memory.',
    photoStudioImg,
    [photoStudioImg, spaceCosmosImg, wellnessSportImg, musicAcousticsImg],
    [
      {
        title: 'Page 1 · Why Doctors Make Remarkable Photographers',
        caption: 'Precision glass optics and studio exposure discipline.',
        p1: 'Radiology, dermatology, histopathology, and ophthalmoscopy all depend on distinguishing subtle gradients in shadow, texture, and vascular color. Stepping behind a camera builds that exact pattern-recognition circuitry during restorative breaks.',
        p2: 'Just as a 50mm prime lens forces intentional footwork and framing, setting a strict three-frame limit on a quiet evening walk resets prefrontal attention fatigue faster than passive scrolling.',
        quote: '“You do not take a photograph — you compose attention until noise disappears.”',
      },
      {
        title: 'Page 2 · The Exposure Triangle & Dynamic Range Mastery',
        caption: 'Balancing aperture depth, shutter crispness, and grain physics.',
        p1: 'Every single photograph negotiates three variables: aperture (f-stop depth of field), shutter speed (motion freeze vs cinematic blur), and ISO sensitivity. Understanding stops mathematically lets you predict highlights before lifting the viewfinder.',
        p2: 'Shoot slightly underexposed for bright highlights when capturing golden-hour portraits or histological specimens under side-lighting; digital sensors recover shadow detail gracefully while clipped whites stay lost.',
        quote: '“Expose for the brightest detail you care to preserve; develop for the emotional shadow.”',
      },
      {
        title: 'Page 3 · Chiaroscuro, Color Temperature & Street Story',
        caption: 'Warm tungsten interiors against slate twilight streets.',
        p1: 'Color temperature measured in Kelvin shifts mood instantaneously. Mixing 3200K warm study-lamp light against 5600K blue dusk windows produces effortless cinematic depth without heavy filters.',
        p2: 'Practice leading lines—staircase banisters, hospital corridors, tree shadows—that pull the viewer’s eye directly to your focal subject within half a second.',
        quote: '“Contrast gives shape to light; restraint gives meaning to color.”',
      },
      {
        title: 'Page 4 · Building a Visual Study Archive',
        caption: 'Curating tactile contact sheets alongside your notebook notes.',
        p1: 'Create one contact sheet per month containing only twelve frames that tell a cohesive story: late-night espresso, rain outside the library window, monsoon reflections on asphalt. Reviewing those grids reinforces episodic memory.',
        p2: 'Capture key details in the Achiev mini-editor beside this reader to build your own visual composition handbook.',
        quote: '“A single intentional frame anchors an entire season of memory.”',
      },
    ],
    [
      { name: 'Aperture — Photo Journal', url: 'https://aperture.org', tagline: 'World-class documentary photography essays & monographs' },
      { name: 'DPReview Guides', url: 'https://www.dpreview.com', tagline: 'Deep optics benchmarks, sensor tests & lens physics' },
      { name: 'Magnum Photos Stories', url: 'https://www.magnumphotos.com', tagline: 'Iconic photojournalism archives & visual narratives' },
      { name: 'Cambridge in Colour', url: 'https://www.cambridgeincolour.com', tagline: 'Interactive optics, histogram & lighting tutorials' },
      { name: 'PetaPixel', url: 'https://petapixel.com', tagline: 'Daily camera craft, technique breakdowns & gear insights' },
    ]
  ),

  music: buildFourPageBlog(
    'music',
    'Music',
    'The Physics of Resonance: Acoustics, Focus Cadence & Neurological Harmony',
    'From Baroque counterpoint to analog vinyl warmth — how auditory cadence entrains hippocampal memory consolidation.',
    musicAcousticsImg,
    [musicAcousticsImg, photoStudioImg, medicalNewsImg, spaceCosmosImg],
    [
      {
        title: 'Page 1 · Why Acoustic Timber Calms the Limbic System',
        caption: 'Warm brass harmonics and tactile analog resonance.',
        p1: 'Pure acoustic instruments—grand piano hammers, cello bow rosin, muted jazz trumpet—produce rich integer overtones that smooth cortical beta wave spikes after intense medical recall sessions.',
        p2: 'Unlike compressed pop hooks engineered for dopamine spikes, 60–72 BPM instrumental works mirror resting sinus rhythm, gently nudging vagal tone upward within four minutes.',
        quote: '“Music is architecture sculpted inside time rather than stone.”',
      },
      {
        title: 'Page 2 · The 528 Hz & Circle of Fifths Architecture',
        caption: 'Mathematical symmetry linking harmonic intervals and neuroplasticity.',
        p1: 'Pythagorean ratios explain why a perfect fifth (3:2 frequency ratio) feels effortlessly stable while a tritone demands resolution. Listening to Bach’s Well-Tempered Clavier trains working memory for multi-threaded clinical reasoning.',
        p2: 'Try toggling brown noise beneath soft acoustic guitar or ambient Rhodes chords during evening revision sets.',
        quote: '“Resolution feels sweet only because tension was honest before it.”',
      },
      {
        title: 'Page 3 · Active Listening: Dissecting Stems & Spatial Staging',
        caption: 'Training the ear for auscultation-grade frequency separation.',
        p1: 'Close your eyes for three minutes and isolate only the upright bass line, then replay isolating brushed snare percussion. That deliberate auditory selective attention sharpens S3/S4 murmur recognition during bedside cardiology rounds.',
        p2: 'Warm room acoustics with natural wood damping eliminate harsh mid-range ear fatigue caused by cheap plastic earbuds.',
        quote: '“The clinician who hears silence between notes hears subtle murmurs first.”',
      },
      {
        title: 'Page 4 · Curating Your Four-Mood Study Vinyl Shelf',
        caption: 'Intentional playlists for morning launch, deep flow, and wind-down.',
        p1: 'Assign distinct acoustic textures to distinct study gears: crisp harpsichord or Lo-Fi Rhodes for active flashcards, ambient cello for textbook synthesis, and Hindustani ragas like Yaman at dusk.',
        p2: 'Jot down tracks that unlock flow state inside the left Achiev notebook pane.',
        quote: '“Never pair panic music with hard textbooks; curate soundtracks for mastery.”',
      },
    ],
    [
      { name: 'Tiny Desk Concerts (NPR)', url: 'https://www.npr.org/series/tiny-desk-concerts/', tagline: 'Intimate unvarnished live acoustic sessions across genres' },
      { name: 'AllMusic Discovery', url: 'https://www.allmusic.com', tagline: 'Deep discographies, liner notes & compositional lineages' },
      { name: 'Ableton Learning Music', url: 'https://learningmusic.ableton.com', tagline: 'Interactive beat, chord & harmonic sandbox in browser' },
      { name: 'Classical Archives', url: 'https://www.classicalarchives.com', tagline: 'Curated chamber, baroque & orchestral masterworks' },
      { name: 'Pitchfork Features', url: 'https://pitchfork.com/features/', tagline: 'Longform essays on album craft, sound design & culture' },
    ]
  ),

  travel: buildFourPageBlog(
    'travel',
    'Travel',
    'Cartographies of Wonder: Slow Travel, Alpine Passes & Cultural Architecture',
    'Exploring Silk Road caravanserais, high-altitude sanctuaries, and coastal rail routes that expand perspective.',
    spaceCosmosImg,
    [photoStudioImg, spaceCosmosImg, wellnessSportImg, musicAcousticsImg],
    [
      {
        title: 'Page 1 · The Antidote to Library Tunnel Vision',
        caption: 'High mountain horizons and historic transit arteries.',
        p1: 'Months inside lecture halls compress spatial perception down to a 15-inch screen. Even five minutes studying topographic passes, monsoon railways, or Kyoto courtyard proportions activates the brain’s entorhinal grid cells.',
        p2: 'Slow travel prioritizes walking neighborhoods at dawn—bakery ovens opening, morning markets setting scales—over rushing checklist landmarks.',
        quote: '“We travel not to escape life, but so life’s scale becomes generous again.”',
      },
      {
        title: 'Page 2 · Iconic Scenic Rail & Alpine Journeys',
        caption: 'Curated corridors across Ladakhi plateaus, Swiss valleys & Japanese coastlines.',
        p1: 'Railway journeys impose a gentle horizontal rhythm ideally suited to reflection: the Bernina Express climbing glacial viaducts without rack-and-pinion gears, or the Konkan Monsoon line gliding past emerald Western Ghats.',
        p2: 'Notice how vernacular stone, slate roofs, and terraced water channels evolve every fifty kilometers in response to climate.',
        quote: '“A window seat on a mountain train is a moving cinema of geology.”',
      },
      {
        title: 'Page 3 · Medical History Trails Around the Globe',
        caption: 'Where ancient apothecaries, universities & clinical breakthroughs began.',
        p1: 'Walk through Bologna’s wooden Anatomical Theatre of 1637, Padua’s Orto Botanico herbarium founded in 1545 for medicinal plants, or London’s Broad Street pump commemorating John Snow’s cholera map.',
        p2: 'Every landmark becomes a living memory palace anchor for pathology and pharmacology facts.',
        quote: '“Stand where the pioneers stood, and textbook chapters turn three-dimensional.”',
      },
      {
        title: 'Page 4 · Designing Post-Exam Expedition Blueprints',
        caption: 'Packing ultralight and planning restorative sabbaticals.',
        p1: 'Use the left Achiev mini-notebook to sketch a realistic 7-day itinerary to celebrate after your upcoming exam milestone—complete with dawn viewpoint spots, local tea houses, and offline map pins.',
        p2: 'Having a concrete horizon reward makes disciplined daily study blocks feel purposeful.',
        quote: '“A planned horizon makes today’s discipline feel light.”',
      },
    ],
    [
      { name: 'Atlas Obscura', url: 'https://www.atlasobscura.com', tagline: 'Curated guide to hidden wonders, historic museums & oddities' },
      { name: 'UNESCO World Heritage', url: 'https://whc.unesco.org/en/list/', tagline: 'Complete architectural & natural biosphere directory' },
      { name: 'Seat 61 (Train Travel)', url: 'https://www.seat61.com', tagline: 'Definitive global scenic rail routes & ferry crossings' },
      { name: 'Lonely Planet Destinations', url: 'https://www.lonelyplanet.com', tagline: 'Regional cultural itineraries & neighborhood handbooks' },
      { name: 'Roads & Kingdoms', url: 'https://roadsandkingdoms.com', tagline: 'Deep cultural journalism blending cuisine, history & transit' },
    ]
  ),

  nutrition: buildFourPageBlog(
    'nutrition',
    'Nutrition',
    'Metabolic Cognitive Fuel: Glycemic Curves, Micronutrients & Hydration Precision',
    'Evidence-based nutrition strategies that eliminate post-lunch glucose crashes and sustain long exam stamina.',
    wellnessSportImg,
    [wellnessSportImg, medicalNewsImg, photoStudioImg, musicAcousticsImg],
    [
      {
        title: 'Page 1 · Taming the 2 PM Post-Prandial Slump',
        caption: 'Whole polyphenols, omega-rich seeds & balanced metabolic plates.',
        p1: 'Refined carbohydrate spikes trigger rapid insulin surges followed by reactive hypoglycemia and parasympathetic drowsiness—derailing afternoon pathology blocks. Pairing complex starches with 25g lean protein and soluble fiber flattens the glucose curve.',
        p2: 'Start high-focus mornings with slow-digesting protein and berries rather than sugary pastries.',
        quote: '“Stable blood glucose is silent, effortless cognitive endurance.”',
      },
      {
        title: 'Page 2 · Neuro-Protective Fats & Choline Pathways',
        caption: 'Supporting myelin integrity and acetylcholine synthesis.',
        p1: 'Twenty percent of total resting oxygen and glucose feeds your cerebral cortex. Walnuts, flaxseed ALA, cold-water omega-3 DHA, and choline-dense whole eggs directly supply phospholipid precursors needed for synaptic remodeling.',
        p2: 'Dark leafy greens deliver folate and magnesium, cofactors across mitochondrial ATP synthesis.',
        quote: '“Every memory consolidated overnight requires literal biochemical building blocks.”',
      },
      {
        title: 'Page 3 · Caffeine Pharmacokinetics & The Adenosine Cliff',
        caption: 'Timing coffee windows for zero midnight sleep fragmentation.',
        p1: 'Caffeine carries an average plasma half-life of 5 to 6 hours. Taking an espresso at 5 PM leaves 25% active receptor blockade at 3 AM, cutting slow-wave restorative sleep even if you fall asleep fast.',
        p2: 'Delay morning caffeine 60 minutes after waking so endogenous cortisol peaks naturally first, avoiding the dreaded afternoon rebound.',
        quote: '“Treat coffee like a surgical scalpel for timing, not a blunt hammer at midnight.”',
      },
      {
        title: 'Page 4 · Hydration Osmolality & Ward-Shift Snack Matrix',
        caption: 'Practical 5-minute desk snacks built for busy students.',
        p1: 'Even 1.5% mild dehydration measurably slows psychomotor vigilance and increases headache frequency. Keep a chilled electrolyte bottle visible beside your laptop.',
        p2: 'Build a zero-prep desk kit (roasted almonds, pumpkin seeds, dark 85% cacao squares, greek yogurt) and log your go-to meals in the Achiev notebook pane.',
        quote: '“Never rely on willpower during cramming when smart fuel removes the friction.”',
      },
    ],
    [
      { name: 'Harvard Nutrition Source', url: 'https://nutritionsource.hsph.harvard.edu', tagline: 'Peer-reviewed evidence guides on metabolic & brain nutrition' },
      { name: 'Examine.com Research', url: 'https://examine.com', tagline: 'Independent clinical summaries on micronutrients & supplements' },
      { name: 'NutritionFacts.org', url: 'https://nutritionfacts.org', tagline: 'Daily clinical literature breakdowns on whole-food physiology' },
      { name: 'WHO Healthy Diet Hub', url: 'https://www.who.int/health-topics/healthy-diet', tagline: 'Global micronutrient & metabolic health benchmarks' },
      { name: 'MedlinePlus Nutrition', url: 'https://medlineplus.gov/nutrition.html', tagline: 'NIH clinical reference for vitamins, electrolytes & hydration' },
    ]
  ),

  sports: buildFourPageBlog(
    'sports',
    'Sports',
    'The Athletic Chessboard: Biomechanics, Flow State & Clutch Composure',
    'What championship badminton, Test cricket, and Formula 1 teach us about reading pressure under fatigue.',
    wellnessSportImg,
    [wellnessSportImg, spaceCosmosImg, photoStudioImg, medicalNewsImg],
    [
      {
        title: 'Page 1 · Reading Micro-Cues Faster Than Conscious Thought',
        caption: 'Kinetic chain alignment and elite peripheral anticipation.',
        p1: 'Elite athletes don’t have faster retinal nerve conduction—they extract kinematic cues from hip rotation and shoulder tilt 150 milliseconds before ball contact. Clinicians develop identical intuition reading vital-sign trends.',
        p2: 'Practicing badminton, table tennis, or tennis sharpens saccadic eye movements after hours of static near-focus screen work.',
        quote: '“Speed in sport is rarely running faster; it is seeing the next frame sooner.”',
      },
      {
        title: 'Page 2 · Zone 2 Aerobic Base vs Anaerobic Peak',
        caption: 'VO2 max longevity & capillary density benefits for students.',
        p1: 'Just 35 minutes of brisk Zone 2 running, cycling, or swimming boosts BDNF (Brain-Derived Neurotrophic Factor)—direct fertilizer for hippocampal neurogenesis.',
        p2: 'Alternating high-focus mental blocks with rhythmic cardio accelerates procedural and declarative retention.',
        quote: '“Sweat is the most underrated cognitive enhancer in the medical curriculum.”',
      },
      {
        title: 'Page 3 · Clutch Composure & Reset Routines Between Points',
        caption: 'Nadal’s towel ritual & goalkeeper breathwork before penalties.',
        p1: 'Between intense points, champions run an involuntary 12-second parasympathetic reset: drop shoulders, lengthen exhalation, wipe sweat, visualize the next single serve.',
        p2: 'Apply that exact inter-point reset between tough MCQ blocks in your practice exams.',
        quote: '“Championship consistency lives inside the 10 seconds between errors and next action.”',
      },
      {
        title: 'Page 4 · Weekly Athletic Playbook Log',
        caption: 'Tracking matches, reflexes & outdoor court sessions.',
        p1: 'Schedule at least two 45-minute court or field sessions every week alongside your academic calendar—treating athletic play as non-negotiable cognitive maintenance.',
        p2: 'Capture drills, racket grip notes, or personal lap records in the left Achiev notebook tab.',
        quote: '“A body in skilled motion keeps a sharp mind out of burnout.”',
      },
    ],
    [
      { name: 'The Players’ Tribune', url: 'https://www.theplayerstribune.com', tagline: 'First-person essays from elite athletes on mindset & pressure' },
      { name: 'Science for Sport', url: 'https://www.scienceforsport.com', tagline: 'Sports biomechanics, VO2 kinetics & conditioning digests' },
      { name: 'Olympic Channel Features', url: 'https://olympics.com', tagline: 'Documentaries on technical mastery across global disciplines' },
      { name: 'BWF / ATP Tactics Hub', url: 'https://www.atptour.com', tagline: 'Match statistics, rally length analytics & court geometry' },
      { name: 'ESPN Longform', url: 'https://www.espn.com', tagline: 'Global sports coverage, analytics & championship stories' },
    ]
  ),

  exercises: buildFourPageBlog(
    'exercises',
    'Exercises',
    'Structural Longevity: Desk Spine Decompression, Mobility & Functional Strength',
    'Correcting anterior cervical translation, scapular winging, and hip flexor shortening from 10-hour study days.',
    wellnessSportImg,
    [wellnessSportImg, photoStudioImg, musicAcousticsImg, medicalNewsImg],
    [
      {
        title: 'Page 1 · Undoing the “Medical Student C-Spine” Posture',
        caption: 'Thoracic extension and scapular retraction biomechanics.',
        p1: 'Every inch your head drifts forward over your keyboard adds roughly 4.5 kg of shear torque across C5–C7 intervertebral discs. Daily thoracic wall-angels and chin-tucks restore neutral cervical lordosis.',
        p2: 'Perform 10 slow scapular squeezes every time you stand up to refill water.',
        quote: '“Posture isn’t stiffness—it is effortless balance around your center of gravity.”',
      },
      {
        title: 'Page 2 · The Five-Minute Micro-Mobility Circuit',
        caption: '90/90 hip switches, dead-hangs, and radial/median nerve glides.',
        p1: 'A 45-second overhead bar dead-hang gently decompresses lumbar discs while lengthening shortened latissimus and pectoralis minor fibers.',
        p2: 'Pair with 90/90 floor hip internal/external rotations to banish lower-back tightness built up on library chairs.',
        quote: '“Joints nourish through full range of motion; what isn’t moved stiffens.”',
      },
      {
        title: 'Page 3 · Compound Strength: Three Movements That Cover Everything',
        caption: 'Hinge, push, pull & loaded carry fundamentals.',
        p1: 'Short on time during clinical postings? Thirty minutes of goblet squats, push-ups (or incline press), and inverted rows builds full posterior-chain resilience with zero fluff.',
        p2: 'Progressive overload with clean tempo beats exhausted marathon workouts every single semester.',
        quote: '“Train to feel stronger tomorrow morning—not wrecked for three days.”',
      },
      {
        title: 'Page 4 · Structuring Your Desk Stretch & Reps Tracker',
        caption: 'Logging reps & pain-free range milestones directly in Achiev.',
        p1: 'Track morning mobility sets alongside your Achiev daily study tasks so movement becomes automatic hygiene rather than an afterthought.',
        p2: 'Write down your personalized 15-minute routine inside the note window on the left.',
        quote: '“Consistency at 70% intensity transforms your physiology in twelve weeks.”',
      },
    ],
    [
      { name: 'ACSM Fitness Library', url: 'https://www.acsm.org', tagline: 'American College of Sports Medicine clinical exercise guidelines' },
      { name: 'ExRx Exercise Directory', url: 'https://exrx.net', tagline: 'Anatomical muscle maps & biomechanically verified form guides' },
      { name: 'Stronger By Science', url: 'https://www.strongerbyscience.com', tagline: 'Evidence-based hypertrophy, strength & recovery meta-analyses' },
      { name: 'Precision Movement', url: 'https://www.precisionmovement.coach', tagline: 'Targeted joint mobility & postural rehabilitation protocols' },
      { name: 'Darebee Visual Workouts', url: 'https://darebee.com', tagline: 'No-equipment visual bodyweight circuits for tiny rooms' },
    ]
  ),

  lifestyle: buildFourPageBlog(
    'lifestyle',
    'Lifestyle',
    'The Deliberate Scholar: Circadian Architecture, Analog Rituals & Slow Living',
    'Designing calm physical spaces, digital minimalism, and evening wind-down rituals for deep joy in high-rigor study.',
    photoStudioImg,
    [photoStudioImg, musicAcousticsImg, wellnessSportImg, spaceCosmosImg],
    [
      {
        title: 'Page 1 · Circadian Anchors: Sunlight Within 20 Minutes of Waking',
        caption: 'Warm natural morning light & analog desk organization.',
        p1: 'Direct morning photons hitting melanopsin retinal ganglion cells set a clean 14-hour melatonin countdown timer—eliminating midnight insomnia without supplements.',
        p2: 'Keep desk tools minimal: one trusted fountain pen or stylus, matte paper margins, and zero notification badges.',
        quote: '“Your study desk should exhale serenity the moment you sit down.”',
      },
      {
        title: 'Page 2 · The Art of Digital Decluttering',
        caption: 'Reclaiming unbroken 90-minute creative bandwidth.',
        p1: 'Context-switching between social feeds and dense textbooks carries an attention residue penalty lasting up to 23 minutes per ping. Batch messages into two daily 15-minute windows.',
        p2: 'Notice how calm and expansive an hour feels inside an unhurried sanctuary like Achiev.',
        quote: '“Attention is your most non-renewable asset; guard it like gold leaf.”',
      },
      {
        title: 'Page 3 · Sensory Anchor Rituals Between Shift & Home',
        caption: 'Tea steeping, warm lighting & closing notebooks cleanly.',
        p1: 'Establish a psychological airlock separating ward duty from evening rest: dim overhead LEDs, light a warm study lamp, brew chamomile or Assam chai, and write three tomorrow priorities so your subconscious lets go.',
        p2: 'Small tactile rituals compound into profound emotional resilience across residency years.',
        quote: '“How you close today determines the calmness with which tomorrow opens.”',
      },
      {
        title: 'Page 4 · Crafting Your Personal Manifesto & Weekly Reset',
        caption: 'Curating values beyond exam scores.',
        p1: 'Every Sunday evening, reflect on one friendship nurtured, one meal cooked, one chapter mastered, and one walk outdoors without headphones.',
        p2: 'Draft your serene evening checklist inside the mini-notebook beside this essay.',
        quote: '“Excellence never required rushing; deep craft always preferred composure.”',
      },
    ],
    [
      { name: 'Aeon Essays', url: 'https://aeon.co', tagline: 'Reflective essays on philosophy, psychology & human living' },
      { name: 'Brain Pickings / The Marginalian', url: 'https://www.themarginalian.org', tagline: 'Timeless meditations on literature, science & creative life' },
      { name: 'Cal Newport’s Study Hacks', url: 'https://calnewport.com/blog/', tagline: 'Deep work workflows & deliberate digital minimalism' },
      { name: 'Kinfolk Magazine', url: 'https://www.kinfolk.com', tagline: 'Slow living aesthetics, architecture & thoughtful interiors' },
      { name: 'Wait But Why', url: 'https://waitbutwhy.com', tagline: 'Deep illustrated explorations of time, ambition & curiosity' },
    ]
  ),

  space: buildFourPageBlog(
    'space',
    'Space',
    'Deep Field Horizons: Exoplanets, Orbital Medicine & Cosmic Perspective',
    'Exploring JWST infrared nurseries, gravitational lensing, and how spaceflight physiology advances terrestrial care.',
    spaceCosmosImg,
    [spaceCosmosImg, medicalNewsImg, photoStudioImg, musicAcousticsImg],
    [
      {
        title: 'Page 1 · Through the Infrared Mirror of JWST',
        caption: 'Deep star-forming nebulae captured across cosmic infrared light.',
        p1: 'Resting 1.5 million kilometers from Earth at Lagrange Point L2, the James Webb Space Telescope looks through dense cosmic dust clouds into nurseries where newborn suns ignite and ancient galaxies formed 300 million years post-Big Bang.',
        p2: 'Gazing outward across light-years dissolves trivial daily anxiety with Carl Sagan’s “Overview Effect.”',
        quote: '“Every calcium atom in human bone was forged inside a collapsing ancient star.”',
      },
      {
        title: 'Page 2 · Microgravity Aerospace Physiology & Bone Remodeling',
        caption: 'How orbital medicine informs osteoporosis and vestibular research.',
        p1: 'Without 1G mechanical loading, astronauts lose up to 1.5% bone mineral density per month alongside cephalad fluid shifts that flatten the posterior ocular globe (SANS syndrome).',
        p2: 'Studying microgravity physiology yields direct therapies for bedbound ICU muscle wasting and orthostatic intolerance back on Earth.',
        quote: '“Spaceflight accelerates human adaptation—turning astronauts into pioneers of physiology.”',
      },
      {
        title: 'Page 3 · Pale Blue Worlds & Atmospheric Biosignatures',
        caption: 'Transit spectroscopy hunting water vapor, methane & ozone.',
        p1: 'When a rocky exoplanet crosses its host star, trace starlight skims its atmosphere—carving unmistakable absorption fingerprints of CO2, water, and methane across spectrographs.',
        p2: 'TRAPPIST-1 houses seven Earth-sized worlds packed tight enough to look like crescent moons in each other’s skies.',
        quote: '“Spectroscopy lets humanity taste atmospheres 40 light-years away.”',
      },
      {
        title: 'Page 4 · Backyard Stargazing & Night-Sky Field Notes',
        caption: 'Spotting Jupiter’s Galilean moons & Orion Nebula cleanly.',
        p1: 'You don’t need an observatory: a pair of 10×50 binoculars reveals Jupiter’s four brightest moons shifting positions nightly and the glowing Orion Nebula sword cluster.',
        p2: 'Record sky coordinates, meteor shower dates, or aerospace medicine insights inside your Achiev mini-notebook.',
        quote: '“Step outside between midnight study chapters; look up—gravity handles the rest.”',
      },
    ],
    [
      { name: 'NASA Science & Spaceflight', url: 'https://science.nasa.gov', tagline: 'Mission telemetry, JWST deep field galleries & solar studies' },
      { name: 'ESA Webb Image Archive', url: 'https://esawebb.org', tagline: 'European Space Agency high-res deep cosmos catalogs' },
      { name: 'Astronomy Picture of the Day', url: 'https://apod.nasa.gov', tagline: 'Daily curated astrophysics photograph explained by astronomers' },
      { name: 'The Planetary Society', url: 'https://www.planetary.org', tagline: 'Global planetary exploration dispatches & mission maps' },
      { name: 'Space.com Horizons', url: 'https://www.space.com', tagline: 'Rocket launches, exoplanet discoveries & orbital medicine news' },
    ]
  ),
};

// Populate all existing wings so EVERY Wing shows a bespoke 4-Page Blog + Top 5 Websites in its Notes Dual-View!
const EXISTING_WING_SPECS: Array<{
  wingId: string;
  categoryName: string;
  blogTitle: string;
  subtitle: string;
  img: string;
  quotes: [string, string, string, string];
  topics: [string, string, string, string];
  sites: WingLearnMoreSite[];
}> = [
  {
    wingId: 'decompression',
    categoryName: 'Decompression Lab',
    blogTitle: 'Autonomic Reset: Vagal Tone, Ocular Rest & Recovery Physiology',
    subtitle: 'Practical neuro-autonomic methods to reset eye strain, lower cortisol, and lock in deep study endurance.',
    img: wellnessSportImg,
    topics: [
      '20-20-20 Ciliary Muscle Relaxation & Saccadic Relief',
      'Physiological Sighs & Fast Heart Rate Variability Tuning',
      'Ultradian 90-Minute Focus Cycles & Micro-Nap Windows',
      'Designing Effortless Study Recovery Between Heavy Rounds',
    ],
    quotes: [
      '“Rest is not the enemy of rigor—it is the biological ink that fixes memory.”',
      '“Double inhale, long sigh—your brainstem’s fastest manual brake on stress.”',
      '“Protect ciliary accommodation today for sharp vision across decades.”',
      '“Pace your brain like an endurance athlete, not a panicked sprint.”',
    ],
    sites: [
      { name: 'Huberman Lab Protocols', url: 'https://www.hubermanlab.com', tagline: 'Science-grounded autonomic & ocular recovery guides' },
      { name: 'Greater Good Science Center', url: 'https://greatergood.berkeley.edu', tagline: 'UC Berkeley research on stress resilience & mindfulness' },
      { name: 'American Academy of Ophthalmology', url: 'https://www.aao.org/eye-health', tagline: 'Clinical guidance on digital eye strain & ergonomics' },
      { name: 'Sleep Foundation', url: 'https://www.sleepfoundation.org', tagline: 'Ultradian naps, circadian biology & REM consolidation' },
      { name: 'Calm Science Hub', url: 'https://www.calm.com/blog', tagline: 'Guided parasympathetic downregulation rituals' },
    ],
  },
  {
    wingId: 'cognitive',
    categoryName: 'Cognitive Play',
    blogTitle: 'Pattern Recognition & Executive Sharpness Through Tactical Play',
    subtitle: 'How cross-domain anagrams, algorithms, and 64-square chess tactics boost differential diagnosis speed.',
    img: medicalNewsImg,
    topics: [
      'Why Playful Puzzling Refreshes Working Memory Capacity',
      'Algorithmic Logic & Clinical Triage Decision Trees',
      'Chess Tactical Calculation & Spatial Pattern Library',
      'Turning Rapid Recall Into Low-Stress Daily Joy',
    ],
    quotes: [
      '“Play disarms performance anxiety while sharpening executive fluency.”',
      '“A strong diagnostician thinks like a master tactician—three moves ahead.”',
      '“Short playful sprints clear mental fog faster than passive staring.”',
      '“Curiosity compounds far more reliably than brute-force fear.”',
    ],
    sites: [
      { name: 'Lichess Tactics & Study', url: 'https://lichess.org/training', tagline: 'Ad-free tactical chess puzzles & endgames' },
      { name: 'Brilliant Interactive Stem', url: 'https://brilliant.org', tagline: 'Visual logic, probability & algorithmic intuition' },
      { name: 'Project Euler', url: 'https://projecteuler.net', tagline: 'Classic computational logic & mathematical problems' },
      { name: 'Merriam-Webster Games', url: 'https://www.merriam-webster.com/games', tagline: 'Daily etymology, vocabulary & anagram challenges' },
      { name: 'Quantamagazine', url: 'https://www.quantamagazine.org', tagline: 'Lucid dispatches from math, CS & systems biology' },
    ],
  },
  {
    wingId: 'language',
    categoryName: 'Language Bytes',
    blogTitle: 'Clinical Etymology, Poetic Meter & Bedside Communication Craft',
    subtitle: 'Decoding Greek/Latin medical roots and reading luminous verse to deepen bedside empathy.',
    img: photoStudioImg,
    topics: [
      'Unlocking 2,000 Terms from 40 Latin & Greek Roots',
      'Narrative Medicine: Why Poetry Sharpens Case Listening',
      'Untranslatable Idioms & Precision Clinical Empathy',
      'Crafting Crisp Verbal Ward Presentations',
    ],
    quotes: [
      '“Know the Greek root once, and never memorize ten textbook pages again.”',
      '“Precision in language produces precision in clinical thought.”',
      '“Every patient story carries subtext beneath their literal words.”',
      '“Read a poem a day to keep clinical cynicism away.”',
    ],
    sites: [
      { name: 'Etymonline', url: 'https://www.etymonline.com', tagline: 'Searchable Greek & Latin lineage of medical English' },
      { name: 'Poetry Foundation', url: 'https://www.poetryfoundation.org', tagline: 'Curated poems, meter archives & audio recitations' },
      { name: 'LitHub Features', url: 'https://lithub.com', tagline: 'Essays on language, craft & narrative medicine' },
      { name: 'Columbia Narrative Medicine', url: 'https://www.mhe.cuimc.columbia.edu', tagline: 'Bridging literature with clinical empathy & history-taking' },
      { name: 'Wordnik', url: 'https://www.wordnik.com', tagline: 'Rich contextual usages, idioms & literary quotations' },
    ],
  },
  {
    wingId: 'mind',
    categoryName: 'Psychology & Mind',
    blogTitle: 'Human Decision Heuristics, Clinical Biases & Bedside Micro-Cues',
    subtitle: 'Recognizing anchoring bias, premature closure, and subtle patient body language before critical rounds.',
    img: medicalNewsImg,
    topics: [
      'Diagnostic Anchoring & Availability Traps Under Fatigue',
      'Reading Bedside Posture, Breathing Cadence & Non-Verbal Pain',
      'Bayesian Reasoning Over Statistical Illusion in Labs',
      'Building Metacognitive Checklists for Zero Error',
    ],
    quotes: [
      '“Knowing the bias exists never immunizes you—systematic pause does.”',
      '“First impressions open the differential; disciplined falsification confirms it.”',
      '“Observe the hands and breath before opening the chart.”',
      '“Quiet metacognition separates seasoned mentors from rushed interns.”',
    ],
    sites: [
      { name: 'APA Monitor on Psychology', url: 'https://www.apa.org/monitor', tagline: 'Peer-reviewed behavioral science & cognitive research' },
      { name: 'Nautilus Psychology', url: 'https://nautil.us', tagline: 'Deep storytelling at the crossroads of neuroscience & mind' },
      { name: 'Behavioral Scientist', url: 'https://behavioralscientist.org', tagline: 'Decision science essays, heuristics & debiasing research' },
      { name: 'LessWrong Rationality', url: 'https://www.lesswrong.com', tagline: 'Bayesian probability intuition & epistemic hygiene' },
      { name: 'Society for Medical Decision Making', url: 'https://smdm.org', tagline: 'Clinical judgment, diagnostic framing & risk literacy' },
    ],
  },
  {
    wingId: 'social',
    categoryName: 'Sociology & Systems',
    blogTitle: 'The Architecture of Belonging: Social Determinants, Cities & Public Health',
    subtitle: 'How neighborhoods, walkable transit, and social cohesion shape epidemiology as profoundly as pharmacology.',
    img: spaceCosmosImg,
    topics: [
      'Social Determinants & Upstream Disease Pathways',
      'Biophilic Cities, Shade Canopies & Cardiovascular Health',
      'Hospital Teamwork Culture & Psychological Safety',
      'From Individual Prescriptions to Community Systems',
    ],
    quotes: [
      '“A patient’s postal code predicts longevity as sharply as their genome.”',
      '“Walkable, green cities quietly prevent more hypertension than clinics treat.”',
      '“Psychological safety inside surgical teams directly lowers complication rates.”',
      '“See the clinic inside the fabric of its neighborhood.”',
    ],
    sites: [
      { name: 'Strong Towns', url: 'https://www.strongtowns.org', tagline: 'Urban design, walkable neighborhoods & civic resilience' },
      { name: 'Stanford Social Innovation', url: 'https://ssir.org', tagline: 'Community systems, equity & public health architecture' },
      { name: 'CityLab (Bloomberg)', url: 'https://www.bloomberg.com/citylab', tagline: 'Global urbanism, transit & healthy city case studies' },
      { name: 'Contexts Sociology Mag', url: 'https://contexts.org', tagline: 'Accessible sociological research & cultural analysis' },
      { name: 'UN-Habitat', url: 'https://unhabitat.org', tagline: 'Sustainable urban planning & global public space research' },
    ],
  },
  {
    wingId: 'civilization',
    categoryName: 'Civilization Archive',
    blogTitle: 'Timelines of Discovery: Ancient Apothecaries, Cartography & Museums',
    subtitle: 'Tracing medical and cultural milestones from Alexandria & Nalanda to Renaissance anatomy theaters.',
    img: photoStudioImg,
    topics: [
      'From Galen & Ibn Sina’s Canon to Modern Physiology',
      'Vintage Cartography & The Dawn of Epidemiology',
      'Museum Sanctuaries for Quiet Sunday Reflection',
      'Memory Palaces Grounded in Real Historical Architecture',
    ],
    quotes: [
      '“Every textbook footnote rests on centuries of courageous observation.”',
      '“Maps turn abstract statistics into living human geography.”',
      '“Museum halls slow the heartbeat and widen historical perspective.”',
      '“Anchor modern pathways inside timeless historical stories.”',
    ],
    sites: [
      { name: 'Met Museum Heilbrunn Timeline', url: 'https://www.metmuseum.org/toah', tagline: 'Global art history & civilization milestones archive' },
      { name: 'Wellcome Collection', url: 'https://wellcomecollection.org', tagline: 'Free digital essays & rare archives on medicine & art' },
      { name: 'World History Encyclopedia', url: 'https://www.worldhistory.org', tagline: 'Peer-reviewed timelines spanning ancient to modern eras' },
      { name: 'David Rumsey Map Collection', url: 'https://www.davidrumsey.com', tagline: 'High-res historical cartography & global atlases' },
      { name: 'Smarthistory', url: 'https://smarthistory.org', tagline: 'Curated public art history & architecture museum guides' },
    ],
  },
  {
    wingId: 'aesthetic',
    categoryName: 'Aesthetic Mind',
    blogTitle: 'Color Harmony, Tactile Couture & The Golden Ratio of Form',
    subtitle: 'Training visual taste through oil masterworks, textile engineering, and architectural symmetry.',
    img: photoStudioImg,
    topics: [
      'Color Palette Theory as Gentle Cortical Recovery',
      'Material Engineering in Technical Garments & Scrubs',
      'Classical Proportions & Calm Study Spaces',
      'Noticing Beauty Inside Everyday Clinical Objects',
    ],
    quotes: [
      '“Harmonious proportion settles restlessness before a single word is spoken.”',
      '“Trained eyes notice both canvas beauty and subtle clinical pallor.”',
      '“Craftsmanship honors the work we care enough to repeat daily.”',
      '“Simplicity is complexity resolved with patience.”',
    ],
    sites: [
      { name: 'ArchDaily', url: 'https://www.archdaily.com', tagline: 'Global residential, hospital & library architecture' },
      { name: 'Colossal Art & Design', url: 'https://www.thisiscolossal.com', tagline: 'Visual art, tactile craft & contemporary installations' },
      { name: 'Google Arts & Culture', url: 'https://artsandculture.google.com', tagline: 'Gigapixel museum zoom & pigment analyses' },
      { name: 'Dezeen Design Magazine', url: 'https://www.dezeen.com', tagline: 'Interior craft, industrial ergonomics & lighting' },
      { name: 'Coolors Explore', url: 'https://coolors.co/palettes/trending', tagline: 'Curated harmonious color combinations & palettes' },
    ],
  },
  {
    wingId: 'performance',
    categoryName: 'High Performance',
    blogTitle: 'Sub-2-Second Telemetry: Pitstop Choreography & High-Stakes Calm',
    subtitle: 'Translating motorsport crew synchronization and reflex latency into acute care composure.',
    img: wellnessSportImg,
    topics: [
      'Closed-Loop Callouts & 20-Crew Pitstop Synchrony',
      'Laparoscopic Micro-Tremor Control & Grip Calmness',
      'Saccadic Reaction Latency Under Cognitive Load',
      'High-Stakes Briefing & Debriefing Checklists',
    ],
    quotes: [
      '“Slow is smooth; smooth becomes blisteringly fast.”',
      '“Pitstop crews never shout—every hand owns one unambiguous bolt.”',
      '“True speed feels calm from inside the cockpit.”',
      '“Debrief errors without ego so telemetry improves every lap.”',
    ],
    sites: [
      { name: 'F1 Technical Analysis', url: 'https://www.formula1.com', tagline: 'Telemetry, tire degradation strategy & aero breakdowns' },
      { name: 'Motorsport Magazine', url: 'https://www.motorsportmagazine.com', tagline: 'Racing craft, engineering history & driver psychology' },
      { name: 'Farnam Street Performance', url: 'https://fs.blog', tagline: 'Mental models, decision checklists & elite execution' },
      { name: 'The Race Insights', url: 'https://www.the-race.com', tagline: 'Grand Prix pitwall strategy & engineering deep dives' },
      { name: 'Human Performance Lab', url: 'https://www.ncbi.nlm.nih.gov/pubmed', tagline: 'Clinical surgical simulation & stress inoculation studies' },
    ],
  },
  {
    wingId: 'pulse',
    categoryName: 'Daily Pulse',
    blogTitle: 'Signal Over Noise: Medical Wire, Global Policy & Slow Journalism',
    subtitle: 'Following global ICMR, AIIMS, biotech, and space breakthroughs in five focused minutes without doomscrolling.',
    img: medicalNewsImg,
    topics: [
      'Replacing Infinite Feeds With High-Signal Inshorts',
      'Landmark Trials, ICMR Bulletins & Biotech Pipelines',
      'How to Read a Clinical Press Release With Healthy Skepticism',
      'Synthesizing News Into Exam-Ready Clinical Pearls',
    ],
    quotes: [
      '“Ten quiet minutes with vetted journalism beats three hours of panic feeds.”',
      '“Always check absolute risk reduction behind dramatic headlines.”',
      '“Stay connected to medicine’s frontier without losing your inner quiet.”',
      '“Curate your information diet as strictly as your nutrition.”',
    ],
    sites: [
      { name: 'NEJM Journal Watch', url: 'https://www.jwatch.org', tagline: 'Concise peer-reviewed clinical trial synopses' },
      { name: 'STAT News', url: 'https://www.statnews.com', tagline: 'Investigative reporting across pharma, biotech & hospitals' },
      { name: 'Nature News & Briefings', url: 'https://www.nature.com/news', tagline: 'Breakthrough global science & biomedical headlines' },
      { name: 'Indian Council of Medical Research', url: 'https://www.icmr.gov.in', tagline: 'Official Indian public health bulletins & guidelines' },
      { name: 'The Economist Science', url: 'https://www.economist.com/science-and-technology', tagline: 'Lucid synthesis of global biotech & policy' },
    ],
  },
  {
    wingId: 'post-mbbs-wing',
    categoryName: 'Post-MBBS Careers',
    blogTitle: 'Global Clinical Horizons: PLAB, USMLE, Clinical AI & Consulting Bridges',
    subtitle: 'Mapping fellowships, licensing timelines, health-tech startups, and balanced post-MBBS futures.',
    img: medicalNewsImg,
    topics: [
      'USMLE Match vs NHS UK PLAB/UKMLA vs AMC Australia',
      'UPSC CMS, Specialty Residencies & Academic Fellowships',
      'Bridging Bedside Care With Clinical AI & MedTech Consulting',
      'Designing a Sustainable Global Career Roadmap',
    ],
    quotes: [
      '“Your medical degree is a passport—not a single narrow corridor.”',
      '“Start credential verification six months earlier than stress arrives.”',
      '“Clinicians who understand data shape the next decade of hospital software.”',
      '“Plan globally, prepare calmly, protect your curiosity.”',
    ],
    sites: [
      { name: 'GMC UK Registration', url: 'https://www.gmc-uk.org', tagline: 'Official PLAB/UKMLA pathways & NHS registration portal' },
      { name: 'ECFMG / USMLE Portal', url: 'https://www.ecfmg.org', tagline: 'US residency certification, Eras Match & Step exams' },
      { name: 'NMC India Gazette', url: 'https://www.nmc.org.in', tagline: 'National Medical Commission PG rules & fellowships' },
      { name: 'AMC Australia', url: 'https://www.amc.org.au', tagline: 'Australian Medical Council standard & competent paths' },
      { name: 'Rock Health Digital Health', url: 'https://rockhealth.com', tagline: 'Digital medicine startups, clinical AI & medtech careers' },
    ],
  },
];

for (const spec of EXISTING_WING_SPECS) {
  WING_BLOG_CONTENT[spec.wingId] = buildFourPageBlog(
    spec.wingId,
    spec.categoryName,
    spec.blogTitle,
    spec.subtitle,
    spec.img,
    [spec.img, spaceCosmosImg, musicAcousticsImg, photoStudioImg],
    spec.topics.map((topic, idx) => ({
      title: `Page ${idx + 1} · ${topic}`,
      caption: `${spec.categoryName} · Illustrated Study Reader Plate ${idx + 1}`,
      p1: `Across demanding medical semesters, deliberately dedicating focused break minutes to ${topic.toLowerCase()} strengthens prefrontal executive balance without triggering cognitive burnout.`,
      p2: `Pair these insights with active reflection: notice how concepts from ${spec.categoryName} reinforce memory consolidation, calm pacing, and high-yield bedside recall when you return to your primary textbooks.`,
      quote: spec.quotes[idx],
    })),
    spec.sites
  );
}

export const getWingBlogBundle = (wingId: string, wingTitle: string): WingBlogBundle => {
  return (
    WING_BLOG_CONTENT[wingId] ||
    buildFourPageBlog(
      wingId,
      wingTitle,
      `${wingTitle}: Restorative Field Reader & Deep Insights`,
      'Four-page curated blog reader with visuals & top recommended web portals.',
      photoStudioImg,
      [photoStudioImg, spaceCosmosImg, musicAcousticsImg, wellnessSportImg],
      [1, 2, 3, 4].map((n) => ({
        title: `Page ${n} · Exploring ${wingTitle}`,
        caption: `${wingTitle} Showcase Plate ${n}`,
        p1: `Stepping into ${wingTitle} for a focused restorative break activates diffuse-mode neural networks, letting dense anatomical and clinical concepts settle quietly into long-term memory.`,
        p2: `Capture reflections, quotes, and action ideas using the synchronized Achiev mini-notebook on the left.`,
        quote: '“Stepping back deliberately brings sharper insight when you step back in.”',
      })),
      [
        { name: 'Aeon Essays', url: 'https://aeon.co', tagline: 'Deep cultural & scientific essays' },
        { name: 'MIT Technology Review', url: 'https://www.technologyreview.com', tagline: 'Frontiers of biotech, AI & engineering' },
        { name: 'Nature Briefings', url: 'https://www.nature.com', tagline: 'Global peer-reviewed scientific reporting' },
        { name: 'Stanford Encyclopedia', url: 'https://plato.stanford.edu', tagline: 'Comprehensive philosophical & conceptual references' },
        { name: 'Wikipedia Curated Portals', url: 'https://en.wikipedia.org/wiki/Wikipedia:Contents/Portals', tagline: 'Cross-disciplinary visual learning portals' },
      ]
    )
  );
};
