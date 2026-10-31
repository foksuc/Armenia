from pathlib import Path
import urllib.request,json,urllib.parse
root=Path(__file__).resolve().parents[1]
def get(url):return json.load(urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'TravelOS/1.0 coordinate verification'}),timeout=25))
places=json.load(open(root/'src/data/armenia-2027.json'))['places']
lookup={'Хор Вирап':'Q1144626','Храм Гарни':'Q684072','Матенадаран':'Q1322278','Каскад':'Q2940844'}
points=[]
for name,q in lookup.items():
 entity=get('https://www.wikidata.org/wiki/Special:EntityData/'+q+'.json')['entities'][q]
 c=entity['claims']['P625'][0]['mainsnak']['datavalue']['value']
 place=next(p for p in places if p['name']==name)
 points.append({'type':'Feature','geometry':{'type':'Point','coordinates':[c['longitude'],c['latitude']]},'properties':{'placeId':place['id'],'name':name,'sourceUrl':'https://www.wikidata.org/wiki/'+q,'checkedAt':'2026-10-31','license':'CC0','precisionDegrees':c['precision']}})
(root/'src/data/armenia-enrichment.json').write_text(json.dumps({'type':'FeatureCollection','features':points},ensure_ascii=False,indent=2)+'\n')
print('Verified',len(points),'points, original locations remain null')
lookup={'Geghard':'Гегард','Noravank':'Нораванк','History Museum of Armenia':'Музей истории','Karen Demirchyan Complex':'Концертный комплекс','Republic Square, Yerevan':'Площадь Республики','Areni':'Арени','Vernissage':'Вернисаж','Symphony of Stones':'Симфония камней'}
u='https://en.wikipedia.org/w/api.php?'+urllib.parse.urlencode({'action':'query','format':'json','prop':'coordinates|info','inprop':'url','titles':'|'.join(lookup),'colimit':'max','redirects':1})
res=get(u)
for page in res['query']['pages'].values():
 if page.get('coordinates') and page['title'] in lookup:
  c=page['coordinates'][0];name=lookup[page['title']];place=next(p for p in places if p['name']==name)
  points.append({'type':'Feature','geometry':{'type':'Point','coordinates':[c['lon'],c['lat']]},'properties':{'placeId':place['id'],'name':name,'sourceUrl':page['fullurl'],'checkedAt':'2026-10-31','license':'CC BY-SA 4.0','precisionDegrees':None}})
(root/'src/data/armenia-enrichment.json').write_text(json.dumps({'type':'FeatureCollection','features':points},ensure_ascii=False,indent=2)+'\n')
print('Total verified',len(points),'points')
