
Chceme vytvoriť zaujímavý MVP projekt pre Game book-style hru.

Chceme aby aplikácia integoravla OpenAI SDK na generovanie príbehu, aj ilustračných obrázkov


# User flow

- Intro obrazovka / menu
- Možnosť nastaviť dĺžku hry → počet stepov → AIčka by mala držať tento údaj v pamäti a snažiť sa uzavrieť príbeh +- počet stepov... mala by sa snažiť uzavrieť príbeh prirodzene, nie umelo náhlym sekom.
- Po spustení hry by mala byť v hornej časti obrazovky ilustrácia aktuálnej scény (GPT-image-2 rýchly model / low quality) a pod obrázkom stručný popis scény s načrtnutím možností ako pokračovať. Hráč by mal pod tým 2-3 predpoipravené buttony ako pokračovať a pod tým textové pole na odpoveď vlastnými slovami
- Jazykový model následne vyhodnocuje odpovede, vymýšľa obsah pre ďalší step(nová ilustrácie, nová situácie, nové možnosti na pokračovanie)
- Ak užívateľ zadá nezmysel, LLM má možnosť odmietnuť pokračovať, aplikácia zobrazí hlášku aby užívateľ odpovedal ešte raz.
- LLM musí odpovedať v structured output forme, definuj prosím vhodnú štruktúru, aby s tým vedela aplikácia pracovať
- Po úspešnom ukončení hry je nutné zobraziť Win orbazovku. Hru by tiež malo byť možné prehrať zlou voľbou, takže potrebujeme aj Game over obraozku.


# Tech stack

JavaScript, React
OpenAI SDK
Deploy to Netlify
Netlify serverless functions na komunikáciu s OpenAI a držanie .env kľúča
LLM odpovede integrované v aplikácii by mali používať niektorý z rýchlejších OpenAI modelov


# Obmedzenia

- Dizajn zatiaľ nechaj jednoduchý, k tomu sa ešte vrátime neskôr
- Zabezpeč, aby sa .env kľúče nedostali na stranu klienta, API kľúče by mali byť používané len v Netlify Function, ako aj celá komunikácia s OpenAI



# To be deffered until later
- Hudba počas hrania / generovaná alebo predpripravená sada rôznych skladieb


---

- Obrázky sa negenerujú, potrebujeme overiť


- Do hlavného menu pridaj možnosť vybrať si tému. Daj niekoľko predpirpravených možností a tiež možnosť uviesť vlastnú tému. Tiež pridaj možnosť vybrať si či majú byť texty stručné alebo 

- Keď zadám vlastnú odpoveď nemaž ju, kým sa neprepne obrazovka

- Urob texty vizuálne atraktívnejšie. Používaj bold, italic, paragrafy atp.

- Užívateľ potrebuje spätnú väzbu keď aplikácia čaká na odpoveď od AI... napr neajkaý loading alebo aj nejakú zaujímavejšiu animáciu

- Vygeneruj nejaký obrázok aj na konci pri game over / pri výhre


- 



 