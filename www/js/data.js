const ELEMENTS = {
  fire: {id:'fire',name:'النار',icon:'🔥',color:'#ff5533',desc:'لهب وحرق وقوة تدميرية',
    spells:[
      {id:'fireball',name:'كرة النار',tier:1,cost:8,dmg:18,cd:1200,icon:'🔥',tier_name:'مبتدئ'},
      {id:'flame_wall',name:'جدار اللهب',tier:2,cost:16,dmg:32,cd:2200,icon:'🌋',tier_name:'متوسط'},
      {id:'inferno',name:'الجحيم',tier:3,cost:28,dmg:52,cd:3500,icon:'💥',tier_name:'متقدم'},
      {id:'phoenix',name:'العنقاء',tier:4,cost:45,dmg:90,cd:6000,icon:'🦅',tier_name:'سيد'}
    ]},
  water: {id:'water',name:'الماء',icon:'💧',color:'#4a9eff',desc:'تحكم وسيل وشفاء',
    spells:[
      {id:'water_bolt',name:'سهم الماء',tier:1,cost:7,dmg:16,cd:1100,icon:'💧',tier_name:'مبتدئ'},
      {id:'healing_wave',name:'موجة الشفاء',tier:2,cost:20,dmg:-30,cd:4000,icon:'💚',tier_name:'متوسط',heal:true},
      {id:'tidal',name:'المد العاتي',tier:3,cost:26,dmg:48,cd:3200,icon:'🌊',tier_name:'متقدم'},
      {id:'abyss',name:'هاوية المحيط',tier:4,cost:42,dmg:82,cd:5800,icon:'🐚',tier_name:'سيد'}
    ]},
  ice: {id:'ice',name:'الجليد',icon:'❄️',color:'#7ac4ff',desc:'تجميد ودروع بلورية',
    spells:[
      {id:'frost_bolt',name:'سهم الصقيع',tier:1,cost:8,dmg:17,cd:1200,icon:'❄️',tier_name:'مبتدئ'},
      {id:'ice_shield',name:'درع الجليد',tier:2,cost:18,dmg:0,cd:5000,icon:'🛡️',tier_name:'متوسط',shield:true},
      {id:'blizzard',name:'العاصفة الثلجية',tier:3,cost:30,dmg:50,cd:3400,icon:'🌨️',tier_name:'متقدم'},
      {id:'absolute_zero',name:'الصفر المطلق',tier:4,cost:48,dmg:88,cd:6200,icon:'🧊',tier_name:'سيد'}
    ]},
  nature: {id:'nature',name:'الطبيعة',icon:'🌿',color:'#4ed88a',desc:'نباتات وجذور وشفاء',
    spells:[
      {id:'vine_whip',name:'سوط الكرمة',tier:1,cost:7,dmg:15,cd:1100,icon:'🌿',tier_name:'مبتدئ'},
      {id:'natures_grace',name:'نعمة الطبيعة',tier:2,cost:22,dmg:-35,cd:4200,icon:'🍃',tier_name:'متوسط',heal:true},
      {id:'thorn_storm',name:'عاصفة الأشواك',tier:3,cost:28,dmg:47,cd:3300,icon:'🌵',tier_name:'متقدم'},
      {id:'world_tree',name:'شجرة العالم',tier:4,cost:46,dmg:85,cd:6000,icon:'🌳',tier_name:'سيد'}
    ]},
  shadows: {id:'shadows',name:'الظلال',icon:'🌑',color:'#7a4bd4',desc:'تخفٍ وسحر مظلم',
    spells:[
      {id:'shadow_bolt',name:'سهم الظل',tier:1,cost:8,dmg:19,cd:1200,icon:'🌑',tier_name:'مبتدئ'},
      {id:'veil',name:'حجاب الظلام',tier:2,cost:16,dmg:0,cd:4500,icon:'👁️',tier_name:'متوسط',evade:true},
      {id:'void_lash',name:'سوط الفراغ',tier:3,cost:30,dmg:54,cd:3400,icon:'🌀',tier_name:'متقدم'},
      {id:'eclipse',name:'الكسوف',tier:4,cost:50,dmg:95,cd:6500,icon:'🌚',tier_name:'سيد'}
    ]},
  time: {id:'time',name:'الزمن',icon:'⏳',color:'#f5c451',desc:'تحكم في الزمن',
    spells:[
      {id:'temporal_bolt',name:'سهم الزمن',tier:1,cost:9,dmg:18,cd:1300,icon:'⏳',tier_name:'مبتدئ'},
      {id:'slow_time',name:'تباطؤ الزمن',tier:2,cost:20,dmg:0,cd:6000,icon:'🐢',tier_name:'متوسط',slow:true},
      {id:'chrono_blast',name:'انفجار زمني',tier:3,cost:32,dmg:52,cd:3600,icon:'⏰',tier_name:'متقدم'},
      {id:'rift',name:'صدع الزمن',tier:4,cost:48,dmg:92,cd:6300,icon:'🌌',tier_name:'سيد'}
    ]}
};

const FUSIONS = [
  {a:'fire',b:'water',id:'steam',name:'تحول البخار',dmg:65,cost:30,cd:4000,icon:'♨️',desc:'بخار يحرق ويغلي'},
  {a:'fire',b:'ice',id:'frozen_flame',name:'اللهب المتجمد',dmg:70,cost:32,cd:4200,icon:'🔥',desc:'لهب لا يذوب جليده'},
  {a:'fire',b:'nature',id:'ashen_forest',name:'الغابة الرمادية',dmg:62,cost:28,cd:3800,icon:'🌲',desc:'رماد ينبت منه الحياة'},
  {a:'fire',b:'shadows',id:'shadow_ember',name:'جمرة الظل',dmg:68,cost:30,cd:4000,icon:'🔥',desc:'لهب لا يصنع ضوءًا'},
  {a:'fire',b:'time',id:'moment_flame',name:'لهب اللحظة',dmg:75,cost:35,cd:4500,icon:'⏳',desc:'يحرق الماضي والحاضر'},
  {a:'water',b:'ice',id:'tide_crystal',name:'كريستال المد',dmg:60,cost:26,cd:3600,icon:'💎',desc:'بلورات مائية لا تنصهر'},
  {a:'water',b:'nature',id:'life_pulse',name:'نبض الحياة',dmg:-50,cost:30,cd:5000,icon:'💚',desc:'شفاء عميق من تدفق الحياة',heal:true},
  {a:'water',b:'shadows',id:'dark_mist',name:'الضباب المظلم',dmg:63,cost:28,cd:3800,icon:'🌫️',desc:'ضباب يخفي ويخنق'},
  {a:'water',b:'time',id:'river_moments',name:'نهر اللحظات',dmg:70,cost:32,cd:4200,icon:'🌊',desc:'يجرف الزمن نفسه'},
  {a:'ice',b:'nature',id:'winter_garden',name:'حديقة الشتاء',dmg:64,cost:28,cd:3800,icon:'❄️',desc:'زهور تنمو فوق الجليد'},
  {a:'ice',b:'shadows',id:'night_frost',name:'صقيع الليل',dmg:66,cost:30,cd:4000,icon:'🌨️',desc:'برودة تلتهم الضوء'},
  {a:'ice',b:'time',id:'frozen_second',name:'الثانية المتجمدة',dmg:72,cost:33,cd:4300,icon:'⏱️',desc:'يوقف لحظة ويحطمها'},
  {a:'nature',b:'shadows',id:'dusk_roots',name:'جذور الغسق',dmg:65,cost:29,cd:3900,icon:'🌿',desc:'جذور تنمو في الظلام'},
  {a:'nature',b:'time',id:'buds_past',name:'براعم الماضي',dmg:68,cost:31,cd:4100,icon:'🌸',desc:'زهور من زمن آخر'},
  {a:'shadows',b:'time',id:'time_rift',name:'صدع الزمن',dmg:80,cost:38,cd:4800,icon:'🌌',desc:'يمزق نسيج الواقع'}
];

const ENEMIES = [
  {id:'imp',name:'عفريت صغير',icon:'👺',hp:45,dmg:6,gold:15,exp:18,level:1},
  {id:'wolf',name:'ذئب ظل',icon:'🐺',hp:70,dmg:9,gold:25,exp:28,level:2},
  {id:'golem',name:'غولم حجري',icon:'🗿',hp:120,dmg:12,gold:45,exp:50,level:3},
  {id:'wraith',name:'طيف هائم',icon:'👻',hp:100,dmg:15,gold:50,exp:55,level:3},
  {id:'treant',name:'شجرة حية',icon:'🌳',hp:160,dmg:14,gold:60,exp:70,level:4},
  {id:'siren',name:'حورية الماء',icon:'🧜',hp:130,dmg:18,gold:65,exp:75,level:4},
  {id:'skeleton',name:'هيكل عظمي',icon:'💀',hp:90,dmg:16,gold:40,exp:45,level:3},
  {id:'darkmage',name:'ساحر الظلام',icon:'🧙',hp:200,dmg:22,gold:100,exp:130,level:5},
  {id:'dragon',name:'تنين صغير',icon:'🐉',hp:280,dmg:28,gold:150,exp:200,level:6},
  {id:'boss_lich',name:'الملك الليتش',icon:'☠️',hp:450,dmg:35,gold:400,exp:500,level:8,boss:true},
  {id:'boss_time',name:'حارس الزمن',icon:'⏳',hp:520,dmg:40,gold:500,exp:650,level:9,boss:true},
  {id:'boss_shadow',name:'سيد الظلال',icon:'🌑',hp:600,dmg:45,gold:600,exp:800,level:10,boss:true}
];

const ZONES = [
  {id:'academy',name:'الأكاديمية',icon:'🏰',desc:'موطن السحر والتعلم',level:1,enemies:['imp','skeleton'],unlocked:true},
  {id:'forest',name:'الغابة المسحورة',icon:'🌲',desc:'أشجار تنبض بالسحر',level:2,enemies:['wolf','treant','skeleton']},
  {id:'caves',name:'كهوف الصقيع',icon:'🕳️',desc:'برد قاتل وظلال',level:3,enemies:['golem','wraith','wolf']},
  {id:'ruins',name:'الأطلال القديمة',icon:'🏛️',desc:'أسرار منسية',level:4,enemies:['wraith','skeleton','darkmage']},
  {id:'lake',name:'بحيرة الأسرار',icon:'🌊',desc:'مياه تحتفظ بأسرارها',level:5,enemies:['siren','golem','darkmage']},
  {id:'tower',name:'برج الساحر',icon:'🗼',desc:'مقر سيد الظلام',level:7,enemies:['darkmage','dragon','boss_lich']},
  {id:'void',name:'صدع الزمن',icon:'🌌',desc:'نهاية كل شيء',level:10,enemies:['boss_time','boss_shadow','dragon']}
];

const TEACHERS = [
  {id:'t_fire',name:'المعلم إغناطيوس',element:'fire',icon:'🔥',line:'النار ليست عدوًا، إنها انعكاس لروحك. تعال، سنحرق المستحيل.'},
  {id:'t_water',name:'المعلمة سيلين',element:'water',icon:'💧',line:'الماء يجد طريقه دائمًا. تعلم أن تكون ماءً.'},
  {id:'t_ice',name:'المعلم فروست',element:'ice',icon:'❄️',line:'الجليد يحفظ الأشياء كما هي. لكنه أيضًا يقتل ما لا يتغير.'},
  {id:'t_nature',name:'المعلمة غايا',element:'nature',icon:'🌿',line:'كل جذر يعرف طريقه. اسمعهم.'},
  {id:'t_shadows',name:'المعلم نوكس',element:'shadows',icon:'🌑',line:'أعمق الظلال تخفي أنقى الأسرار.'},
  {id:'t_time',name:'المعلم كرونوس',element:'time',icon:'⏳',line:'الزمن ليس خطًا. إنه نهر. تعلم السباحة.'}
];

const QUESTS = [
  {id:'q_intro',type:'main',name:'بداية الرحلة',desc:'اختر تخصصك الأول وتحدث مع معلمك.',
   objectives:[{type:'talk_teacher',count:1,current:0}],
   reward:{exp:50,gold:30,skill:1},state:'active'},
  {id:'q_first_lesson',type:'main',name:'الدرس الأول',desc:'أكمل درسًا واحدًا مع معلمك.',
   objectives:[{type:'complete_lesson',count:1,current:0}],
   reward:{exp:80,gold:50,skill:1},state:'locked',requires:['q_intro']},
  {id:'q_first_fight',type:'main',name:'أول اختبار',desc:'اهزم عدوًا واحدًا في الأكاديمية.',
   objectives:[{type:'kill',count:1,current:0}],
   reward:{exp:100,gold:60,skill:1},state:'locked',requires:['q_first_lesson']},
  {id:'q_explore',type:'exploration',name:'مستكشف صغير',desc:'افتح المنطقة الثانية في الخريطة.',
   objectives:[{type:'unlock_zone',count:1,current:0}],
   reward:{exp:120,gold:80,skill:1},state:'active'},
  {id:'q_fusion',type:'main',name:'الاندماج الأول',desc:'اكتشف أول اندماج بين عنصرين.',
   objectives:[{type:'fusion',count:1,current:0}],
   reward:{exp:200,gold:150,skill:2},state:'locked',requires:['q_first_fight']},
  {id:'q_boss',type:'main',name:'الليتش',desc:'اهزم الملك الليتش في برج الساحر.',
   objectives:[{type:'kill_boss',count:1,current:0}],
   reward:{exp:500,gold:400,skill:3},state:'locked',requires:['q_fusion']},
  {id:'q_side1',type:'side',name:'المساعد الصغير',desc:'اهزم 5 أعداء في الغابة.',
   objectives:[{type:'kill_zone',zone:'forest',count:5,current:0}],
   reward:{exp:150,gold:100},state:'active'},
  {id:'q_side2',type:'side',name:'الجمع',desc:'اجمع 500 ذهب.',
   objectives:[{type:'gold',count:500,current:0}],
   reward:{exp:100,skill:1},state:'active'}
];

const LEVEL_EXP = lvl => Math.floor(100 * Math.pow(1.35, lvl - 1));
const MAX_ENERGY = lvl => 50 + lvl * 10;
const MAX_HP = lvl => 100 + lvl * 15;