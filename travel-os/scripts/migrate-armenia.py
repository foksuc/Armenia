"""Reproducible migration from exact immutable V1; never fetch live prices."""
from pathlib import Path
from bs4 import BeautifulSoup
import hashlib,json,re
root=Path(__file__).resolve().parents[1]
raw=root/'public/original/armenia-v1'
soup=BeautifulSoup((raw/'index.html').read_text(),'html.parser')
def txt(n): return n.get_text(' ',strip=True) if n else ''
def save(p,x): (root/p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
manifest={'repository':'https://github.com/foksuc/Armenia','commit':'a96b811bb87d0ec2ed200211215fe02a3f3a2e62','capturedAt':'2026-10-31','pricesRecordedAt':'2026-10-24','files':{f.name:{'sha256':hashlib.sha256(f.read_bytes()).hexdigest()} for f in raw.iterdir() if f.name in ['README.md','index.html','script.js','style.css']}}
save('public/original/armenia-v1/manifest.json',manifest)
sections=[{'title':txt(n.select_one('h2')) or 'Вступление','text':txt(n),'links':[{'label':txt(a),'url':a.get('href') or 'https://www.google.com/maps/search/?api=1&query='+__import__('urllib.parse',fromlist=['quote']).quote(a['data-map'])} for a in n.select('a[href],a[data-map]')]} for n in soup.select('main > section')]
save('src/data/armenia-original.json',{'sections':sections,'footer':txt(soup.footer),'readme':(raw/'README.md').read_text(),'snapshotCommit':manifest['commit']})
links=list(dict.fromkeys(a['href'] for a in soup.select('a[href]') if a['href'].startswith('https://')))
sources=[{'id':'v1-source','title':'Оригинальная Армения V1, неизменяемый коммит','url':'https://github.com/foksuc/Armenia/blob/'+manifest['commit']+'/index.html','checkedAt':'2026-10-31','type':'other','notes':'Цены и часы в оригинале зафиксированы 24.10.2026, заново не проверялись.'}]+[{'id':f'source-{i+1}','title':next((txt(a) for a in soup.select('a[href]') if a['href']==u),u),'url':u,'checkedAt':'2026-10-24','type':'other','notes':'Источник из V1; дата проверки сохранена из V1.'} for i,u in enumerate(links)]
queries=list(dict.fromkeys(a['data-map'] for a in soup.select('[data-map]')))
place_names=['ibis Yerevan Center','Площадь Республики','Lavash','Музей истории','Вернисаж','Концертный комплекс','Храм Гарни','Гегард','Симфония камней','Хор Вирап','Нораванк','Арени','Матенадаран','Каскад','Wine Republic','Аэропорт Еревана','Станция Адлер','Greenpoint','ArtBridge','Gata Tavern','Tavern Yerevan','Dolmama','Sherep','Tumanyan Shaurma']
places=[]
for i,q in enumerate(queries):
 a=soup.select('[data-map]')[0]
 match=next(a for a in soup.select('[data-map]') if a['data-map']==q)
 food=next((n for n in soup.select('.food-card') if n['data-map']==q),None)
 cat='restaurant' if food else 'hotel' if 'ibis' in q else 'museum' if any(w in q for w in ['Museum','Matenadaran','Cafesjian']) else 'concert' if 'Demirchyan' in q else 'transport' if any(w in q for w in ['Airport','Railway']) else 'landmark'
 places.append({'id':f'am-place-{i+1}','name':txt(food.select_one('h3')) if food else ('Концертный комплекс' if 'Karen Demirchyan' in q else txt(match).replace(' ↗','')),'category':cat,'address':q,'location':None,'description':txt(food) if food else None,'sourceIds':['v1-source']})
qids={q:p['id'] for q,p in zip(queries,places)}
prices=[]
def price(id,amount,basis='per_person',notes=None):
 prices.append({'id':id,'amount':amount,'currency':'RUB','basis':basis,'recordedAt':'2026-10-24','isEstimate':True,'sourceIds':['v1-source'],'notes':notes});return id
price('flight-krr',16819,notes='Туда-обратно на человека; 33 638 ₽ за двоих на Trip.com')
price('route-sochi',15689,notes='13 075 ₽ перелёт + 2 614 ₽ Ласточки; взаимоисключает прямой маршрут')
price('flight-sochi',13075);price('trains-sochi',2614)
price('concert',4237,notes='Танцпол; билеты ещё не куплены')
price('tour-garni',2530,notes=txt(soup.select('.tour-content')[0]))
price('tour-khor',4150,notes=txt(soup.select('.tour-content')[1]))
price('hotel-share-original',12301,notes='Округлённая половина номера из бюджета V1; сохранена без пересчёта')
price('tours-original-total',6700,notes='Исходный округлённый ориентир V1; 2 530 + 4 150 = 6 680, исходник не исправлен')
price('daily-low',15000,notes='Еда, городской транспорт, входы, нижняя оценка')
price('daily-high',20000,notes='Еда, городской транспорт, входы, верхняя оценка')
price('breakfast-addon',1286,notes='Доплата за утро; 12 858 ₽ за двоих / 5 ночей')
for id,n in [('greenpoint-low',825),('greenpoint-high',1004),('breakfast-ibis',1339)]:price(id,n)
for id,n in [('hotel-basic',24601),('hotel-flex',28275),('hotel-breakfast',37459),('hotel-breakfast-flex',40838)]:price(id,n,'total', 'За двоих / 5 ночей, налоги и сборы включены, Silver, Trip.com 24.10.2026')
def leg(id,mode,fr,to,date,dep,arr,arrdate=None,notes=None):return {'id':id,'mode':mode,'from':fr,'to':to,'date':date,'departTime':dep,'arriveTime':arr,'arriveDate':arrdate or date,'priceIds':[],'sourceIds':['v1-source'],'notes':notes}
transport=[{'id':'direct-krr','label':'Краснодар ↔ Ереван','description':'16 819 ₽ на человека · 33 638 ₽ за двоих. Время локальное: Краснодар Europe/Moscow, Ереван Asia/Yerevan.','legs':[leg('krr-out','plane','Краснодар','Ереван','2027-02-13','10:40','13:20'),leg('krr-back','plane','Ереван','Краснодар','2027-02-18','08:40','09:25')],'priceIds':['flight-krr'],'sourceIds':['v1-source',sources[2]['id']]},{'id':'via-sochi','label':'Через Сочи · перелёт + Ласточки','description':'15 689 ₽ на человека: 13 075 ₽ перелёт + 2 614 ₽ поезда. Возвращение в Краснодар 19 февраля в 00:31; не смешивать с прямым рейсом. Время локальное для каждого города.','legs':[leg('train-out','train','Краснодар','аэропорт Сочи','2027-02-13','09:18','14:52'),leg('aer-out','plane','Сочи','Ереван','2027-02-13','18:30','20:40'),leg('aer-back','plane','Ереван','Сочи','2027-02-18','17:20','17:30'),leg('train-back','train','Адлер','Краснодар','2027-02-18','19:38','00:31','2027-02-19')],'priceIds':['route-sochi'],'sourceIds':['v1-source',next(s['id'] for s in sources if 'dcity=AER' in s['url'])]}]
hotel=soup.select_one('.hotel-panel')
acc=[]
for n,id in zip(hotel.select('.hotel-prices > div'),['hotel-basic','hotel-flex','hotel-breakfast','hotel-breakfast-flex']):acc.append({'id':id,'name':'ibis Yerevan Center · '+txt(n.select_one('span')),'placeId':qids['ibis Yerevan Center, 5/1 Northern Avenue, Yerevan'],'checkIn':'2027-02-13','checkOut':'2027-02-18','description':txt(hotel.select_one('p'))+' '+txt(n)+' '+txt(hotel.select_one('.hotel-price-note')),'priceIds':[id],'sourceIds':['v1-source',next(s['id'] for s in sources if '/hotels/yerevan' in s['url'])]})
days=[]
for i,day in enumerate(soup.select('.day')):
 events=[]
 for j,a in enumerate(day.select('.place-chips [data-map]')):
  st,en=None,None
  if i==1:st,en=[('11:00','13:00'),('13:00','15:00'),('20:00',None)][j]
  events.append({'id':f'am-event-{i+1}-{j+1}','title':txt(a).replace(' ↗',''),'description':None,'placeId':qids[a['data-map']],'startTime':st,'endTime':en,'durationMinutes':None,'transportMode':None,'priceIds':['concert'] if i==1 and j==2 else ['tour-garni'] if i==2 and j==0 else ['tour-khor'] if i==3 and j==0 else [],'sourceIds':['v1-source'],'externalLinks':[a['href'] for a in day.select('a[href]')]})
 desc=txt(day.select_one('.day-body > p'))
 hours=txt(day.select_one('.hours-line'))
 if hours:desc+=' '+hours
 days.append({'id':f'am-day-{i+1}','dayNumber':i+1,'date':f'2027-02-{13+i}','title':txt(day.select_one('h3')),'description':desc,'events':events})
p={'schemaVersion':'1.0.0','tripId':'armenia-2027','slug':'armenia-2027','status':'published','name':'Армения. На полную.','summary':'Один концерт. Четыре полных дня. Горы, древние монастыри, вино и вечерний Ереван.','destination':{'continent':'Asia','countryCode':'AM','countryName':'Армения','region':None,'cities':['Ереван','Гарни','Арени']},'dates':{'kind':'fixed','startDate':'2027-02-13','endDate':'2027-02-18','timezone':'Asia/Yerevan','durationDays':6},'travelers':{'adults':2,'children':0},'media':{'coverImage':None,'themeAccent':'#edb287'},'itinerary':days,'places':places,'transportOptions':transport,'accommodationOptions':acc,'priceRecords':prices,'sources':sources,'unresolved':[{'id':'verify-prices','severity':'warning','question':'Исторические цены и часы на 24.10.2026; наличие экскурсий на 15–16.02.2027 не подтверждено. Монастырские часы и зимний график Гарни уточнить.','relatedIds':[]},{'id':'missing-geometry','severity':'warning','question':'Дорожная геометрия не подтверждена; карта показывает проверенные точки без выдуманных линий.','relatedIds':[]}],'tags':['Горы','Культура','Концерт','Гастрономия'],'geo':{'routeStatus':'missing','notes':'Координаты обогащаются отдельно; проверенной дорожной геометрии нет.'}}
save('src/data/armenia-2027.json',p)
print('Migrated',len(days),'days,',len(places),'places,',sum(p['category']=='restaurant' for p in places),'restaurants,',len(prices),'price records,',len(sections),'complete original sections')
