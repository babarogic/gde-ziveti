export const PHASES = [
  {
    id: 'now', icon: '🌱', title: 'Sada', years: '0–2 god',
    desc: 'Pre dece ili odmah nakon — dvoje, posao, sloboda kretanja.',
    locs: {
      grad:     [['good','Sve dostupno, bez auta'],['good','Pun socijalni život'],['neutral','Stan — ok za dvoje'],['bad','Malo prostora dugoročno']],
      petro:    [['good','Blizu centra, karakter'],['good','Jeftiniji kvadrat'],['neutral','Auto pomaže ali nije must'],['neutral','Mirnije večeri']],
      kamenica: [['good','Odličan kvalitet vazduha'],['good','Prostor i zelenilo'],['bad','Auto obavezan svaki dan'],['neutral','Dobro za par koji radi od kuće']],
      bukovac:  [['good','Najjeftiniji start'],['good','Prostor za gradnju'],['bad','Daleko od svega'],['bad','Socijalna izolacija rizik']],
      zlatibor: [['good','Lifestyle reset'],['good','Priroda i planina'],['bad','Poslovna izolacija'],['bad','Daleko od porodice/prijatelja']]
    }
  },
  {
    id: 'baby', icon: '🍼', title: 'Malo dete', years: '0–4 god',
    desc: 'Beba do vrtića — vrtić, pedijatar, umor, logistika, podrška porodice.',
    locs: {
      grad:     [['good','Pedijatar i hitna odmah'],['good','Vrtić u blizini'],['good','Podrška porodice / bake'],['bad','Buka i zagađenje za dete']],
      petro:    [['good','Vrtić dostupan'],['good','Blizu hitne pomoći'],['good','Zelenilo + blizina'],['neutral','Malo manje opcija od centra']],
      kamenica: [['good','Čist vazduh za razvoj'],['neutral','Vrtić postoji ali manji izbor'],['bad','Svaka logistika zahteva auto'],['bad','Udaljenost od pedijatra']],
      bukovac:  [['bad','Pedijatar daleko'],['bad','Vrtić — malo opcija'],['bad','Urgentne situacije komplikovane'],['neutral','Mir za spavanje']],
      zlatibor: [['bad','Pedijatar — daleko i ograničeno'],['bad','Malo vrtića'],['bad','Podrška porodice nerealna'],['bad','Logistika veoma teška']]
    }
  },
  {
    id: 'school', icon: '🎒', title: 'Osnovna škola', years: '6–14 god',
    desc: 'Škola, vannastavne aktivnosti, drugarice, organizacija roditelja.',
    locs: {
      grad:     [['good','Vrhunske škole, izbor ogroman'],['good','Pešice ili biciklom'],['good','Sport, muzika, jezici — sve tu'],['neutral','Skuplje + gradski ritam']],
      petro:    [['good','OŠ postoji, blizu'],['good','Dete može biti samostalnije'],['neutral','Manji izbor vannastavnih'],['neutral','Blizu centra za aktivnosti']],
      kamenica: [['neutral','Škola postoji'],['bad','Sve aktivnosti zahtevaju vožnju'],['bad','Roditelj kao vozač non-stop'],['good','Drugačije detinjstvo — priroda']],
      bukovac:  [['bad','Osnovna škola — daleko ili mala'],['bad','Svaka aktivnost = sat vožnje'],['bad','Socijalna izolacija deteta'],['good','Sloboda i prostor']],
      zlatibor: [['bad','Osnovna škola ograničena'],['bad','Nema vannastavnih sadržaja'],['bad','Prijatelji — komplikovano'],['neutral','Priroda kao škola']]
    }
  },
  {
    id: 'teen', icon: '🎓', title: 'Tinejdžer', years: '14–18 god',
    desc: 'Srednja škola, socijalni život, mobilnost, prve ozbiljne odluke.',
    locs: {
      grad:     [['good','Sve srednje škole dostupne'],['good','Dete nezavisno — javni prevoz'],['good','Bogat socijalni život'],['neutral','Veći grad = veći izazovi']],
      petro:    [['good','Do centra lako'],['good','Dete relativno nezavisno'],['neutral','Manje opcija lokalno'],['good','Dobra osnova za odrastanje']],
      kamenica: [['neutral','Autobuska linija postoji'],['bad','Dete zavisno od roditelja za prevoz'],['neutral','Mirnije, fokusiranije'],['bad','Socijalni život ograničen']],
      bukovac:  [['bad','Daleko od srednje škole'],['bad','Dete zavisno od roditelja'],['bad','Socijalna izolacija ozbiljna'],['neutral','Može se promeniti do tada']],
      zlatibor: [['bad','Srednja škola — putovanje ili promena'],['bad','Dete mora u internat ili grad'],['neutral','Ako do tad prave bazu — ok'],['bad','Teško zadržati dete blizu']]
    }
  },
  {
    id: 'empty', icon: '🏠', title: 'Prazno gnezdo', years: '18+ god',
    desc: 'Deca odrasla, odlaze. Šta sad vi dvoje hoćete od mesta?',
    locs: {
      grad:     [['good','Kulturni i socijalni život'],['good','Dostupnost svega'],['neutral','Možda preveliko'],['neutral','Vrednost nekretnine stabilna']],
      petro:    [['good','Mir + blizina'],['good','Idealan omjer'],['good','Šetnja, kafić, karakter'],['neutral','Možda biste hteli promeniti']],
      kamenica: [['good','Mir i prostor za sebe'],['good','Natura, bašta, odmor'],['neutral','Auto i dalje potreban'],['good','Vrednost nekretnine raste']],
      bukovac:  [['good','Pravi mir'],['good','Prostor za goste/unuke'],['neutral','Pitanje infrastrukture do tad'],['good','Potencijal razvoja okoline']],
      zlatibor: [['good','Sanjski penzionerski lifestyle'],['good','Priroda celo leto'],['good','Turizam = prihodi'],['neutral','Zima može biti izazov']]
    }
  }
];

export const PRIORITIES = [
  'Blizina posla / klijenata',
  'Mir i tišina',
  'Priroda i vazduh',
  'Kafići, restorani, socijalni život',
  'Kvalitet obrazovanja (škole)',
  'Prostor za decu i baštu',
  'Logistika — prevoz bez auta',
  'Cena nekretnine / m²',
  'Infrastruktura (zdravstvo, servisi)',
  'Potencijal rasta vrednosti'
];

export const LOCATIONS = [
  {
    id: 'grad', name: 'Novi Sad — centar', tagline: 'Energija, dostupnost, kompromis',
    pros: ['Sve na dohvat ruke','Saobraćaj bez glave','Kulturni i poslovni život','Vrhunske škole na izbor','Dete nezavisno od malih nogu'],
    cons: ['Buka i zagađenje','Skuplje nekretnine po m²','Manje prostora','Parking problem']
  },
  {
    id: 'petro', name: 'Petrovaradin', tagline: 'Karakter, blizina, uspon',
    pros: ['Tvrđava i šarm','Blizu centra peške/biciklom','Mirnije + dostupno','Dobre škole u blizini'],
    cons: ['Brežuljasto — umorno dnevno','Manji izbor vannastavnih','Saobraćaj u špic','Manje nekretnina']
  },
  {
    id: 'kamenica', name: 'Sremska Kamenica', tagline: 'Fruškogorski mir, gradska dostupnost',
    pros: ['Priroda i zelenilo','Čist vazduh za decu','Mirna sredina','Relativno blizu Novog Sada'],
    cons: ['Auto obavezan uvek','Manje sadržaja za decu','Logistika aktivnosti naporna','Skuplje kuće']
  },
  {
    id: 'bukovac', name: 'Bukovac', tagline: 'Selo blizu grada — prostor i tišina',
    pros: ['Pravi mir i prostor','Najniža cena m²','Potencijal za izgradnju','Sloboda i bašta'],
    cons: ['Najdalje od centra','Škola i servisi problematično','Deca zavisna od roditelja','Socijalna izolacija rizik']
  },
  {
    id: 'zlatibor', name: 'Zlatibor', tagline: 'Radikalna promena — lifestyle bet',
    pros: ['Planinska priroda','Turizam = prihodi od nekretnine','Čist vazduh i kvalitet života','Rast vrednosti'],
    cons: ['Daleko od Novog Sada','Škole i aktivnosti ograničene','Porodica/prijatelji daleko','Logistika sa decom izuzetno teška']
  }
];

export const DEALBREAKERS = [
  'Do centra max 30 min',
  'Osnovna škola pešice ili linijom',
  'Pedijatar / hitna u blizini',
  'Vannastavne aktivnosti dostupne',
  'Gradska voda i gas',
  'Brzi internet / fiber',
  'Parking ili garaža',
  'Sopstveni zeleni prostor',
  'Javni prevoz za dete (od 10+ god)',
  'Blizu baka/deka (podrška)'
];
