// Pré-configuration complète avec 25 cases (modifiable à tout moment depuis le Mode Admin)
// Les tailles et motifs reproduisent l'équilibre visuel du Bento Chic (Images 1 & 2)

export const DEFAULT_CALENDAR_DATA = {
  settings: {
    recipientName: "Mon Cœur",
    calendarTitle: "Calendrier de l'Avent",
    headerSubtitle: "En attendant Noël avec toi…",
    footerText: "Fait avec amour ❤️",
    coverSubtitle: "25 petites attentions, souvenirs et surprises rien que pour toi en attendant Noël ✨",
    coverButtonText: "Ouvrir mes surprises",
    lockedMessage: "Patience mon amour… Cette case ne s'ouvrira que le {day} décembre ! 🎄",
    targetMonth: 11, // 11 = Décembre en JS (0-indexed), mais l'admin permet de tester ou changer
    targetYear: 2026,
    totalDays: 25,
    adminPin: "2901", // Code secret
  },
  days: [
    {
      day: 1,
      size: "normal", // normal (1x1), wide (2x1), tall (1x2)
      theme: "charcoal-snowflake",
      illustration: "snowflake",
      badgeText: "",
      title: "Le début de notre mois magique ✨",
      message: "Premier jour de décembre ! J'ai préparé ce petit calendrier rien que pour toi, pour que chaque matin jusqu'à Noël commence avec un sourire. Je t'aime fort.",
      coupon: {
        enabled: true,
        category: "Douceur du soir",
        offerTitle: "1 Chocolat Chaud & Film",
        offerSubtitle: "Préparé avec amour sous le plaid",
        stampText: "CHOCOLAT",
        color: "green"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 2,
      size: "wide",
      theme: "red-dots",
      illustration: "none",
      badgeText: "",
      title: "Un bon pour te faire chouchouter",
      message: "Aujourd'hui, tu n'as rien le droit de faire : installe-toi confortablement, je m'occupe de tout ce soir.",
      coupon: {
        enabled: true,
        category: "Bien-être",
        offerTitle: "Massage de 30 minutes",
        offerSubtitle: "Dos, épaules ou pieds, au choix",
        stampText: "RELAX",
        color: "cream"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 3,
      size: "normal",
      theme: "cream-solid",
      illustration: "gingerbread",
      badgeText: "",
      title: "Pause gourmande à deux 🍪",
      message: "Ce bonhomme en pain d'épices a un message pour toi : une petite douceur sucrée t'attend très bientôt !",
      coupon: {
        enabled: true,
        category: "Gourmandise",
        offerTitle: "Pâtisserie ou Goûter",
        offerSubtitle: "Dans ton salon de thé préféré",
        stampText: "MIAM",
        color: "red"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 4,
      size: "tall",
      theme: "sage-solid",
      illustration: "socks",
      badgeText: "",
      title: "Une chanson qui me fait penser à toi 🎶",
      message: "Chaque fois que j'entends cet air, je repense à nos meilleurs moments ensemble.",
      coupon: {
        enabled: false,
        category: "",
        offerTitle: "",
        offerSubtitle: "",
        stampText: "",
        color: "green"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "https://open.spotify.com",
      mediaLabel: "Écouter notre chanson"
    },
    {
      day: 5,
      size: "normal",
      theme: "red-stripes",
      illustration: "none",
      badgeText: "",
      title: "Soirée Cinéma en amoureux 🍿",
      message: "Tu choisis le film (même une comédie romantique de Noël !), je fournis le pop-corn.",
      coupon: {
        enabled: true,
        category: "Weekend Pass",
        offerTitle: "Soirée Cinéma",
        offerSubtitle: "Film de ton choix, zéro négociation",
        stampText: "CINÉMA",
        color: "green"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 6,
      size: "wide",
      theme: "cream-stripes",
      illustration: "none",
      badgeText: "",
      title: "Petit-déjeuner au lit 🥐",
      message: "Dimanche prochain (ou le jour de ton choix), reste sous la couette : les croissants chauds arrivent jusqu'à toi.",
      coupon: {
        enabled: true,
        category: "Matin Doux",
        offerTitle: "Petit-déj' au lit",
        offerSubtitle: "Viennoiseries & boisson chaude",
        stampText: "BRUNCH",
        color: "cream"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 7,
      size: "normal",
      theme: "sage-solid",
      illustration: "bauble",
      badgeText: "",
      title: "Ce que j'aime le plus chez toi ✨",
      message: "Ton rire, ta douceur et la façon dont tu illumines mes journées même quand il fait froid dehors.",
      coupon: {
        enabled: false,
        category: "",
        offerTitle: "",
        offerSubtitle: "",
        stampText: "",
        color: "green"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 8,
      size: "tall",
      theme: "sage-chevron",
      illustration: "none",
      badgeText: "",
      title: "Ton plat préféré cuisiné par ton chef 👨‍🍳",
      message: "Dis-moi ce qui te ferait plaisir, je fais les courses et je te prépare un vrai dîner aux chandelles à la maison.",
      coupon: {
        enabled: true,
        category: "Dîner Privé",
        offerTitle: "Menu du Chef à domicile",
        offerSubtitle: "Entrée, plat & dessert de ton choix",
        stampText: "CHEF",
        color: "red"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 9,
      size: "normal",
      theme: "red-dots",
      illustration: "star",
      badgeText: "",
      title: "Mon étoile à moi ⭐",
      message: "Regarde sous ton oreiller ou dans ta poche de manteau aujourd'hui… une petite surprise physique s'y est peut-être glissée !",
      coupon: {
        enabled: false,
        category: "",
        offerTitle: "",
        offerSubtitle: "",
        stampText: "",
        color: "cream"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 10,
      size: "wide",
      theme: "cream-stars",
      illustration: "bow",
      badgeText: "",
      title: "Balade illuminations & Vin chaud 🎄",
      message: "On s'habille bien chaudement et on part flâner devant les vitrines et le marché de Noël main dans la main.",
      coupon: {
        enabled: true,
        category: "Sortie d'Hiver",
        offerTitle: "Marché de Noël à deux",
        offerSubtitle: "Churros, marrons chauds ou vin chaud inclus",
        stampText: "NOËL",
        color: "green"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 11,
      size: "wide",
      theme: "charcoal-dots",
      illustration: "none",
      badgeText: "Bonnes Vacances",
      title: "Escapade en amoureux 🧳",
      message: "Vivement nos prochains jours de repos ensemble, loin de tout, juste toi et moi.",
      coupon: {
        enabled: true,
        category: "Évasion",
        offerTitle: "Journée surprise",
        offerSubtitle: "Programme secret organisé de A à Z",
        stampText: "VOYAGE",
        color: "cream"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 12,
      size: "wide",
      theme: "cream-solid",
      illustration: "none",
      badgeText: "",
      title: "Déjà la moitié du chemin vers Noël ! 🕯️",
      message: "Plus que 12 dodos avant le réveillon… Et encore plein de petites surprises à découvrir ici chaque matin.",
      coupon: {
        enabled: false,
        category: "",
        offerTitle: "",
        offerSubtitle: "",
        stampText: "",
        color: "green"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 13,
      size: "normal",
      theme: "cream-stripes",
      illustration: "none",
      badgeText: "",
      title: "Joker Corvée ! 🃏",
      message: "Utilise ce ticket quand tu veux pour passer ton tour sur la vaisselle, le ménage ou les courses.",
      coupon: {
        enabled: true,
        category: "Privilège Royal",
        offerTitle: "1 Joker Zéro Corvée",
        offerSubtitle: "Valable immédiatement sans discussion",
        stampText: "JOKER",
        color: "red"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 14,
      size: "normal",
      theme: "sage-chevron",
      illustration: "none",
      badgeText: "",
      title: "Un souvenir que j'adore 📸",
      message: "Tu peux ajouter ici votre photo préférée depuis le Mode Admin en 1 clic !",
      coupon: {
        enabled: false,
        category: "",
        offerTitle: "",
        offerSubtitle: "",
        stampText: "",
        color: "green"
      },
      photoUrl: "",
      photoCaption: "Nous deux ❤️",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 15,
      size: "normal",
      theme: "red-dots",
      illustration: "none",
      badgeText: "Xmas",
      title: "Restaurant en tête-à-tête 🍷",
      message: "Habille-toi chic (ou viens comme tu es), je t'invite dans le restaurant qui te fait envie depuis longtemps.",
      coupon: {
        enabled: true,
        category: "Gastronomie",
        offerTitle: "Soirée Restaurant",
        offerSubtitle: "L'adresse de tes rêves pour deux",
        stampText: "RESTO",
        color: "cream"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 16,
      size: "tall",
      theme: "charcoal-dots",
      illustration: "swirlTree",
      badgeText: "",
      title: "Sous le sapin lumineux 🌲",
      message: "Tu es la plus belle chose qui me soit arrivée cette année (et toutes les autres).",
      coupon: {
        enabled: false,
        category: "",
        offerTitle: "",
        offerSubtitle: "",
        stampText: "",
        color: "green"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 17,
      size: "normal",
      theme: "red-dots",
      illustration: "holly",
      badgeText: "",
      title: "Soirée Jeux ou Quiz en amoureux 🎲",
      message: "Le perdant offre un gage tout doux au gagnant !",
      coupon: {
        enabled: true,
        category: "Complicité",
        offerTitle: "Soirée Jeux & Cocktails",
        offerSubtitle: "Avec le droit d'inventer une règle",
        stampText: "PLAY",
        color: "green"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 18,
      size: "tall",
      theme: "sage-solid",
      illustration: "pineTree",
      badgeText: "",
      title: "J-7 avant Noël ! ❄️",
      message: "La dernière ligne droite avant les fêtes commence aujourd'hui.",
      coupon: {
        enabled: false,
        category: "",
        offerTitle: "",
        offerSubtitle: "",
        stampText: "",
        color: "cream"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 19,
      size: "normal",
      theme: "cream-solid",
      illustration: "polarBear",
      badgeText: "",
      title: "Gros câlin d'ours polaire 🐻‍❄️",
      message: "Ce petit ours te donne droit à des câlins illimités toute la journée pour te réchauffer.",
      coupon: {
        enabled: true,
        category: "Tendresse",
        offerTitle: "Câlins & Bisous illimités",
        offerSubtitle: "Abonnement à vie renouvelable",
        stampText: "LOVE",
        color: "red"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 20,
      size: "tall",
      theme: "sage-solid",
      illustration: "mittens",
      badgeText: "",
      title: "Toujours liés comme deux moufles 🧤",
      message: "Même au cœur de l'hiver, tant que j'ai ta main dans la mienne, tout est parfait.",
      coupon: {
        enabled: false,
        category: "",
        offerTitle: "",
        offerSubtitle: "",
        stampText: "",
        color: "green"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 21,
      size: "wide",
      theme: "red-stripes",
      illustration: "none",
      badgeText: "",
      title: "Premier jour de l'hiver ❄️",
      message: "La nuit la plus longue de l'année… parfaite pour cocooner tous les deux au chaud.",
      coupon: {
        enabled: true,
        category: "Cocooning",
        offerTitle: "Soirée Spa à la maison",
        offerSubtitle: "Bougies, musique douce & détente",
        stampText: "SPA",
        color: "cream"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 22,
      size: "normal",
      theme: "charcoal-dots",
      illustration: "none",
      badgeText: "",
      title: "Plus que 3 jours ! ✨",
      message: "Un petit indice sur ton vrai cadeau de Noël : il a été choisi avec énormément d'amour…",
      coupon: {
        enabled: false,
        category: "",
        offerTitle: "",
        offerSubtitle: "",
        stampText: "",
        color: "green"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 23,
      size: "normal",
      theme: "cream-stars",
      illustration: "bow",
      badgeText: "",
      title: "Avant-veille de Noël 🎀",
      message: "La magie opère déjà… Demain soir c'est le réveillon !",
      coupon: {
        enabled: false,
        category: "",
        offerTitle: "",
        offerSubtitle: "",
        stampText: "",
        color: "red"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 24,
      size: "normal",
      theme: "cream-solid",
      illustration: "giftBox",
      badgeText: "",
      title: "Joyeux Réveillon mon Amour 🥂",
      message: "Profite de chaque instant de cette belle soirée. J'ai tellement hâte d'être à demain matin avec toi.",
      coupon: {
        enabled: true,
        category: "Réveillon",
        offerTitle: "Vœu Exaucé",
        offerSubtitle: "Demande-moi ce qui te ferait plaisir",
        stampText: "VŒU",
        color: "green"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    },
    {
      day: 25,
      size: "normal",
      theme: "charcoal-dots",
      illustration: "none",
      badgeText: "Joyeux Noël",
      title: "Joyeux Noël mon Cœur ! 🎄❤️",
      message: "Merci de rendre ma vie si belle chaque jour de l'année. Regarde vite sous le sapin, ta vraie surprise t'y attend… Je t'aime !",
      coupon: {
        enabled: true,
        category: "Grand Final",
        offerTitle: "Ton Cadeau sous le Sapin",
        offerSubtitle: "À ouvrir dès maintenant !",
        stampText: "25 DÉC",
        color: "red"
      },
      photoUrl: "",
      photoCaption: "",
      mediaUrl: "",
      mediaLabel: ""
    }
  ]
};
