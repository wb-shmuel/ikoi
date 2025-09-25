import { Language } from './Languages';

// Multilingual quotes system
export const quotes: Record<Language, string[]> = {
  en: [
    "The LORD is my shepherd; I shall not want. (Psalm 23:1)",
    "Be still, and know that I am God. (Psalm 46:10)",
    "Come unto me, all ye that labour and are heavy laden, and I will give you rest. (Matthew 11:28)",
    "Peace I leave with you, my peace I give unto you. (John 14:27)",
    "Fear thou not; for I am with thee: be not dismayed; for I am thy God. (Isaiah 41:10)",
    "Now the God of hope fill you with all joy and peace in believing. (Romans 15:13)",
    "Casting all your care upon him; for he careth for you. (1 Peter 5:7)",
    "The LORD will give strength unto his people; the LORD will bless his people with peace. (Psalm 29:11)",
    "Now the Lord of peace himself give you peace always by all means. (2 Thessalonians 3:16)",
    "Yea, I have loved thee with an everlasting love. (Jeremiah 31:3)",
    "Nowhere with more quiet or freedom from trouble does a man retire than into his own soul. (Marcus Aurelius, Meditations)",
    "Men are disturbed, not by things, but by their views of things. (Epictetus, Enchiridion)",
    "Wherever there is a human being, there is an opportunity for kindness. (Seneca, On a Happy Life)",
    "Silence is a true friend who never betrays. (Confucius, Analects)",
    "Nature does not hurry, yet everything is accomplished. (Lao Tzu, Tao Te Ching)",
    "Better than a thousand hollow words is one word that brings peace. (Buddha, Dhammapada 100)",
    "This too shall pass. (Persian proverb)",
    "Behind the clouds is the sun still shining. (Longfellow, The Rainy Day)",
    "Nothing can bring you peace but yourself. (Emerson, Self-Reliance)",
    "Heaven is under our feet as well as over our heads. (Thoreau, Walden)",
    "Kindness is a language the deaf can hear and the blind can see. (Mark Twain)",
    "All shall be well, and all manner of thing shall be well. (Julian of Norwich, Revelations)",
    "Be happy for this moment. This moment is your life. (Omar Khayyam, Rubaiyat)",
    "Flow with whatever may happen, and let your mind be free. (Zhuangzi)",
    "Clouds come floating into my life to add color to my sunset sky. (Tagore, Stray Birds)",
    "Folks are usually about as happy as they decide to be. (Abraham Lincoln)",
    "Forever is composed of nows. (Emily Dickinson)",
    "Peace is always beautiful. (Walt Whitman, Leaves of Grass)",
    "Hatred is never appeased by hatred; it is appeased only by love. (Buddha, Dhammapada 5)",
    "Reflect upon your present blessings, not on your past misfortunes. (Charles Dickens, A Christmas Carol)"
  ],
  ja: [
    // Buddhist wisdom
    "心こそ、すべての根源なり。（法句経）",
    "過去を追うな、未来を願うな。ただ今ある瞬間に心を集中せよ。（中部経典）",
    "怒りをもって怒りに報いるなら、怒りは決して静まらない。（法句経）",
    "欲を離れる者こそが、真の富者である。（釈迦）",
    "一日一生。（禅語）",
    "春来たりなば花自ずから咲く。（禅語）",
    "雲は流れ、山は動かず。（無文元選）",
    "形にとらわれず、ただ生きよ。（良寛）",,
    "慈悲の心は最も強い力である。（弘法大師・空海）",
    "善人なほもて往生をとぐ、いはんや悪人をや。（親鸞『歎異抄』）",

    // Shinto spirituality
    "和を以て貴しとなす。（聖徳太子『十七条憲法』）",
    "すべてのものに神が宿る。（神道の教え）",
    "清らかな心で、今日という日を迎えよ。（神道）",
    "朝日と共に新しい自分になる。（神道）",
    "自然と調和することで、心は平穏を得る。（神道）",

    // Japanese historical figures
    "心を空にして、新しいものを受け入れよ。（千利休）",
    "小さなことからコツコツと。（二宮尊徳）",
    "仏道をならふというは、自己をならふなり。（道元『正法眼蔵』）",
    "自己をならふというは、自己を忘るるなり。（道元『正法眼蔵』）",
    "心をとどめず、ただ坐れ。（道元『普勧坐禅儀』）",
    "春は花 夏ほととぎす 秋は月 冬雪さえて涼しかりけり。（道元）",
    "静かに落ち着き、揺るがぬ心を持て。（孫子）",
    "変化を恐れず、流れに身を任せよ。（松尾芭蕉）",
    "心に太陽を持て。（高村光太郎）",
    "天は人の上に人を造らず、人の下に人を造らず。（福澤諭吉『学問のすゝめ』）",

    // Proverbs & simple wisdom
    "七転び八起き。（日本の諺）",
    "雨垂れ石を穿つ。（日本の諺）",
    "心配するな、なんとかなる。（日本の庶民の知恵）",

    // Global wisdom
    "困難の中にこそ、機会がある。（アインシュタイン）",
    "暗闇を呪うより、一つの小さな灯をともせ。（孔子／西洋でも引用）",
    "最も暗い夜も、やがて朝に変わる。（マーティン・ルーサー・キングJr.）",
    "不安に心を支配させてはいけない。心は自分のものだ。（マルクス・アウレリウス『自省録』）",
    "我々が恐れるべき唯一のものは、恐れそのものである。（フランクリン・ルーズベルト）",
    "嵐の後には必ず静けさが訪れる。（欧州の格言）"
  ]
};

// Legacy export for backward compatibility
export const Quote = quotes.en;
