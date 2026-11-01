const flightSearch = (from, to, numbers) => {
  const q = new URLSearchParams({ dcity: from, acity: to, ddate: '2027-02-13', rdate: '2027-02-18', class: 'Y', triptype: 'RT', quantity: '2', locale: 'ru-RU', curr: 'RUB', sort: 'price' });
  if (numbers) q.set('topflightno', numbers);
  return `https://ru.trip.com/flights/showfarefirst?${q}`;
};

window.TRAVEL_DATA = [
  {
    id: 'dubai', country: 'ОАЭ', city: 'Дубай', title: 'Песок, залив и город будущего',
    mood: 'тепло · архитектура · пустыня', fullDays: '4 полных дня', arrival: '13 февраля, 21:35', departure: '18 февраля, 07:35',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Dubai_Desert_Dunes.jpg/1280px-Dubai_Desert_Dunes.jpg',
    imageSource: 'https://commons.wikimedia.org/wiki/File:Dubai_Desert_Dunes.jpg', imageCredit: 'Kamyana / Wikimedia Commons, CC BY-SA 4.0',
    intro: 'Старый Дубай, вид на Бурдж-Халифу, берег залива и один вечер среди дюн. Жить в центре и не менять отель.',
    flight: { from: 'Сочи', to: 'Дубай', out: '13.02 · 12:40 → 21:35 · 1 пересадка', back: '18.02 · 07:35 → 17:30 · 1 пересадка', detail: 'Найденные рейсы WY182 / WY611 и FZ717 / 3F3349. Вылет из Краснодара до Сочи и обратную дорогу нужно добавить отдельно.', url: flightSearch('AER','DXB','WY182,WY611,FZ717,3F3349') },
    hotel: { name: 'Hotel Indigo Dubai Downtown', room: 'Suite: на сайте отеля указана ванна; наличие этой категории на даты нужно подтвердить.', area: 'Business Bay / Downtown', url: 'https://ru.trip.com/hotels/dubai-hotel-detail-28300294/hotel-indigo-dubai-downtown-by-ihg/?checkIn=2027-02-13&checkOut=2027-02-18&adult=2&crn=1&locale=ru-RU&curr=RUB', proof: 'https://www.hotelindigodubai.com/', map: 'Hotel Indigo Dubai Downtown', price: 'от 7 896 ₽', priceNote: 'Ориентир Trip.com за ночь по отелю, не цена люкса и не итог за 5 ночей.' },
    days: [
      { date:'13 февраля', title:'Прилёт и заселение', text:'После вечернего прилёта — трансфер и спокойный ужин рядом с отелем. На экскурсии этот день не рассчитываем.', places:[['Hotel Indigo Dubai Downtown','Hotel Indigo Dubai Downtown']], food:['Завтрак в дороге','В аэропорту или в дороге','Open Sesame, Hotel Indigo Dubai Downtown'] },
      { date:'14 февраля', title:'Старый Дубай', text:'Короткая прогулка по Аль-Фахиди, затем переправа через Dubai Creek и рынки Дейры. История города и эмиратская кухня.', places:[['Квартал Аль-Фахиди','Al Fahidi Historical Neighbourhood Dubai'],['Dubai Creek','Dubai Creek abra station'],['Рынок специй','Dubai Spice Souk']], food:['Arabian Tea House','Al Khayma Heritage Restaurant','Al Fanar Restaurant & Cafe'] },
      { date:'15 февраля', title:'Современный центр', text:'Заложить время на метро и очередь к смотровой. Бурдж-Халифа — по билету на выбранное время, вечером прогулка у Dubai Mall.', places:[['Бурдж-Халифа','Burj Khalifa Dubai'],['Dubai Mall','The Dubai Mall']], food:['Завтрак в отеле','Bait Maryam','Open Sesame, Hotel Indigo Dubai Downtown'] },
      { date:'16 февраля', title:'Залив и пустыня', text:'Неторопливое утро на побережье; во второй половине дня — групповое сафари на закате с короткими остановками.', places:[['Jumeirah Beach','Jumeirah Beach Dubai'],['Пустыня Дубая','Dubai Desert Conservation Reserve']], food:['Завтрак в отеле','Al Fanar Restaurant & Cafe','Ужин после сафари: Al Khayma Heritage Restaurant'] },
      { date:'17 февраля', title:'Архитектура и море', text:'Музей будущего по заранее выбранному сеансу или прогулка в Madinat Jumeirah; день можно сократить без потери обязательных пунктов.', places:[['Музей будущего','Museum of the Future Dubai'],['Madinat Jumeirah','Madinat Jumeirah Dubai']], food:['Завтрак в отеле','Arabian Tea House','Bait Maryam'] },
      { date:'18 февраля', title:'Обратная дорога', text:'Ранний выезд в аэропорт: завтрак в отеле может не пригодиться.', places:[['Аэропорт Дубая','Dubai International Airport']], food:['Завтрак в аэропорту','В дороге','В дороге'] }
    ],
    tours: [{ name:'Сафари на закате без кемпа', info:'Русскоязычная группа до 6 человек, около 4,5 часа; дату и стоимость уточнить.', url:'https://experience.tripster.ru/experience/102067/' }],
    hours: [{name:'Аль-Фахиди',value:'ежедневно 07:00–20:00',url:'https://www.visitdubai.com/en/articles/dubais-top-11-cultural-locations'}],
    foodSources: [{name:'Рестораны эмиратской кухни',url:'https://www.visitdubai.com/things-to-do/eat-and-drink/discover-emirati-cuisine-in-dubai'}],
    entry: 'https://u.ae/en/information-and-services/visa-and-emirates-id/visit-visas',
    note:'При бронировании сравнить цену Suite с завтраком и без него; тариф и доступность российской карты проверяются на шаге оплаты.'
  },
  {
    id:'oman', country:'Оман', city:'Маскат', title:'Белые города у гор и моря',
    mood:'море · культура · горы', fullDays:'4 полных дня', arrival:'13 февраля, 17:55', departure:'18 февраля, 05:25',
    image:'https://upload.wikimedia.org/wikipedia/commons/d/d8/N%C3%A1b%C5%99e%C5%BE%C3%AD_Matry.jpg',
    imageSource:'https://commons.wikimedia.org/wiki/File:N%C3%A1b%C5%99e%C5%BE%C3%AD_Matry.jpg', imageCredit:'Ondřej Žváček / Wikimedia Commons',
    intro:'Маскат как спокойная база: мечеть, набережная Матраха, крепость Низва и день у воды. Переезды загородом — с гидом.',
    flight:{from:'Сочи',to:'Маскат',out:'13.02 · 12:40 → 17:55 · прямой',back:'18.02 · 05:25 → 12:00 · 1 пересадка',detail:'Найдены WY182 и EY691 / EY857. До Сочи и обратно из Краснодара — отдельная наземная дорога.',url:flightSearch('AER','MCT','WY182,EY691,EY857')},
    hotel:{name:'Grand Hyatt Muscat',room:'Стандартный номер: на сайте Hyatt указаны ванна и отдельный душ.',area:'Шатти-аль-Курум',url:'https://ru.trip.com/hotels/muscat-hotel-detail-2144302/grand-hyatt-muscat/?checkIn=2027-02-13&checkOut=2027-02-18&adult=2&crn=1&locale=ru-RU&curr=RUB',proof:'https://www.hyatt.com/grand-hyatt/en-US/musca-grand-hyatt-muscat/rooms',map:'Grand Hyatt Muscat',price:'от 17 922 ₽',priceNote:'Ориентир Trip.com за ночь по отелю; тариф нужного номера уточнить.'},
    days:[
      {date:'13 февраля',title:'Море после перелёта',text:'Трансфер к отелю, прогулка у пляжа Курум и спокойный вечер.',places:[['Grand Hyatt Muscat','Grand Hyatt Muscat'],['Пляж Курум','Qurum Beach Muscat']],food:['Завтрак в дороге','В дороге','Bait Al Luban']},
      {date:'14 февраля',title:'Мечеть и опера',text:'Для немусульман мечеть открыта утром; после — экскурсия в оперный театр и кафе у моря.',places:[['Мечеть султана Кабуса','Sultan Qaboos Grand Mosque Muscat'],['Королевская опера','Royal Opera House Muscat'],['Пляж Курум','Qurum Beach Muscat']],food:['Завтрак в отеле','Rozna Restaurant','Bait Al Luban']},
      {date:'15 февраля',title:'Низва и зелёные горы',text:'Групповой выезд около 10 часов: форт, базар и виды Джебель-Ахдар без длинных пеших маршрутов.',places:[['Форт Низва','Nizwa Fort Oman'],['Биркат-аль-Мауз','Birkat Al Mouz Oman'],['Джебель-Ахдар','Jebel Akhdar Oman']],food:['Завтрак в отеле','Обед на маршруте экскурсии','Rozna Restaurant']},
      {date:'16 февраля',title:'Матрах и старый Маскат',text:'Набережная и рынок, затем Национальный музей. Маршрут можно разбить на короткие прогулки.',places:[['Набережная Матраха','Muttrah Corniche Muscat'],['Рынок Матраха','Muttrah Souq Muscat'],['Национальный музей','National Museum of Oman']],food:['Завтрак в отеле','Bait Al Luban','Rozna Restaurant']},
      {date:'17 февраля',title:'Острова Дайманият',text:'Пятичасовая морская прогулка при подходящей погоде; альтернативой остаётся отдых на пляже Курум.',places:[['Марина Аль-Мудж','Al Mouj Marina Muscat'],['Острова Дайманият','Daymaniyat Islands Nature Reserve Oman']],food:['Завтрак в отеле','Обед после морской прогулки','Bait Al Luban']},
      {date:'18 февраля',title:'Ранний вылет',text:'Выезд из отеля ночью. Завтрак в тарифе на это утро может быть бесполезен.',places:[['Аэропорт Маската','Muscat International Airport']],food:['В дороге','В дороге','В дороге']}
    ],
    tours:[{name:'Низва, Биркат-аль-Мауз и Джебель-Ахдар',info:'Русскоязычная группа, около 10 часов; наличие мест на февраль уточнить.',url:'https://experience.tripster.ru/experience/103828/'},{name:'Острова Дайманият',info:'Морская прогулка, около 5 часов; выход зависит от погоды.',url:'https://experience.tripster.ru/experience/110731/'}],
    hours:[{name:'Мечеть султана Кабуса',value:'сб–чт 08:00–11:00 для немусульман',url:'https://experienceoman.om/en/destinations/muscat/sultan-qaboos-grand-mosque'},{name:'Экскурсии в опере',value:'ежедневно 08:30–17:30, кроме пятницы',url:'https://rohmuscat.org.om/en/MobileSite/Pages/Tour-Policy.aspx'}],
    foodSources:[{name:'Оманская кухня',url:'https://experienceoman.om/ru/chem-zanyat-sya-v-omane/kul-tura-i-nasledie?activeItemId=fe3693d9-5be1-4c19-8f0a-e81fd8259920'}],
    entry:'https://www.fm.gov.om/en/visitors/entry-visas/',note:'Проверить условия въезда для паспортов РФ и время встречи у гида. Для ночного выезда нужна договорённость о трансфере.'
  },
  {
    id:'baku', country:'Азербайджан', city:'Баку', title:'Каменный город и земля огня',
    mood:'Старый город · Каспий · Гобустан',fullDays:'3 полных дня + часть 14-го',arrival:'14 февраля, 02:00',departure:'18 февраля, 03:00',
    image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Old_city_baku.jpg/1280px-Old_city_baku.jpg',imageSource:'https://commons.wikimedia.org/wiki/File:Old_city_baku.jpg',imageCredit:'Gulustan / Wikimedia Commons, CC BY-SA 3.0',
    intro:'Ночные рейсы оставляют три спокойных дня и часть дня прилёта. База у набережной, один загородный выезд к петроглифам и огню.',
    flight:{from:'Краснодар',to:'Баку',out:'13.02 · 15:35 → 14.02, 02:00 · 1 пересадка',back:'18.02 · 03:00 → 12:10 · 1 пересадка',detail:'Найдены SU1209 / SU1850 и SU1851 / SU1682. Ночной прилёт и вылет требуют трансфера.',url:flightSearch('KRR','BAK','SU1209,SU1850,SU1851,SU1682')},
    hotel:{name:'Radisson Hotel Baku',room:'Ванна указана на официальной странице для некоторых категорий; выбрать конкретную категорию с ванной.',area:'Набережная / центр',url:'https://ru.trip.com/hotels/baku-hotel-detail-3106100/park-inn-by-radisson-baku-hotel/?checkIn=2027-02-13&checkOut=2027-02-18&adult=2&crn=1&locale=ru-RU&curr=RUB',proof:'https://www.radissonhotels.com/en-us/hotels/radisson-hotel-baku/rooms',map:'Radisson Hotel Baku',price:'от 7 486 ₽',priceNote:'Ориентир Trip.com за ночь по отелю, не по выбранной категории с ванной.'},
    days:[
      {date:'13 февраля',title:'Дорога до Баку',text:'Вечерний вылет. Номер с 13 февраля нужен для заселения после 02:00 без ожидания дневного check-in.',places:[['Radisson Hotel Baku','Radisson Hotel Baku']],food:['В дороге','В дороге','В дороге']},
      {date:'14 февраля',title:'Старый город без спешки',text:'После ночного прилёта начать поздно: Ичери-шехер, Девичья башня и ужин на площади Фонтанов.',places:[['Ичери-шехер','Icherisheher Baku'],['Девичья башня','Maiden Tower Baku'],['Площадь Фонтанов','Fountains Square Baku']],food:['Поздний завтрак в отеле','Firuzə Restaurant','Dolma Restaurant Baku']},
      {date:'15 февраля',title:'Баку современный',text:'Центр Гейдара Алиева, затем бульвар у Каспия и вечерний вид на Пламенные башни.',places:[['Центр Гейдара Алиева','Heydar Aliyev Center Baku'],['Бакинский бульвар','Baku Boulevard'],['Пламенные башни','Flame Towers Baku']],food:['Завтрак в отеле','Firuzə Restaurant','Shirvanshah Museum Restaurant']},
      {date:'16 февраля',title:'Гобустан и Апшерон',text:'Экскурсия к петроглифам, грязевым вулканам, Атешгяху и Янардагу. Вечер оставить свободным.',places:[['Гобустан','Gobustan Rock Art Cultural Landscape'],['Атешгях','Ateshgah Fire Temple Baku'],['Янардаг','Yanar Dag Baku']],food:['Завтрак в отеле','Обед на маршруте экскурсии','Dolma Restaurant Baku']},
      {date:'17 февраля',title:'Дворцы и Каспий',text:'Дворец Ширваншахов, музей ковра и неспешный вечер у моря перед ночным вылетом.',places:[['Дворец Ширваншахов','Palace of the Shirvanshahs Baku'],['Музей ковра','Azerbaijan National Carpet Museum']],food:['Завтрак в отеле','Firuzə Restaurant','Shirvanshah Museum Restaurant']},
      {date:'18 февраля',title:'Ночной вылет',text:'Аэропорт ночью; завтрак в гостинице на 18 февраля не нужен.',places:[['Аэропорт Баку','Heydar Aliyev International Airport']],food:['В дороге','В дороге','В дороге']}
    ],
    tours:[{name:'Гобустан и Апшерон',info:'Русскоязычная поездка к петроглифам и вулканам; проверка даты обязательна.',url:'https://experience.tripster.ru/experience/121689/'}],
    hours:[{name:'Девичья башня и дворец Ширваншахов',value:'ежедневно 10:00–19:00',url:'https://icherisheher.gov.az/en/activity/historical-reference'},{name:'Firuzə Restaurant',value:'ежедневно 12:00–01:00',url:'https://firuzerestoran.az/en/'}],
    foodSources:[{name:'Firuzə Restaurant',url:'https://firuzerestoran.az/en/'}],entry:'https://evisa.gov.az/en/countries',note:'Позднее заселение 14-го требует подтверждения от отеля; ночь 13–14 включена ради доступа к номеру.'
  },
  {
    id:'uzbekistan',country:'Узбекистан',city:'Ташкент',title:'Шёлковый путь за несколько дней',
    mood:'базары · Самарканд · Тянь-Шань',fullDays:'3 полных дня + часть 14-го',arrival:'14 февраля, 09:10',departure:'18 февраля, 03:45',
    image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Registan_01.jpg/1280px-Registan_01.jpg',imageSource:'https://commons.wikimedia.org/wiki/File:Registan_01.jpg',imageCredit:'Bernard Gagnon / Wikimedia Commons, CC0',
    intro:'Ташкент как база, поезд в Самарканд и отдельный день у Чимганских гор. Выбор для культуры, ремёсел и местной кухни.',
    flight:{from:'Краснодар',to:'Ташкент',out:'13.02 · 19:20 → 14.02, 09:10 · 1 пересадка',back:'18.02 · 03:45 → 12:10 · 1 пересадка',detail:'Найдены SU1157 / SU1890 и SU1871 / SU1682. Номер с 13 февраля полезен для раннего заселения.',url:flightSearch('KRR','TAS','SU1157,SU1890,SU1871,SU1682')},
    hotel:{name:'Hyatt Regency Tashkent',room:'King Room: на официальной странице подтверждены отдельная ванна и душ.',area:'Центр, улица Навои',url:'https://ru.trip.com/hotels/tashkent-hotel-detail-8410376/hyatt-regency-tashkent/?checkIn=2027-02-13&checkOut=2027-02-18&adult=2&crn=1&locale=ru-RU&curr=RUB',proof:'https://www.hyatt.com/hyatt-regency/en-US/tasrt-hyatt-regency-tashkent/rooms/KING',map:'Hyatt Regency Tashkent',price:'цену уточнить',priceNote:'Рублёвый тариф King Room на эти даты в поиске не подтверждён.'},
    days:[
      {date:'13 февраля',title:'Вылет из Краснодара',text:'Ночной путь с пересадкой. Номер с 13 февраля — для заселения утром 14-го.',places:[['Hyatt Regency Tashkent','Hyatt Regency Tashkent']],food:['В дороге','В дороге','В дороге']},
      {date:'14 февраля',title:'Знакомство с Ташкентом',text:'После раннего прилёта — отдых, затем Хазрати-Имам и Чорсу. Не планировать полный экскурсионный день.',places:[['Хазрати-Имам','Hazrati Imam Complex Tashkent'],['Рынок Чорсу','Chorsu Bazaar Tashkent']],food:['Завтрак в отеле после заселения','Центр плова Беш Козон','Caravan Restaurant Tashkent']},
      {date:'15 февраля',title:'Самарканд',text:'День на скоростном поезде: Регистан, близкие памятники и местная кухня. Время поездов на февраль проверить при открытии продаж.',places:[['Регистан','Registan Square Samarkand'],['Сиабский базар','Siab Bazaar Samarkand']],food:['Завтрак в отеле','Обед в Самарканде у Регистана','Ужин в Ташкенте: Caravan Restaurant']},
      {date:'16 февраля',title:'Городская культура',text:'Метро, Музей прикладного искусства и гастрономическая улица Тараса Шевченко.',places:[['Музей прикладного искусства','State Museum of Applied Arts of Uzbekistan Tashkent'],['Ташкентское метро','Alisher Navoi Metro Tashkent'],['Улица Тараса Шевченко','Taras Shevchenko Street Tashkent']],food:['Завтрак в отеле','Центр плова Беш Козон','Caravan Restaurant Tashkent']},
      {date:'17 февраля',title:'Чимган и Чарвак',text:'Групповой выезд на целый день в горы; маршрут и погода зимой нуждаются в подтверждении у гида.',places:[['Амирсой','Amirsoy Mountain Resort Uzbekistan'],['Чимган','Chimgan Mountains Uzbekistan'],['Чарвак','Charvak Reservoir Uzbekistan']],food:['Завтрак в отеле','Обед на экскурсии','Ужин у отеля']},
      {date:'18 февраля',title:'Вылет до рассвета',text:'Завтрак в отеле не нужен; трансфер организовать заранее.',places:[['Аэропорт Ташкента','Tashkent International Airport']],food:['В дороге','В дороге','В дороге']}
    ],
    tours:[{name:'Чимган, Амирсой и Чарвак',info:'Русскоязычная групповая экскурсия; зимнюю программу и дату проверить.',url:'https://experience.tripster.ru/experience/70928/'},{name:'Поезд Ташкент — Самарканд',info:'Расписание и билеты на официальном сайте железных дорог.',url:'https://eticket.railway.uz/ru/'}],
    hours:[{name:'Регистан',value:'ежедневно 08:00–20:00 в период 20.11–20.02',url:'https://www.registon.uz/ru/'}],
    foodSources:[{name:'Гастрономия Ташкента',url:'https://uzbekistan.travel/en/o/aroma-tashkent-cuisine/'}],entry:'https://gov.uz/en/mfa/pages/o-zbekiston-respublikasi-vizasi',note:'Самарканд зависит от билетов на скоростной поезд. Если расписание не подходит, перенести его в отдельную будущую поездку.'
  },
  {
    id:'kazakhstan',country:'Казахстан',city:'Алматы',title:'Горы в одном шаге от города',
    mood:'снег · канатные дороги · каньоны',fullDays:'3 полных дня + части 14-го и 18-го',arrival:'14 февраля, 07:45',departure:'18 февраля, 22:20',
    image:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/Shymbulak%2C_Almaty_%28P1180200%29.jpg/1280px-Shymbulak%2C_Almaty_%28P1180200%29.jpg',imageSource:'https://commons.wikimedia.org/wiki/File:Shymbulak,_Almaty_(P1180200).jpg',imageCredit:'Matti Blume / Wikimedia Commons, CC BY-SA 4.0',
    intro:'Снежный Шымбулак, городская еда и один день у красных скал Чарына. Зимняя погода определит окончательный план.',
    flight:{from:'Краснодар',to:'Алматы',out:'13.02 · 19:20 → 14.02, 07:45 · 1 пересадка',back:'18.02 · 22:20 → 19.02, 09:45 · 1 пересадка',detail:'Найдены SU1157 / SU1942 и SU1947 / SU1264. Возвращение в Краснодар — 19 февраля утром.',url:flightSearch('KRR','ALA','SU1157,SU1942,SU1947,SU1264')},
    hotel:{name:'Гостиница «Алматы»',room:'Представительский люкс: ванна и душ подтверждены на сайте отеля; проверить доступность категории.',area:'Исторический центр',url:'https://ru.trip.com/hotels/almaty-hotel-detail-6376176/almaty-hotel/?checkIn=2027-02-13&checkOut=2027-02-18&adult=2&crn=1&locale=ru-RU&curr=RUB',proof:'https://hotelalmaty.kz/rooms/predstavitelskiy-lyuks/',map:'Almaty Hotel Kabanbay Batyr 85 Almaty',price:'от 8 056 ₽',priceNote:'Ориентир Trip.com за ночь по отелю; люкс с ванной стоит иначе.'},
    days:[
      {date:'13 февраля',title:'Ночной перелёт',text:'Номер с 13 февраля даст возможность заселиться сразу после утреннего прилёта 14-го.',places:[['Гостиница «Алматы»','Almaty Hotel Kabanbay Batyr 85']],food:['В дороге','В дороге','В дороге']},
      {date:'14 февраля',title:'Алматы после прилёта',text:'Отдых после дороги, затем Парк 28 панфиловцев и Зелёный базар без длинного перехода.',places:[['Парк 28 панфиловцев','Panfilov Park Almaty'],['Зелёный базар','Green Bazaar Almaty']],food:['Завтрак после заселения','NAVAT Almaty','Auyl Restaurant Almaty']},
      {date:'15 февраля',title:'Медеу и Шымбулак',text:'Полдня в горах: автобус или такси до Медеу, канатная дорога на Шымбулак и короткие прогулки на видовых точках.',places:[['Медеу','Medeu Ice Rink Almaty'],['Шымбулак','Shymbulak Mountain Resort']],food:['Завтрак в отеле','Обед на Шымбулаке','NAVAT Almaty']},
      {date:'16 февраля',title:'Кок-Тобе и центр',text:'Канатная дорога на Кок-Тобе, затем музей или кафе в городе. Запасной спокойный день после гор.',places:[['Кок-Тобе','Kok Tobe Almaty'],['Центральный государственный музей','Central State Museum of Kazakhstan Almaty']],food:['Завтрак в отеле','Auyl Restaurant Almaty','NAVAT Almaty']},
      {date:'17 февраля',title:'Чарын: длинный выезд',text:'Поездка к каньону только при подходящей зимней дороге и подтверждении гида. Для короткой прогулки достаточно обзорных точек, без спуска к реке.',places:[['Чарынский каньон','Charyn Canyon Valley of Castles Kazakhstan']],food:['Завтрак в отеле','Обед на экскурсии','Auyl Restaurant Almaty']},
      {date:'18 февраля',title:'Последний день и вылет',text:'Неспешный центр города, камера хранения в отеле и вечерний вылет. В Россию — 19 февраля.',places:[['Улица Панфилова','Panfilov Street Almaty'],['Аэропорт Алматы','Almaty International Airport']],food:['Завтрак в отеле','NAVAT Almaty','Ужин до аэропорта']}
    ],
    tours:[{name:'Алматы, Медеу и Шымбулак',info:'Русскоязычная экскурсия; проверьте зимний маршрут и доступность.',url:'https://experience.tripster.ru/experience/121957/'},{name:'Выезды в Чарынский каньон',info:'Выбрать короткий маршрут с обзорными точками; февральскую доступность подтвердить.',url:'https://experience.tripster.ru/experience/Almaty/38234-charynskij-kanon/'}],
    hours:[{name:'Медеу и Шымбулак',value:'сезонный график подъёмников: проверить перед поездкой',url:'https://nta.visitalmaty.kz/en/guides/medeu-and-shymbulak-how-to-get-there'},{name:'Кок-Тобе',value:'график канатной дороги: проверить перед поездкой',url:'https://nta.visitalmaty.kz/en/guides/kok-tobe-guide'}],
    foodSources:[{name:'NAVAT',url:'https://www.navat.kz/'}],entry:'https://egov.kz/cms/en/articles/for_foreigners/visa_regime_for_foreigners',note:'В каталоге указан вылет 18 февраля, но посадка в Краснодаре — 19-го. Погоду и дорогу к Чарыну перепроверить.'
  }
];

