1) Installatiehandleiding (README.md)
1. Inleiding
   DiCo (Diabetic Connect) is een full-stack applicatie die glucosemetingen, medicatie, beweging en services samenbrengt.
   •	Frontend: React (Vite)
   •	Backend: Spring Boot
   •	Database: PostgreSQL
   Belangrijkste features
   •	Registreren/inloggen met rollen (PATIENT, PROVIDER, GUARDIAN, ADMIN)
   •	Glucosemetingen vastleggen, inzien en exporteren
   •	Patiënt-koppelingen voor zorgverleners/voogden via toegangscode
   •	CSV-upload (glucose)
   •	LibreView & Google Fit flows (in ontwikkeling)
2. Benodigdheden
   Backend (Spring Boot + PostgreSQL)
   Component	Versie 	Functie
   Java JDK	21 LTS	Voor het uitvoeren van Spring Boot 3-applicaties. Gebruik geen JDK 23 (geen LTS).
   Maven	≥ 3.9	Build- en dependency-managementtool voor Java-projecten.
   PostgreSQL	15 of hoger	Relationele database waarin gebruikers- en glucosedata worden opgeslagen.
   Frontend (React + Vite)
   Component	Versie 	Functie
   Node.js	20 LTS	JavaScript-runtime voor ontwikkeling en build.
   npm	10 +	Package-manager voor Node-modules.
   Vite	Ingebouwd via npm-scripts	Snelle dev-server en bundler voor React.
   Browser	Chrome / Edge / Firefox (nieuwste versie)	Voor het draaien van de webapplicatie.

3. Projectstructuur
   Backend-structuur
   Map / Bestand	Beschrijving
   src/main/java/.../config/	Configuratiebestanden voor CORS, Security (JWT) en Jackson.
   src/main/java/.../controller/	REST-controllers die de API-endpoints beheren.
   src/main/java/.../dto/	Data Transfer Objects voor request- en response-modellen.
   src/main/java/.../model/	JPA-entiteiten die de database-tabellen vertegenwoordigen.
   src/main/java/.../repository/	Spring Data Repositories voor database-interactie.
   src/main/java/.../service/	De businesslogica van de applicatie.
   src/main/resources/application.properties	Configuratiebestand met database- en beveiligingsinstellingen.
   src/main/resources/data.sql	Voorbeelddata en demo-accounts voor tests.

Frontend-structuur
Map / Bestand	Beschrijving
src/components/	Herbruikbare UI-componenten (bijv. knoppen, kaarten, navigatiebalk).
src/pages/	Pagina’s zoals Login, Dashboard en Onboarding.
src/contexts/	Contextproviders voor authenticatie, onboarding en LibreView.
src/services/	Axios-services voor communicatie met de backend-API.
src/data/	Statische JSON-bestanden voor medicatie en apparaten.

4. Gebruikte technieken
   Backend
   De backend is ontwikkeld met Spring Boot 3, een robuust Java-framework voor het bouwen van REST-API’s.
   Beveiliging wordt geregeld via Spring Security met JWT-authenticatie (JSON Web Tokens).
   Data wordt beheerd met Spring Data JPA, waardoor interactie met de PostgreSQL-database efficiënt en type-veilig verloopt.
   Met Lombok wordt boilerplate-code verminderd (zoals getters, setters en constructors), en Maven zorgt voor dependency-beheer en project-builds.
   De backend vormt zo de kern van de applicatie — verantwoordelijk voor gebruikersbeheer, authenticatie, autorisatie en data-opslag.
   Frontend
   De frontend is gebouwd met React en Vite, wat zorgt voor snelle ontwikkelcycli en een lichte, performante build.
   Axios wordt gebruikt voor communicatie met de backend-API, terwijl React Router de navigatie binnen de webapplicatie verzorgt.
   De Context API beheert globale status (zoals ingelogde gebruiker en onboardingproces), en Recharts visualiseert glucose- en gezondheidsdata in overzichtelijke grafieken.
   De styling is opgebouwd met CSS Modules, zodat componenten overzichtelijk en onderhoudbaar blijven.
   Database
   De applicatie gebruikt PostgreSQL als relationele database.
   Alle entiteiten, zoals gebruikers, glucosemetingen, medicatie en profielen, zijn logisch met elkaar verbonden via one-to-one en one-to-many relaties.
   Je kunt deze database bekijken door PGadmin te gebruiken



5. Installatie en configuratie
   Om het project begrijpelijk te houden voor andere ontwikkelaars, heb ik ervoor gezorgd dat zowel de backend als de frontend eenvoudig lokaal te installeren zijn. Hieronder beschrijf ik stap voor stap hoe dit proces verloopt.
   Backend
   De backend kan worden opgezet door de repository te klonen vanaf GitHub:
   git clone https://github.com/Jelle701/DiCo-Backend-Novi
   Er moet gebruik gemaakt worden van een .env bestand. Deze wordt los van de git repo verstrekt.,
   Als alles goed staat ingesteld, kun je de applicatie bouwen en starten met de volgende commando’s:
   mvn clean install
   mvn spring-boot:run
   De backend is daarna bereikbaar via http://localhost:8080.
   Frontend
   De frontend installeer je op een vergelijkbare manier. Eerst clone je de repository:
   git clone GIT https://github.com/Jelle701/DiCo-Frontend-Novi
   Daarna installeer je de afhankelijkheden met npm:
   npm install
   Om de frontend met de backend te verbinden, moet er een .env-bestand aanwezig zijn.
   Deze wordt los van de git repo verstrekt.
   De applicatie kan daarna gestart worden met:
   npm run dev
   De frontend is vervolgens bereikbaar via http://localhost:5173.
   Zodra beide delen draaien, kan er volledig ingelogd, getest en gewerkt worden met de DiCo-applicatie.

6. Testen
   Om de backend te testen gebruik ik JUnit 5 en Mockito. De tests bevinden zich in de map /src/test/java/ en kunnen worden uitgevoerd met:
   mvn test
   Zodra de test zijn uitgevoerd worden de resultaten getoond in de terminal van de IDE.
7. Gebruikers, autorisaties en inloggen
   Een belangrijk onderdeel van DiCo is dat de juiste mensen toegang hebben tot de juiste gegevens.
   Omdat het gaat om medische data, heb ik veel aandacht besteed aan autorisatie en beveiliging.
   Elke gebruiker heeft één specifieke rol binnen de applicatie. Deze rol bepaalt welke onderdelen zichtbaar zijn en welke API-endpoints mogen worden aangeroepen.
   De vier rollen die ik heb geïmplementeerd zijn:
   PATIENT: de standaardgebruiker. Kan glucosemetingen invoeren, CSV-bestanden uploaden en persoonlijke gegevens beheren.
   PROVIDER: zorgverleners, zoals artsen of verpleegkundigen. Zij kunnen patiënten koppelen via een toegangscode en hun gezondheidsdata bekijken.
   GUARDIAN: voogden of ouders van jonge patiënten. Deze rol heeft alleen leesrechten en kan gegevens inzien, maar niet wijzigen.
   ADMIN: systeembeheerder. Kan gebruikers beheren, accounts verwijderen en de algemene activiteit van de app monitoren.
   De beveiliging is technisch uitgewerkt met Spring Security en JWT-tokens.
   Wanneer een gebruiker inlogt, wordt automatisch een token aangemaakt dat dertig minuten geldig blijft.
   Tijdens die sessie kan de gebruiker alleen de functies uitvoeren die bij zijn of haar rol horen.
   Ook de frontend past zich dynamisch aan op basis van deze rol.
   Een patiënt ziet bijvoorbeeld een persoonlijk dashboard met grafieken en glucosewaarden, terwijl een zorgverlener direct wordt doorgestuurd naar het patiëntoverzicht.
   Zo blijft de gebruikerservaring logisch, overzichtelijk en veilig.
   Voor testdoeleinden heb ik demo-accounts aangemaakt die automatisch worden ingeladen via het data.sql-bestand.
   Hiermee kan iedere ontwikkelaar of beoordelaar direct inloggen en de functionaliteiten van DiCo verkennen zonder handmatig accounts aan te maken.

Inloggen met testaccounts
Om de applicatie te kunnen testen, zijn drie standaardgebruikers beschikbaar, elk met een andere rol.
Alle accounts gebruiken hetzelfde wachtwoord: password.
Rol	E-mailadres	Wachtwoord
Patiënt	piet.patient@dico.com	password
Ouder/Voogd	gerda.ouder@dico.com	password
Zorgverlener	hans.zv@dico.com	password
Zorg dat beide onderdelen van de applicatie draaien:
Backend: http://localhost:8080
Frontend: http://localhost:5173
Open de frontend in je browser en log in met één van bovenstaande accounts.
Na een succesvolle login ontvang je automatisch een JWT-token waarmee alle beveiligde API-aanroepen worden gevalideerd.

Verificatie met nieuwe accounts
Wanneer je zelf een nieuw account registreert, wordt er op dit moment nog geen e-mail verstuurd voor verificatie.
De backend bevat de benodigde functionaliteit (via spring-boot-starter-mail), maar er is nog geen mailserver gekoppeld.
Om het proces toch te kunnen testen, wordt de verificatiecode automatisch gelogd in de console van de IDE.
Na registratie kun je deze code in de backendconsole terugvinden en handmatig gebruiken via het endpoint:
/api/auth/verify
In een latere versie van DiCo zal dit proces volledig automatisch verlopen via e-mail.

Navigeren binnen de applicatie
Na het inloggen word je automatisch doorgestuurd naar het dashboard dat hoort bij jouw rol:
Patiënt: persoonlijk overzicht met metingen, grafieken en exports.
Zorgverlener: patiëntoverzicht en rapportages.
Ouder/Voogd: leesrechten voor gekoppelde patiënten.
De frontend bewaart tijdelijk het JWT-token, zodat alle beveiligde verzoeken automatisch worden geauthenticeerd.
Wanneer de gebruiker uitlogt of de sessie verloopt, wordt het token verwijderd en moet opnieuw worden ingelogd.
Met deze testaccounts en toegangsstructuur kan iedere ontwikkelaar direct de kernfunctionaliteiten van DiCo testen zonder extra configuratie.
