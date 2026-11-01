(() => {
  const trips = window.TRAVEL_DATA || [];
  const map = query => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
  const ext = (url, label, className = '') => `<a class="${className}" href="${url}" target="_blank" rel="noopener noreferrer">${label}<span aria-hidden="true"> ↗</span></a>`;
  const imageButton = trip => `<button class="image-button" type="button" data-image="${trip.image}" data-caption="${trip.city} · ${trip.imageCredit}" aria-label="Увеличить фотографию ${trip.city}">Увеличить фото <span aria-hidden="true">↗</span></button>`;
  const placeLinks = places => places.map(([name, query]) => ext(map(query), name, 'place-link')).join('');
  const foodLink = item => {
    const name = item.includes(': ') ? item.split(': ').slice(1).join(': ') : item;
    if (/дороге|аэропорту|отеле|маршруте|экскурсии|прогулки|Самарканде у|Шымбулаке|до аэропорта|у отеля/i.test(name)) return item;
    return ext(map(name), item, 'food-link');
  };
  const lightbox = document.getElementById('lightbox');
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-image]');
    if (trigger && lightbox) {
      lightbox.querySelector('img').src = trigger.dataset.image;
      lightbox.querySelector('img').alt = trigger.dataset.caption;
      lightbox.querySelector('p').textContent = trigger.dataset.caption;
      lightbox.showModal();
    }
    if (e.target.closest('.close-lightbox')) lightbox.close();
    if (e.target === lightbox) lightbox.close();
  });

  const cards = document.getElementById('cards');
  if (cards) {
    const armenia = {
      city: 'Ереван', country: 'Армения', title: 'На концерте и у подножия Арарата',
      mood: 'музыка · горы · вино', fullDays: '4 полных дня', from: 'Краснодар или Сочи',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Khor_Virap_-_Armenia_%282911406199%29.jpg?width=1600',
      imageCredit: 'Rita Willaert / Wikimedia Commons, CC BY 2.0', href: './armenia/'
    };
    const all = [armenia, ...trips.map(t => ({...t, from: t.flight.from, href: './trip.html?id=' + t.id}))];
    cards.innerHTML = all.map((t, i) => `<article class="journey-card ${i === 0 ? 'featured' : ''}">
      <div class="card-visual" style="background-image:url('${t.image}')"><span class="card-index">0${i + 1} / 06</span>${imageButton(t)}</div>
      <div class="card-body"><p class="eyebrow">${t.country} / ${t.mood}</p><h3>${t.city}</h3><p class="card-title">${t.title}</p>
      <div class="card-meta"><span>13—18 ФЕВРАЛЯ</span><span>${t.fullDays}</span></div>
      <a class="card-link" href="${t.href}">Открыть маршрут <span aria-hidden="true">↗</span></a></div></article>`).join('');
    const tbody = document.getElementById('compare-body');
    tbody.innerHTML = all.map(t => `<tr><th scope="row">${t.country} · ${t.city}</th><td>${t.from}</td><td>${t.fullDays}</td><td>${t.mood}</td><td><a href="${t.href}">Открыть ↗</a></td></tr>`).join('');
  }

  const content = document.getElementById('trip-content');
  if (content) {
    const id = new URLSearchParams(location.search).get('id');
    const trip = trips.find(t => t.id === id);
    if (!trip) {
      content.innerHTML = '<section class="wrap missing"><h1>Маршрут не найден</h1><a href="./index.html">Вернуться в каталог</a></section>';
      return;
    }
    document.title = `${trip.city} · 13–18 февраля 2027 · ATLAS / 27`;
    content.innerHTML = `
      <section class="trip-hero" style="--trip-image:url('${trip.image}')">
        <div class="wrap trip-hero-content"><p class="eyebrow light">${trip.country} / 13—18 февраля 2027</p>
        <h1>${trip.city}<span class="dot">.</span></h1><p class="trip-title">${trip.title}</p>
        <p class="trip-intro">${trip.intro}</p><a class="pill light-pill" href="#days">Смотреть план ↓</a></div>
        <div class="trip-hero-bottom wrap"><span>02 ПУТЕШЕСТВЕННИКА</span><span>05 НОЧЕЙ</span><span>${trip.fullDays.toUpperCase()}</span></div>
      </section>
      <section class="trip-summary wrap">
        <div><p class="eyebrow">Как добраться</p><h2>${trip.flight.from} <span class="plane" aria-hidden="true">✈</span> ${trip.flight.to}</h2>
          <div class="flight-times"><p><b>Туда</b><span>${trip.flight.out}</span></p><p><b>Обратно</b><span>${trip.flight.back}</span></p></div>
          <p class="subtle">${trip.flight.detail}</p>${ext(trip.flight.url,'Проверить перелёт в ₽ на Trip.com','pill dark-pill')}</div>
        <div class="stay-panel"><p class="eyebrow">База в городе</p><h2>${trip.hotel.name}</h2><p>${trip.hotel.area}</p><p>${trip.hotel.room}</p>
          <div class="hotel-price"><strong>${trip.hotel.price}</strong><span>${trip.hotel.priceNote}</span></div>
          <div class="link-row">${ext(trip.hotel.url,'Проверить номер на Trip.com','text-link')}${ext(map(trip.hotel.map),'На Google Maps','text-link')}${ext(trip.hotel.proof,'Условия номера','text-link')}</div></div>
      </section>
      <section class="days-section" id="days"><div class="wrap"><div class="section-heading"><p class="eyebrow">День за днём</p><h2>Шесть дней,<br><em>свой ритм.</em></h2></div>
        <div class="days-list">${trip.days.map((d,i) => `<article class="day-row"><span class="day-num">0${i+1}</span><div class="day-main"><p class="eyebrow">${d.date}</p><h3>${d.title}</h3><p>${d.text}</p><div class="place-list">${placeLinks(d.places)}</div></div>
        <div class="day-food"><span class="eyebrow">Где поесть</span><ol>${d.food.map(f => `<li>${foodLink(f)}</li>`).join('')}</ol></div></article>`).join('')}</div>
      </div></section>
      <section class="trip-photo" style="--trip-image:url('${trip.image}')"><div class="wrap"><p class="eyebrow light">Место, которое запомнится</p><h2>${trip.title}</h2>${imageButton(trip)}</div></section>
      <section class="resources wrap" id="places"><div class="section-heading"><p class="eyebrow">Проверить и открыть</p><h2>Адреса и детали<span class="dot">.</span></h2></div>
        <div class="resource-grid"><article><span class="resource-num">01</span><h3>Экскурсии и билеты</h3>
          ${trip.tours.map(t => `<div class="resource-item"><p>${t.name}</p><small>${t.info}</small>${ext(t.url,'Посмотреть тур','text-link')}</div>`).join('')}</article>
        <article><span class="resource-num">02</span><h3>Часы работы</h3>
          ${trip.hours.map(h => `<div class="resource-item"><p>${h.name}</p><small>${h.value}</small>${ext(h.url,'Источник','text-link')}</div>`).join('')}</article>
        <article><span class="resource-num">03</span><h3>Полезные ссылки</h3>
          <div class="resource-item"><p>Правила въезда</p><small>Проверьте для граждан РФ перед покупкой билетов.</small>${ext(trip.entry,'Официальная информация','text-link')}</div>
          ${trip.foodSources.map(s => `<div class="resource-item"><p>${s.name}</p>${ext(s.url,'Подробнее','text-link')}</div>`).join('')}</article></div>
        <p class="notice">${trip.note}</p>
        <div class="photo-credit">Фото: ${ext(trip.imageSource,trip.imageCredit)}. Цены отелей — ориентиры из карточек Trip.com на дату исследования, не подтверждённая стоимость пяти ночей. Доступность рейсов, тарифов, экскурсий и часы работы могут измениться.</div>
      </section>
      <section class="next-trip wrap"><p class="eyebrow">Или куда-то ещё?</p><h2>Посмотрите все шесть маршрутов.</h2><a class="pill dark-pill" href="./index.html#journeys">К каталогу ↗</a></section>`;
  }
})();

