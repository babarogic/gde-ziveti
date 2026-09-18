# Gde ćemo živeti?

Alat koji pomaže paru da uporedi mesta za život kroz:

- lične prioritete oba partnera
- faze života
- procenu svake lokacije
- obavezne uslove
- razlike koje treba razgovarati ili istražiti

## Lokalno pokretanje

Potrebni su Node.js 20.9 ili noviji i Supabase projekat.

```bash
npm install
copy .env.example .env.local
npm run dev
```

U `.env.local` unesite Supabase URL i public key.

## Provere

```bash
npm run lint
npm run test
npm run build
```

Sve tri provere odjednom:

```bash
npm run check
```

## Privatni prostor za svaki par

Podrazumevani režim još koristi postojeći red `framework_data/shared`, kako se
trenutni podaci ne bi izgubili tokom migracije.

Za privatne prostore:

1. U Supabase SQL editoru pokrenite
   `supabase/migrations/001_private_couple_workspaces.sql`.
2. U Supabase Authentication uključite **Anonymous Sign-Ins**.
3. U `.env.local` postavite:

   ```env
   NEXT_PUBLIC_PRIVATE_WORKSPACES=true
   ```

4. Ponovo pokrenite aplikaciju.

Prvi član dobija novi privatni prostor i dugme za kopiranje pozivnice. Drugi
član se pridružuje preko tog linka. RLS dozvoljava pristup samo tim članovima.

### Postojeći zajednički podaci

Uključivanje privatnih prostora pravi nov, prazan prostor. Postojeći `shared`
podaci ostaju netaknuti. Pre uključivanja sačuvajte važne beleške ili ih ručno
prebacite u novi prostor.

## Kako se računa rezultat

- 80%: prioriteti osobe × koliko ih lokacija ispunjava
- 20%: koliko lokacija odgovara izabranoj fazi života
- obavezni uslov može da diskvalifikuje lokaciju
- pobednik se prikazuje tek kada obe osobe završe prioritete i ocene lokacija

Polazne procene lokacija nisu činjenice. Treba ih menjati kada par proveri
prevoz, škole, zdravstvo, infrastrukturu i cenu.
